
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Camera, Image as ImageIcon } from 'lucide-react';
import { Bill, BillType, Language } from '../types';

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
  const [type, setType] = useState<BillType>(BillType.OWED_BY_ME);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with editBill if provided
  useEffect(() => {
    if (editBill) {
      setName(editBill.name);
      setAmount(editBill.amount.toString());
      setType(editBill.type);
      setDescription(editBill.description || '');
      setImageUrl(editBill.imageUrl || '');
      setDueDate(editBill.dueDate);
    } else {
      setName('');
      setAmount('');
      setType(BillType.OWED_BY_ME);
      setDescription('');
      setImageUrl('');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  }, [editBill, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onSave({
      name,
      amount: parseFloat(amount),
      type,
      description,
      imageUrl,
      dueDate
    });
  };

  const t = {
    title: editBill 
      ? (language === 'pt' ? 'Editar Registro' : 'Edit Record') 
      : (language === 'pt' ? 'Novo Registro' : 'New Record'),
    nameLabel: language === 'pt' ? 'Nome / Pessoa' : 'Name / Person',
    amountLabel: language === 'pt' ? 'Valor (R$)' : 'Amount (R$)',
    typeLabel: language === 'pt' ? 'Tipo de Dívida' : 'Debt Type',
    descriptionLabel: language === 'pt' ? 'O que está devendo?' : 'What is owed?',
    photoLabel: language === 'pt' ? 'Adicionar Foto' : 'Add Photo',
    dateLabel: language === 'pt' ? 'Data de Vencimento' : 'Due Date',
    saveBtn: editBill 
      ? (language === 'pt' ? 'Salvar Alterações' : 'Save Changes') 
      : (language === 'pt' ? 'Salvar Registro' : 'Save Record'),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-bold">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.nameLabel}</label>
            <input 
              type="text" 
              placeholder="Ex: João, Maria, Aluguel" 
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
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.typeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(BillType).map(bt => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setType(bt)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    type === bt 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.descriptionLabel}</label>
            <textarea 
              placeholder="Descreva o que está sendo devendo..." 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.photoLabel}</label>
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-colors border-2 border-dashed border-slate-200 dark:border-slate-800"
              >
                <Camera size={24} />
                <span className="text-[10px] font-bold mt-1">UPLOAD</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              {imageUrl && (
                <div className="relative w-20 h-20 group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-md" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
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
