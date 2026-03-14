
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { IncomeCategory, Income, Language } from '../types';

interface NewIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: Omit<Income, 'id'>) => void;
  editIncome?: Income | null;
  language: Language;
}

const NewIncomeModal: React.FC<NewIncomeModalProps> = ({ isOpen, onClose, onSave, editIncome, language }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeCategory>(IncomeCategory.SALARIO);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editIncome) {
      setName(editIncome.name);
      setAmount(editIncome.amount.toString());
      setCategory(editIncome.category);
      setDate(editIncome.date);
    } else {
      setName('');
      setAmount('');
      setCategory(IncomeCategory.SALARIO);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editIncome, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onSave({
      name,
      amount: parseFloat(amount),
      category,
      date
    });
  };

  const t = {
    title: editIncome 
      ? (language === 'pt' ? 'Editar Receita' : 'Edit Income') 
      : (language === 'pt' ? 'Nova Receita' : 'New Income'),
    nameLabel: language === 'pt' ? 'Fonte de Renda' : 'Income Source',
    amountLabel: language === 'pt' ? 'Valor (R$)' : 'Amount (R$)',
    categoryLabel: language === 'pt' ? 'Categoria' : 'Category',
    dateLabel: language === 'pt' ? 'Data de Recebimento' : 'Date Received',
    saveBtn: editIncome 
      ? (language === 'pt' ? 'Salvar Alterações' : 'Save Changes') 
      : (language === 'pt' ? 'Salvar Receita' : 'Save Income'),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-bold">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.nameLabel}</label>
            <input 
              type="text" 
              placeholder="Ex: Salário, Freelance" 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.amountLabel}</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.categoryLabel}</label>
            <select 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value as IncomeCategory)}
            >
              {Object.values(IncomeCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.dateLabel}</label>
            <input 
              type="date" 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} />
            {t.saveBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewIncomeModal;
