import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from './config';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [iaResponse, setIaResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAIResponse = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
      
      // CAMBIO AQUÍ: Usamos gemini-1.0-pro, que es el modelo universal
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
      
      const result = await model.generateContent(`Actúa como un experto asesor de catering para "Marita Buffet". ${prompt}`);
      const response = await result.response;
      setIaResponse(response.text());
    } catch (error) {
      console.error("Error:", error);
      setIaResponse("❌ Error: Tu API Key no tiene acceso al modelo solicitado. Por favor, crea una API Key nueva en https://aistudio.google.com/ e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex p-8">
      <div className="max-w-4xl mx-auto space-y-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900">Asistente Marita Buffet</h1>
        <textarea
          className="w-full h-32 p-3 border border-slate-300 rounded-lg"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu consulta..."
        />
        <button
          onClick={generateAIResponse}
          disabled={loading}
          className="bg-slate-900 text-white px-5 py-2 rounded-lg"
        >
          {loading ? 'Consultando...' : 'Consultar a la IA'}
        </button>
        {iaResponse && <div className="p-4 bg-white border rounded-lg whitespace-pre-line">{iaResponse}</div>}
      </div>
    </div>
  );
}
