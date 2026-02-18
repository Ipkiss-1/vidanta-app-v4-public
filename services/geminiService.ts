import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Category } from "../types";

const parsePdf = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove Data-URL declaration (e.g., data:application/pdf;base64,)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeStatement = async (file: File): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }

  const base64Data = await parsePdf(file);
  const ai = new GoogleGenAI({ apiKey });

  // Define the schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      hotelName: { type: Type.STRING, description: "Name of the hotel found in the header" },
      hotelAddress: { type: Type.STRING, description: "Address of the hotel" },
      guestName: { type: Type.STRING, description: "Name of the guest" },
      roomNumber: { type: Type.STRING, description: "Room number" },
      checkIn: { type: Type.STRING, description: "Arrival date (DD/MM/YYYY)" },
      checkOut: { type: Type.STRING, description: "Departure date (DD/MM/YYYY)" },
      confirmationNumber: { type: Type.STRING, description: "Folio or confirmation number" },
      detectedCurrency: { type: Type.STRING, description: "Currency symbol or code detected (MXN, USD, $)" },
      transactions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            originalDescription: { type: Type.STRING },
            cleanName: { 
              type: Type.STRING, 
              description: "Simplified commercial name. Remove dates, transaction codes, room numbers. E.g., 'REST EL PATIO 23423' -> 'El Patio'" 
            },
            amount: { type: Type.NUMBER },
            category: { 
              type: Type.STRING, 
              enum: Object.values(Category),
              description: "Categorize based on description. 'Dersan' or 'ISH' are Impuestos/Tax." 
            },
            currency: { type: Type.STRING }
          },
          required: ["date", "originalDescription", "cleanName", "amount", "category"]
        }
      },
      totalAmount: { type: Type.NUMBER }
    },
    required: ["hotelName", "guestName", "transactions", "totalAmount"]
  };

  const systemInstruction = `
    You are an expert financial analyst for hotel operations.
    Your task is to extract transaction data and header details from a hotel account statement PDF with perfect accuracy.

    CRITICAL RULES:
    1. Header Information: Extract Hotel Name, Address, Guest Name, Room Number, Folio/Confirmation number accurately from the top of the document. For dates like Check-In and Check-Out, convert formats like '19-01-26' to a standard 'DD/MM/YYYY' format (e.g., '19/01/2026').
    2. Transactions: Extract the Date, Description, and Amount for each line item in the main table.
    3. 'cleanName': From the original description, create a simplified commercial name. Remove dates, transaction codes, room numbers, and any other non-essential text. For example, 'REST EL PATIO 23423' should become 'El Patio'.
    4. 'category': Categorize strictly into:
       - Alimentos y Bebidas/Food & Beverage (Restaurants, Breakfast, Dinner, Bar, Lobby Bar, Minibar, Room Service Food)
       - Habitación/Room (Room charge, Upgrades, Early check-in)
       - Impuestos/Tax (Look specifically for 'Dersan', 'ISH', 'IVA', 'TUA', or generic tax descriptions)
       - Descuento/Discount (Any negative values, credits, or items labeled 'Abonos')
       - Servicio/Service (Tips, Laundry, Spa, Telephone, Transport, Valet Parking)
       - Otros/Other (Any other charge)
    5. Amounts: Handle negative numbers correctly for the 'amount' field. Credits and discounts must be negative.
    6. Currency: Accurately detect the currency of the document (e.g., MXN, USD).
    7. Total Amount: This is the most important field. Find the final total printed on the statement (e.g., 'Total MxN', 'Total Charges'). Use this value for the 'totalAmount' field. THIS IS THE SOURCE OF TRUTH AND IS MORE ACCURATE THAN MANUALLY SUMMING THE TRANSACTION LINES. For example, if the document shows 'Total MxN 25,224.10', you must use 25224.10.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "Analyze this hotel statement PDF and extract the data according to the JSON schema."
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    
    const result = JSON.parse(text) as AnalysisResult;
    
    // Data validation and correction: Ensure the dashboard total matches the extracted PDF total.
    // The dashboard recalculates spend, so we pass the authoritative total from the PDF.
    // If the model's summed transactions don't match its extracted total, this ensures the UI is still correct.
    const transactionSum = result.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    if (Math.abs(transactionSum - result.totalAmount) > 1) { // Allow for small rounding diffs
        console.warn(`Sum of transactions (${transactionSum}) does not match the extracted total amount (${result.totalAmount}). The extracted total will be used.`);
    }

    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
