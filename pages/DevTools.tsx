
import React, { useState } from 'react';
import { ArrowLeft, Trash2, Cpu, Loader2 } from 'lucide-react';
import { explainExpenses } from '../services/gemini';

interface DevToolsProps {
  onClearBills: () => void;
  onBack: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ onClearBills, onBack }) => {
  const [numbers, setNumbers] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!numbers) return;
    setLoading(true);
    const result = await explainExpenses(numbers);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black">Ferramentas de Desenvolvedor</h2>
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border dark:border-slate-700 space-y-4">
          <h3 className="text-lg font-bold">Gerenciamento de Dados</h3>
          <button 
            onClick={() => {
              if (confirm('Tem certeza que deseja limpar todas as contas?')) onClearBills();
            }}
            className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl border border-red-500/20 active:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Limpar todas as contas
          </button>
        </div>

        {/* AI Testing */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border dark:border-slate-700 space-y-4">
          <h3 className="text-lg font-bold">Teste de Serviço (Math & Gemini AI)</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Números (separados por vírgula)</label>
            <input 
              type="text" 
              placeholder="Ex: 12, 15, 20" 
              className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
          </div>
          <button 
            onClick={handleExplain}
            disabled={loading || !numbers}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Cpu size={20} />}
            Calcular e Explicar
          </button>

          {explanation && (
            <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTools;
