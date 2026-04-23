
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Bot, Loader2, Copy, Check } from 'lucide-react';
import { Bill, AIPersona } from '../types';
import { generateCollectionMessage } from '../services/aiService';

interface CollectionBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  persona: AIPersona;
  userName: string;
  language: 'pt' | 'en';
}

const CollectionBotModal: React.FC<CollectionBotModalProps> = ({ 
  isOpen, 
  onClose, 
  bill, 
  persona, 
  userName,
  language
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && bill) {
      handleGenerate();
    } else {
      setMessage('');
    }
  }, [isOpen, bill]);

  const handleGenerate = async () => {
    if (!bill) return;
    setLoading(true);
    const msg = await generateCollectionMessage(bill, persona, userName);
    setMessage(msg);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMsg}`, '_blank');
  };

  if (!isOpen) return null;

  const t = {
    title: language === 'pt' ? 'Assistente de Cobrança' : 'Collection Assistant',
    generating: language === 'pt' ? 'O bot está gerando a mensagem...' : 'Bot is generating message...',
    send: language === 'pt' ? 'Enviar via WhatsApp' : 'Send via WhatsApp',
    copy: language === 'pt' ? 'Copiar Mensagem' : 'Copy Message',
    personaLabel: language === 'pt' ? `Voz: ${persona === 'male' ? 'Masculino' : 'Feminino'}` : `Voice: ${persona === 'male' ? 'Male' : 'Female'}`,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">{t.title}</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.personaLabel}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 min-h-[150px] relative border border-slate-100 dark:border-slate-800">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium">{t.generating}</p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-slate-700 dark:text-slate-300">
                "{message}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleCopy}
              disabled={loading || !message}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              {t.copy}
            </button>
            <button 
              onClick={handleWhatsApp}
              disabled={loading || !message}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <MessageCircle size={18} />
              {t.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionBotModal;
