
import React, { useMemo } from 'react';
import { Bill, BillStatus, Language } from '../types';
import { TrendingUp, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

interface ReportsProps {
  bills: Bill[];
  language: Language;
}

const Reports: React.FC<ReportsProps> = ({ bills, language }) => {
  const stats = useMemo(() => {
    const totalCount = bills.length;
    const paidCount = bills.filter(b => b.status === BillStatus.PAID).length;
    const overdueCount = bills.filter(b => b.status === BillStatus.OVERDUE).length;
    const pendingCount = bills.filter(b => b.status === BillStatus.PENDING).length;

    const totalPaid = bills.filter(b => b.status === BillStatus.PAID).reduce((acc, b) => acc + b.amount, 0);
    const totalOverdue = bills.filter(b => b.status === BillStatus.OVERDUE).reduce((acc, b) => acc + b.amount, 0);
    const totalPending = bills.filter(b => b.status === BillStatus.PENDING).reduce((acc, b) => acc + b.amount, 0);
    const grandTotal = totalPaid + totalOverdue + totalPending;

    return { totalCount, paidCount, overdueCount, pendingCount, totalPaid, totalOverdue, totalPending, grandTotal };
  }, [bills]);

  const t = {
    title: language === 'pt' ? 'Relatório' : 'Reports',
    totalBills: language === 'pt' ? 'Total de Contas' : 'Total Bills',
    paidBills: language === 'pt' ? 'Contas Pagas' : 'Paid Bills',
    overdueBills: language === 'pt' ? 'Contas Atrasadas' : 'Overdue Bills',
    upcomingBills: language === 'pt' ? 'Próximas Contas' : 'Upcoming Bills',
    summaryTitle: language === 'pt' ? 'Resumo Financeiro' : 'Financial Summary',
    paidTotal: language === 'pt' ? 'Total Pago' : 'Total Paid',
    overdueTotal: language === 'pt' ? 'Total Atrasado' : 'Overdue Total',
    pendingTotal: language === 'pt' ? 'Total Pendente' : 'Pending Total',
    grandTotal: language === 'pt' ? 'Total Geral' : 'Grand Total',
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-black mb-4">{t.title}</h2>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title={t.totalBills} value={stats.totalCount} icon={<TrendingUp size={20} />} color="blue" />
        <StatCard title={t.paidBills} value={stats.paidCount} icon={<CheckCircle size={20} />} color="green" />
        <StatCard title={t.overdueBills} value={stats.overdueCount} icon={<AlertTriangle size={20} />} color="red" />
        <StatCard title={t.upcomingBills} value={stats.pendingCount} icon={<Calendar size={20} />} color="yellow" />
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 space-y-6 border dark:border-slate-700">
        <h3 className="text-xl font-bold">{t.summaryTitle}</h3>
        
        <div className="space-y-4">
          <SummaryRow label={t.paidTotal} value={stats.totalPaid} color="text-green-500" />
          <SummaryRow label={t.overdueTotal} value={stats.totalOverdue} color="text-red-500" />
          <SummaryRow label={t.pendingTotal} value={stats.totalPending} color="text-yellow-500" />
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <SummaryRow label={t.grandTotal} value={stats.grandTotal} color="text-blue-500" bold />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) => {
  const colors: Record<string, string> = {
    blue: 'border-l-blue-500 text-blue-500',
    green: 'border-l-green-500 text-green-500',
    red: 'border-l-red-500 text-red-500',
    yellow: 'border-l-yellow-500 text-yellow-500'
  };

  return (
    <div className={`bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border-l-4 ${colors[color]} relative`}>
      <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-tight leading-tight">{title}</p>
      <p className="text-2xl font-black mt-1 text-slate-800 dark:text-white">{value}</p>
      <div className="absolute top-4 right-4 opacity-20">
        {icon}
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
