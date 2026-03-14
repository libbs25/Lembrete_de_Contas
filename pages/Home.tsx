
import React, { useState } from 'react';
import { Edit3, Trash2, Undo2, Check, AlertCircle, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { Bill, BillStatus, BillType, Language, Income, IncomeCategory } from '../types';

interface HomeProps {
  bills: Bill[];
  incomes: Income[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (bill: Bill) => void;
  onDeleteIncome: (id: string) => void;
  onEditIncome: (income: Income) => void;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ 
  bills, 
  incomes,
  onToggleStatus, 
  onDelete, 
  onEdit, 
  onDeleteIncome,
  onEditIncome,
  language 
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'income'>('pending');

  const filteredBills = bills.filter(bill => {
    if (activeTab === 'paid') return bill.status === BillStatus.PAID;
    if (activeTab === 'pending') return bill.status !== BillStatus.PAID;
    return false;
  });

  const getBillTypeIcon = (type: BillType) => {
    switch (type) {
      case BillType.OWED_TO_ME: return <ArrowUpRight className="text-emerald-500" />;
      case BillType.OWED_BY_ME: return <ArrowDownLeft className="text-red-500" />;
      default: return <FileText className="text-blue-500" />;
    }
  };

  const getIncomeIcon = (category: IncomeCategory) => {
    switch (category) {
      case IncomeCategory.SALARIO: return <DollarSign className="text-emerald-500" />;
      case IncomeCategory.INVESTIMENTO: return <TrendingUp className="text-emerald-500" />;
      default: return <TrendingUp className="text-emerald-500" />;
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
    pending: language === 'pt' ? 'Pendentes' : 'Pending',
    paid: language === 'pt' ? 'Pagas' : 'Paid',
    income: language === 'pt' ? 'Receitas' : 'Income',
    empty: language === 'pt' ? 'Nenhum registro encontrado' : 'No records found',
    paidOn: language === 'pt' ? 'Pago em' : 'Paid on',
    receivedOn: language === 'pt' ? 'Recebido em' : 'Received on',
  };

  return (
    <div className="p-4 space-y-4">
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

      {/* List */}
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
                className={`bg-white dark:bg-[#1E293B] border-2 rounded-2xl p-2.5 flex gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${isPaid ? 'border-green-500/50 shadow-green-500/5' : isOverdue ? 'border-red-500/50 shadow-red-500/5' : 'border-slate-200 dark:border-slate-800'}`}
              >
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {bill.imageUrl ? (
                      <img src={bill.imageUrl} alt={bill.name} className="w-full h-full object-cover" />
                    ) : (
                      getBillTypeIcon(bill.type)
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base leading-tight">{bill.name}</h3>
                      {isOverdue && <AlertCircle size={14} className="text-red-500" />}
                    </div>
                    <p className={`font-black text-lg leading-tight ${bill.type === BillType.OWED_TO_ME ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        bill.type === BillType.OWED_TO_ME 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        {bill.type}
                      </span>
                    </div>
                    {bill.description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                        "{bill.description}"
                      </p>
                    )}
                    {isPaid && (
                      <p className="text-green-500 text-[10px] font-semibold mt-0.5">
                        {t.paidOn} {new Date(bill.paidDate!).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex items-start gap-2">
                      <button 
                        onClick={() => onDelete(bill.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="bg-blue-600 text-white rounded-xl p-1.5 min-w-[45px] text-center shadow-sm">
                        <div className="text-xs font-bold leading-tight">{day}</div>
                        <div className="text-[9px] font-bold leading-tight">{month}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-1">
                      <button 
                        onClick={() => onEdit(bill)}
                        className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          onToggleStatus(bill.id);
                          if (isPaid) setActiveTab('pending');
                        }}
                        className={`transition-colors p-0.5 ${isPaid ? 'text-yellow-500' : 'text-green-500'}`}
                      >
                        {isPaid ? <Undo2 size={16} /> : <Check size={16} />}
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
