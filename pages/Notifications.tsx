
import React from 'react';
import { ArrowLeft, AlertCircle, AlertTriangle, Info, CheckCircle2, CheckCircle } from 'lucide-react';
import { AppNotification, Language } from '../types';

interface NotificationsProps {
  notifications: AppNotification[];
  onBack: () => void;
  language: Language;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsPage: React.FC<NotificationsProps> = ({ 
  notifications, 
  onBack, 
  language, 
  onMarkAsRead,
  onMarkAllAsRead 
}) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  
  const t = {
    title: language === 'pt' ? 'Notificações' : 'Notifications',
    emptyTitle: language === 'pt' ? 'Tudo em dia por aqui!' : 'Everything is up to date!',
    footer: language === 'pt' ? 'Fique atento aos seus compromissos financeiros' : 'Stay tuned to your financial commitments',
    markAll: language === 'pt' ? 'Marcar todas como lidas' : 'Mark all as read',
    unreadCount: (count: number) => language === 'pt' 
      ? `${count} pendente${count > 1 ? 's' : ''}` 
      : `${count} pending`,
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft />
            </button>
            <h2 className="text-2xl font-black">{t.title}</h2>
          </div>
          {unreadNotifications.length > 0 && (
            <button 
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              <CheckCircle size={14} />
              {t.markAll}
            </button>
          )}
        </div>
        
        {unreadNotifications.length > 0 && (
          <div className="px-2">
             <span className="bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-blue-500/20">
               {t.unreadCount(unreadNotifications.length)}
             </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-500/50" />
            </div>
            <p className="text-lg font-medium">{t.emptyTitle}</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <button 
              key={notif.id} 
              onClick={() => onMarkAsRead(notif.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 flex gap-4 transition-all duration-300 transform active:scale-[0.98] ${
                notif.read 
                  ? 'bg-slate-50/50 dark:bg-slate-900/20 border-transparent opacity-60' 
                  : `bg-white dark:bg-[#1E293B] shadow-sm animate-in slide-in-from-right-4 delay-${Math.min(index * 100, 500)} ${
                    notif.type === 'error' ? 'border-red-500/20' : 
                    notif.type === 'warning' ? 'border-yellow-500/20' : 
                    'border-blue-500/20'
                  }`
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.read ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' :
                notif.type === 'error' ? 'bg-red-500/10 text-red-500' : 
                notif.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 
                'bg-blue-500/10 text-blue-500'
              }`}>
                {notif.read ? <CheckCircle size={24} /> :
                 notif.type === 'error' ? <AlertCircle size={24} /> : 
                 notif.type === 'warning' ? <AlertTriangle size={24} /> : 
                 <Info size={24} />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-base leading-tight ${notif.read ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-sm leading-snug ${notif.read ? 'text-slate-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {notif.message}
                </p>
                {!notif.read && (
                    <div className="flex items-center gap-1 mt-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Novo</span>
                    </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {notifications.length > 0 && (
          <div className="pt-8 pb-12 text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest px-8 leading-relaxed opacity-60">
                  {t.footer}
              </p>
          </div>
      )}
    </div>
  );
};

export default NotificationsPage;
