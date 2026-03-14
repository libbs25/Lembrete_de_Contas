
import React, { useMemo } from 'react';
import { Bill, BillStatus, Language, Income } from '../types';
import { TrendingUp, CheckCircle, AlertTriangle, Calendar, DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface ReportsProps {
  bills: Bill[];
  incomes: Income[];
  language: Language;
}

const Reports: React.FC<ReportsProps> = ({ bills, incomes, language }) => {
  const stats = useMemo(() => {
    const totalBillsCount = bills.length;
    const paidBillsCount = bills.filter(b => b.status === BillStatus.PAID).length;
    const overdueBillsCount = bills.filter(b => b.status === BillStatus.OVERDUE).length;
    
    const totalPaid = bills.filter(b => b.status === BillStatus.PAID).reduce((acc, b) => acc + b.amount, 0);
    const totalOverdue = bills.filter(b => b.status === BillStatus.OVERDUE).reduce((acc, b) => acc + b.amount, 0);
    const totalPending = bills.filter(b => b.status === BillStatus.PENDING).reduce((acc, b) => acc + b.amount, 0);
    
    const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = totalPaid + totalOverdue + totalPending;
    
    // User requested: Total Income card = Paid bills, Total Expenses card = Unpaid bills
    const displayIncome = totalPaid;
    const displayExpenses = totalOverdue + totalPending;
    const balance = totalIncome - totalExpenses;

    return { 
      totalBillsCount, 
      paidBillsCount, 
      overdueBillsCount, 
      totalPaid, 
      totalOverdue, 
      totalPending, 
      totalIncome, 
      totalExpenses, 
      displayIncome,
      displayExpenses,
      balance 
    };
  }, [bills, incomes]);

  const t = {
    title: language === 'pt' ? 'Relatório' : 'Reports',
    totalIncome: language === 'pt' ? 'Total de Receitas' : 'Total Income',
    totalExpenses: language === 'pt' ? 'Total de Despesas' : 'Total Expenses',
    balance: language === 'pt' ? 'Saldo Atual' : 'Current Balance',
    summaryTitle: language === 'pt' ? 'Resumo Financeiro' : 'Financial Summary',
    paidTotal: language === 'pt' ? 'Total Pago' : 'Total Paid',
    overdueTotal: language === 'pt' ? 'Total Atrasado' : 'Overdue Total',
    pendingTotal: language === 'pt' ? 'Total Pendente' : 'Pending Total',
    incomeTotal: language === 'pt' ? 'Receitas Totais' : 'Total Income',
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-black mb-4">{t.title}</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className={`bg-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden`}>
          <div className="relative z-10">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">{t.balance}</p>
            <p className="text-4xl font-black mt-1">
              R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <DollarSign size={80} className="absolute -right-4 -bottom-4 text-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-500 mb-0.5">
            <ArrowUpCircle size={14} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{t.totalIncome}</span>
          </div>
          <p className="text-lg font-black text-slate-800 dark:text-white">
            R$ {stats.displayIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border-2 border-red-500/20">
          <div className="flex items-center gap-2 text-red-500 mb-0.5">
            <ArrowDownCircle size={14} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{t.totalExpenses}</span>
          </div>
          <p className="text-lg font-black text-slate-800 dark:text-white">
            R$ {stats.displayExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 space-y-6 border dark:border-slate-700">
        <h3 className="text-xl font-bold">{t.summaryTitle}</h3>
        
        <div className="space-y-4">
          <SummaryRow label={t.incomeTotal} value={stats.totalIncome} color="text-emerald-500" />
          <SummaryRow label={t.paidTotal} value={stats.totalPaid} color="text-blue-500" />
          <SummaryRow label={t.overdueTotal} value={stats.totalOverdue} color="text-red-500" />
          <SummaryRow label={t.pendingTotal} value={stats.totalPending} color="text-yellow-500" />
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <SummaryRow label={t.balance} value={stats.balance} color={stats.balance >= 0 ? "text-emerald-500" : "text-red-500"} bold />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, color, bold }: { label: string, value: number, color: string, bold?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className={`text-slate-500 dark:text-slate-400 font-medium ${bold ? 'text-lg font-bold' : 'text-sm'}`}>{label}</span>
    <span className={`font-black ${color} ${bold ? 'text-xl' : 'text-base'}`}>
      R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
    </span>
  </div>
);

export default Reports;
