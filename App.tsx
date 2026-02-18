import React, { useState } from 'react';
import { AnalysisResult, Currency, Language } from './types';
import { TRANSLATIONS } from './constants';
import { analyzeStatement } from './services/geminiService';
import { LanguageCurrencyToggle } from './components/LanguageCurrencyToggle';
import { Dashboard } from './components/Dashboard';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.ES);
  const [currency, setCurrency] = useState<Currency>(Currency.MXN);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeStatement(file);
      setData(result);
    } catch (err) {
      console.error(err);
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800 hidden sm:block">
                {t.title}
              </span>
            </div>
            <LanguageCurrencyToggle 
              language={language} 
              setLanguage={setLanguage}
              currency={currency}
              setCurrency={setCurrency}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-red-700 font-medium">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">{t.analyzing}</h3>
            <p className="text-gray-500 mt-2 max-w-md text-center">
              Gemini is extracting tables, cleaning descriptions, and categorizing expenses...
            </p>
          </div>
        ) : !data ? (
          // Empty State / Upload
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="w-full max-w-lg">
              <label 
                htmlFor="file-upload" 
                className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-blue-400 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="mb-2 text-lg text-gray-700 font-medium">{t.uploadPrompt}</p>
                  <p className="text-xs text-gray-400">PDF, max 10MB</p>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="application/pdf"
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="font-semibold text-blue-600">1. Extract</p>
                  <p className="text-xs text-gray-500 mt-1">AI reads tables from PDF</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="font-semibold text-blue-600">2. Clean</p>
                  <p className="text-xs text-gray-500 mt-1">Normalizes merchant names</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="font-semibold text-blue-600">3. Categorize</p>
                  <p className="text-xs text-gray-500 mt-1">Groups by spending type</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard View
          <Dashboard 
            data={data} 
            language={language} 
            currency={currency} 
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;