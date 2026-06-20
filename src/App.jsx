import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from './config';
import { Utensils, Sparkles, DollarSign, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [iaResponse, setIaResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAIResponse = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(`Actúa como un experto asesor de catering y buffet para "Marita Buffet". ${prompt}`);
      const response = await result.response;
      setIaResponse(response.text());
    } catch (error) {
      console.error(error);
      setIaResponse("❌ Error al conectar con Gemini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Asistente Marita Buffet</h1>
          <textarea
            className="w-full h-32 p-3 border rounded-lg"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu consulta..."
          />
          <button
            onClick={generateAIResponse}
            className="bg-slate-900 text-white px-5 py-2 rounded-lg"
          >
            {loading ? 'Consultando...' : 'Consultar a la IA'}
          </button>
          {iaResponse && (
            <div className="p-4 bg-white border rounded-lg whitespace-pre-line">
              {iaResponse}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
