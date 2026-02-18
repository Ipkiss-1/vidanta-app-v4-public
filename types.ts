export enum Currency {
  MXN = 'MXN',
  USD = 'USD'
}

export enum Language {
  ES = 'ES',
  EN = 'EN'
}

export enum Category {
  FOOD_AND_BEVERAGE = 'Alimentos y Bebidas/Food & Beverage',
  ROOM = 'Habitación/Room',
  TAX = 'Impuestos/Tax',
  DISCOUNT = 'Descuento/Discount',
  SERVICE = 'Servicio/Service',
  OTHER = 'Otros/Other'
}

export interface Transaction {
  date: string;
  originalDescription: string;
  cleanName: string;
  amount: number;
  currency: string;
  category: Category;
}

export interface AnalysisResult {
  hotelName: string;
  hotelAddress: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  confirmationNumber: string;
  transactions: Transaction[];
  totalAmount: number;
  detectedCurrency: string;
}

export interface Translation {
  title: string;
  uploadPrompt: string;
  uploadButton: string;
  analyzing: string;
  totalSpend: string;
  transactions: string;
  categoryDistribution: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  cleanName: string;
  errorGeneric: string;
  reset: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  folio: string;
  address: string;
  startDate: string;
  endDate: string;
  exportCSV: string;
}