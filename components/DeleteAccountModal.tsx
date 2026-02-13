
import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Language } from '../types';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: Language;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm, language }) => {
  if (!isOpen) return null;

  const t = {
    title: language === 'pt' ? 'Excluir Conta' : 'Delete Account',
    warning: language === 'pt' 
      ? 'Atenção: Esta ação é irreversível.' 
      : 'Attention: This action is irreversible.',
    description: language === 'pt'
      ? 'Ao excluir sua conta, todos os seus dados de pagamentos, dívidas e configurações serão removidos permanentemente de nossos servidores.'
      : 'By deleting your account, all your payment data, debts, and settings will be permanently removed from our servers.',
    cancel: language === 'pt' ? 'Manter minha conta' : 'Keep my account',
    confirm: language === 'pt' ? 'Sim, excluir tudo' : 'Yes, delete everything',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 animate-bounce">
            <AlertTriangle size={48} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {t.title}
            </h2>
            <p className="text-red-500 font-bold text-sm uppercase tracking-widest">
              {t.warning}
            </p>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {t.description}
          </p>

          <div className="w-full space-y-3 pt-4">
            <button 
              onClick={onConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              {t.confirm}
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl active:scale-95 transition-all"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
