
import React from 'react';
import { Bill, BillStatus, Language } from '../types';
import { CheckCircle, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  bills: Bill[];
  language: Language;
}

const Calendar: React.FC<CalendarProps> = ({ bills, language }) => {
  const paidBills = bills
    .filter(bill => bill.status === BillStatus.PAID)
    .sort((a, b) => new Date(b.paidDate || '').getTime() - new Date(a.paidDate || '').getTime());

  const t = {
    title: language === 'pt' ? 'Contas Pagas' : 'Paid Bills',
    empty: language === 'pt' ? 'Nenhuma conta paga encontrada' : 'No paid bills found',
    paidOn: language === 'pt' ? 'Pago em' : 'Paid on',
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black">{t.title}</h2>
          <p className="text-slate-500 text-sm">{paidBills.length} {language === 'pt' ? 'contas finalizadas' : 'completed bills'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {paidBills.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg font-medium">{t.empty}</p>
          </div>
        ) : (
          paidBills.map((bill) => {
            const paidDate = new Date(bill.paidDate || '');
            const day = paidDate.getDate();
            const monthsPt = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const monthsEn = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const month = language === 'pt' ? monthsPt[paidDate.getMonth()] : monthsEn[paidDate.getMonth()];

            return (
              <div 
                key={bill.id} 
                className="bg-white dark:bg-[#1E293B] border-2 border-green-500/20 rounded-2xl p-4 flex gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{bill.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-xl">
                    R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-green-500 text-xs font-semibold mt-1">
                    {t.paidOn} {paidDate.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                  </p>
                </div>
                <div className="bg-green-600 text-white rounded-xl p-2 min-w-[50px] h-fit text-center shadow-sm">
                  <div className="text-sm font-bold leading-tight">{day}</div>
                  <div className="text-[10px] font-bold leading-tight">{month}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
