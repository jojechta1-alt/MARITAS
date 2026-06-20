import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from './config';
import { 
  Utensils, Sparkles, DollarSign, MessageSquare 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [iaResponse, setIaResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAIResponse = async () => {
    if (!prompt.trim()) return;
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === "TU_API_KEY_DE_GEMINI_AQUI") {
      setIaResponse("⚠️ Por favor, introduce una API Key válida en el archivo src/config.js");
      return;
    }

    setLoading(true);
    try {
      // Inicialización compatible con tu versión de librería
      const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const contextPrompt = `Actúa como un experto asesor de catering y buffet para "Marita Buffet". Responde la siguiente consulta de manera profesional, estructurada y enfocada en rentabilidad: ${prompt}`;
      
      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      setIaResponse(response.text());
    } catch (error) {
      console.error(error);
      setIaResponse("❌ Error al conectar con Gemini. Verifica tu API Key y conexión de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <Utensils className="text-amber-400 w-8 h-8" />
            <div>
              <h1 className="font-bold text-lg leading-none">Marita Buffet</h1>
              <span className="text-xs text-slate-400">Panel de Gestión</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('ia')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ia' ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Sparkles className="w-4 h-4" /> Asistente de IA (Gemini)
            </button>
            <button 
              onClick={() => setActiveTab('cotizador')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cotizador' ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <DollarSign className="w-4 h-4" /> Cotizador Express
            </button>
          </nav>
        </div>
        
        <div className="border-t border-slate-800 pt-4 px-2 text-xs text-slate-400">
          Versión v0.1.0 • Listo para GitHub
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'ia' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Asistente Inteligente</h2>
              <p className="text-sm text-slate-500">Genera menús, calcula insumos o planifica la logística con Gemini.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Necesito un menú criollo para 50 personas, detalla los ingredientes necesarios y el margen sugerido..."
                className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              />
              <button
                onClick={generateAIResponse}
                disabled={loading}
                className="bg-slate-950 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Consultar a la IA'} <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {iaResponse && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Propuesta Generada
                </h3>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {iaResponse}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cotizador Rápido de Eventos</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Módulo de cálculo base de presupuestos y costos fijos/variables.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
