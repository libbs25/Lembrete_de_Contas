
import React, { useState } from 'react';
import { Search, Edit3, Trash2, Undo2, Check, AlertCircle, ShoppingCart, Wifi, Home as HomeIcon, CreditCard } from 'lucide-react';
import { Bill, BillStatus, Category, Language } from '../types';

interface HomeProps {
  bills: Bill[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (bill: Bill) => void;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ bills, onToggleStatus, onDelete, onEdit, language }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending');
  const [search, setSearch] = useState('');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'paid') return matchesSearch && bill.status === BillStatus.PAID;
    return matchesSearch && bill.status !== BillStatus.PAID;
  });

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case Category.UTILIDADES: return <Wifi className="text-slate-500" />;
      case Category.ALIMENTACAO: return <ShoppingCart className="text-blue-500" />;
      case Category.MORADIA: return <HomeIcon className="text-blue-500" />;
      default: return <CreditCard className="text-blue-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const monthsPt = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const monthsEn = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const months = language === 'pt' ? monthsPt : monthsEn;
    return { day, month: months[date.getMonth()] };
  };

  const t = {
    searchPlaceholder: language === 'pt' ? 'Pesquisar contas...' : 'Search bills...',
    pending: language === 'pt' ? 'Pendentes' : 'Pending',
    paid: language === 'pt' ? 'Pagas' : 'Paid',
    empty: language === 'pt' ? 'Nenhuma conta encontrada' : 'No bills found',
    paidOn: language === 'pt' ? 'Pago em' : 'Paid on',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-100 dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.pending}
        </button>
        <button 
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'paid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t.paid}
        </button>
      </div>

      {/* Bill List */}
      <div className="space-y-4">
        {filteredBills.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg font-medium">{t.empty}</p>
          </div>
        ) : (
          filteredBills.map((bill) => {
            const { day, month } = formatDate(bill.dueDate);
            const isOverdue = bill.status === BillStatus.OVERDUE;
            const isPaid = bill.status === BillStatus.PAID;

            return (
              <div 
                key={bill.id} 
                className={`bg-white dark:bg-[#1E293B] border-2 rounded-2xl p-4 flex gap-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${isPaid ? 'border-green-500/50 shadow-green-500/5' : isOverdue ? 'border-red-500/50 shadow-red-500/5' : 'border-slate-200 dark:border-slate-800'}`}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(bill.category)}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{bill.name}</h3>
                    {isOverdue && <AlertCircle size={16} className="text-red-500" />}
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-xl">
                    R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-medium">
                    {bill.category}
                  </span>
                  {isPaid && (
                    <p className="text-green-500 text-xs font-semibold mt-1">
                      {t.paidOn} {new Date(bill.paidDate!).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                    </p>
                  )}
                </div>

                {/* Actions & Date */}
                <div className="flex flex-col items-end justify-between">
                  <div className="bg-blue-600 text-white rounded-xl p-2 min-w-[50px] text-center shadow-sm">
                    <div className="text-sm font-bold leading-tight">{day}</div>
                    <div className="text-[10px] font-bold leading-tight">{month} /</div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button 
                      onClick={() => onEdit(bill)}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => onToggleStatus(bill.id)}
                      className={`transition-colors p-1 ${isPaid ? 'text-yellow-500' : 'text-green-500'}`}
                    >
                      {isPaid ? <Undo2 size={18} /> : <Check size={18} />}
                    </button>
                    <button 
                      onClick={() => onDelete(bill.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
