import React from 'react';
import { Currency, Language } from '../types';
import { Globe, DollarSign } from 'lucide-react';

interface Props {
  language: Language;
  setLanguage: (l: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

export const LanguageCurrencyToggle: React.FC<Props> = ({ 
  language, 
  setLanguage, 
  currency, 
  setCurrency 
}) => {
  return (
    <div className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setLanguage(language === Language.ES ? Language.EN : Language.ES)}
        className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <Globe size={16} />
        <span>{language}</span>
      </button>
      
      <div className="w-px bg-gray-300 mx-2 h-6 self-center"></div>

      <button
        onClick={() => setCurrency(currency === Currency.MXN ? Currency.USD : Currency.MXN)}
        className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
      >
        <DollarSign size={16} />
        <span>{currency}</span>
      </button>
    </div>
  );
};