import { Language, Translation } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  [Language.ES]: {
    title: "Analizador de Estados de Cuenta",
    uploadPrompt: "Sube tu estado de cuenta (PDF) para comenzar",
    uploadButton: "Seleccionar PDF",
    analyzing: "Analizando documento con IA...",
    totalSpend: "Gasto Total",
    transactions: "Detalle de Transacciones",
    categoryDistribution: "Distribución de Gastos",
    date: "Fecha",
    description: "Descripción Original",
    amount: "Monto",
    category: "Categoría",
    cleanName: "Nombre Comercial",
    errorGeneric: "Ocurrió un error al procesar el archivo. Por favor intente de nuevo.",
    reset: "Analizar otro archivo",
    guest: "Huésped",
    room: "Habitación",
    checkIn: "Llegada",
    checkOut: "Salida",
    folio: "Folio",
    address: "Dirección",
    startDate: "Desde",
    endDate: "Hasta",
    exportCSV: "Exportar a CSV"
  },
  [Language.EN]: {
    title: "Hotel Statement Analyzer",
    uploadPrompt: "Upload your hotel statement (PDF) to start",
    uploadButton: "Select PDF",
    analyzing: "Analyzing document with AI...",
    totalSpend: "Total Spend",
    transactions: "Transaction Details",
    categoryDistribution: "Expense Distribution",
    date: "Date",
    description: "Original Description",
    amount: "Amount",
    category: "Category",
    cleanName: "Merchant Name",
    errorGeneric: "An error occurred while processing the file. Please try again.",
    reset: "Analyze another file",
    guest: "Guest",
    room: "Room",
    checkIn: "Check In",
    checkOut: "Check Out",
    folio: "Folio",
    address: "Address",
    startDate: "From",
    endDate: "To",
    exportCSV: "Export to CSV"
  }
};

export const EXCHANGE_RATE_MXN_TO_USD = 0.058; // Example static rate
export const EXCHANGE_RATE_USD_TO_MXN = 17.20; // Example static rate