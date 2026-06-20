import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from './config';
import { 
  Utensils, Sparkles, FileText, TrendingUp, 
  Plus, Trash2, DollarSign, Calendar, MessageSquare 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('ia');
  const [prompt, setPrompt] = useState('');
  const [iaResponse, setIaResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Inicializar Gemini de manera segura
  const generateAIResponse = async () => {
    if (!prompt.trim()) return;
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === "TU_API_KEY_DE_GEMINI_AQUI") {
      setIaResponse("⚠️ Por favor, introduce una API Key válida en el archivo src/config.js");
      return;
    }

    setLoading(true);
    try {
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
    <div class="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside class="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
          <div class="flex items-center gap-3 mb-8 px-2">
            <Utensils class="text-amber-400 w-8 h-8" />
            <div>
              <h1 class="font-bold text-lg leading-none">Marita Buffet</h1>
              <span class="text-xs text-slate-400">Panel de Gestión</span>
            </div>
          </div>

          <nav class="space-y-1">
            <button 
              onClick={() => setActiveTab('ia')}
              class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ia' ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <Sparkles class="w-4 h-4" /> Asistente de IA (Gemini)
            </button>
            <button 
              onClick={() => setActiveTab('cotizador')}
              class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cotizador' ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <DollarSign class="w-4 h-4" /> Cotizador Express
            </button>
          </nav>
        </div>
        
        <div class="border-t border-slate-800 pt-4 px-2 text-xs text-slate-400">
          Versión v0.1.0 • Listo para GitHub
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex-1 p-8 overflow-y-auto">
        {activeTab === 'ia' ? (
          <div class="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Asistente Inteligente</h2>
              <p class="text-sm text-slate-500">Genera menús, calcula insumos o planifica la logística con Gemini.</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Necesito un menú criollo para 50 personas, detalla los ingredientes necesarios y el margen sugerido..."
                class="w-full h-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              />
              <button
                onClick={generateAIResponse}
                disabled={loading}
                class="bg-slate-950 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Consultar a la IA'} <Sparkles class="w-4 h-4" />
              </button>
            </div>

            {iaResponse && (
              <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 class="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MessageSquare class="w-4 h-4 text-amber-500" /> Propuesta Generada
                </h3>
                <div class="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {iaResponse}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Cotizador Rápido de Eventos</h2>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p class="text-sm text-slate-500">Módulo de cálculo base de presupuestos y costos fijos/variables.</p>
              {/* Aquí se pueden añadir las utilidades locales de cálculo */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}