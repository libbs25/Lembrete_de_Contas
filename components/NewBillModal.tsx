
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Category, Bill, Language } from '../types';

interface NewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bill: Omit<Bill, 'id' | 'status'>) => void;
  editBill?: Bill | null;
  language: Language;
}

const NewBillModal: React.FC<NewBillModalProps> = ({ isOpen, onClose, onSave, editBill, language }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.GERAL);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Sync state with editBill if provided
  useEffect(() => {
    if (editBill) {
      setName(editBill.name);
      setAmount(editBill.amount.toString());
      setCategory(editBill.category);
      setDueDate(editBill.dueDate);
    } else {
      setName('');
      setAmount('');
      setCategory(Category.GERAL);
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  }, [editBill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onSave({
      name,
      amount: parseFloat(amount),
      category,
      dueDate
    });
  };

  const t = {
    title: editBill 
      ? (language === 'pt' ? 'Editar Conta' : 'Edit Bill') 
      : (language === 'pt' ? 'Nova Conta' : 'New Bill'),
    nameLabel: language === 'pt' ? 'Nome da Conta' : 'Bill Name',
    amountLabel: language === 'pt' ? 'Valor (R$)' : 'Amount (R$)',
    categoryLabel: language === 'pt' ? 'Categoria' : 'Category',
    dateLabel: language === 'pt' ? 'Data de Vencimento' : 'Due Date',
    saveBtn: editBill 
      ? (language === 'pt' ? 'Salvar Alterações' : 'Save Changes') 
      : (language === 'pt' ? 'Salvar Conta' : 'Save Bill'),
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
              placeholder="Ex: Aluguel, Internet" 
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
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.dateLabel}</label>
            <input 
              type="date" 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} />
            {t.saveBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewBillModal;
