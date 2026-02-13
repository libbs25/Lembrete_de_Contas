
import React, { useState, useEffect, useMemo } from 'react';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DevTools from './pages/DevTools';
import NotificationsPage from './pages/Notifications';
import NewBillModal from './components/NewBillModal';
import EditProfileModal from './components/EditProfileModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import { Bill, BillStatus, Category, ThemeMode, User, AppNotification, Language } from './types';
import { Layout } from './components/Layout';

const DEFAULT_USER: User = {
  name: 'Ana Silva',
  email: 'ana.silva@gmail.com',
  avatar: 'https://picsum.photos/seed/ana/200'
};

const MOCK_BILLS: Bill[] = [
  { id: '1', name: 'Internet', amount: 99.90, category: Category.UTILIDADES, dueDate: '2025-11-10', paidDate: '2025-11-10', status: BillStatus.PAID },
  { id: '2', name: 'Supermercado', amount: 600.00, category: Category.ALIMENTACAO, dueDate: '2025-11-14', paidDate: '2025-11-14', status: BillStatus.PAID },
  { id: '3', name: 'Academia', amount: 79.00, category: Category.GERAL, dueDate: '2025-11-02', status: BillStatus.OVERDUE },
  { id: '4', name: 'Aluguel', amount: 1500.00, category: Category.MORADIA, dueDate: '2025-11-05', status: BillStatus.OVERDUE },
  { id: '5', name: 'Cartão de Crédito', amount: 850.00, category: Category.GERAL, dueDate: '2025-12-05', status: BillStatus.PENDING },
  { id: '6', name: 'Conta de Luz', amount: 150.75, category: Category.UTILIDADES, dueDate: '2025-05-15', status: BillStatus.PENDING },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'reports' | 'profile' | 'settings' | 'devtools' | 'notifications'>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [language, setLanguage] = useState<Language>('pt');
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  
  const [user, setUser] = useState<User>(DEFAULT_USER);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Notifications logic
  useEffect(() => {
    const today = new Date();
    const newNotifications: AppNotification[] = [];

    bills.forEach(bill => {
      if (bill.status === BillStatus.PAID) return;
      const dueDate = new Date(bill.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        newNotifications.push({
          id: `notif-overdue-${bill.id}`,
          title: language === 'pt' ? 'Conta Atrasada!' : 'Overdue Bill!',
          message: language === 'pt' 
            ? `A conta "${bill.name}" venceu em ${dueDate.toLocaleDateString('pt-BR')}.`
            : `Bill "${bill.name}" was due on ${dueDate.toLocaleDateString('en-US')}.`,
          type: 'error',
          date: new Date().toISOString(),
          billId: bill.id,
          read: false
        });
      } else if (diffDays <= 3) {
        newNotifications.push({
          id: `notif-due-soon-${bill.id}`,
          title: language === 'pt' ? 'Vencimento Próximo' : 'Due Soon',
          message: language === 'pt'
            ? `A conta "${bill.name}" vence ${diffDays === 0 ? 'hoje' : diffDays === 1 ? 'amanhã' : `em ${diffDays} dias`}.`
            : `Bill "${bill.name}" is due ${diffDays === 0 ? 'today' : diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`}.`,
          type: 'warning',
          date: new Date().toISOString(),
          billId: bill.id,
          read: false
        });
      }
    });

    setNotifications(prev => {
      const readIds = new Set(prev.filter(n => n.read).map(n => n.id));
      return newNotifications.map(n => ({
        ...n,
        read: readIds.has(n.id)
      }));
    });
  }, [bills, language]);

  const handleLogin = () => setIsLoggedIn(true);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleConfirmDeleteAccount = () => {
    setBills([]);
    setNotifications([]);
    setUser(DEFAULT_USER);
    setIsDeleteModalOpen(false);
    handleLogout();
  };

  const handleSaveBill = (billData: Omit<Bill, 'id' | 'status'>) => {
    if (editingBill) {
      setBills(prev => prev.map(b => b.id === editingBill.id ? { ...b, ...billData } : b));
      setEditingBill(null);
    } else {
      const newBill: Bill = {
        ...billData,
        id: Math.random().toString(36).substr(2, 9),
        status: BillStatus.PENDING
      };
      setBills(prev => [newBill, ...prev]);
    }
    setIsNewBillModalOpen(false);
  };

  const handleDeleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const handleToggleBillStatus = (id: string) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === id) {
        const isCurrentlyPaid = bill.status === BillStatus.PAID;
        return {
          ...bill,
          status: isCurrentlyPaid ? BillStatus.PENDING : BillStatus.PAID,
          paidDate: isCurrentlyPaid ? undefined : new Date().toISOString().split('T')[0]
        };
      }
      return bill;
    }));
  };

  const handleStartEdit = (bill: Bill) => {
    setEditingBill(bill);
    setIsNewBillModalOpen(true);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllBills = () => setBills([]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const translations = {
    pt: {
      home: 'Pagamento e Dívida',
      reports: 'Relatório',
      notifications: 'Alertas Financeiros',
      profile: 'Perfil',
      settings: 'Configurações',
      devtools: 'Ferramentas Dev',
    },
    en: {
      home: 'Payments & Debts',
      reports: 'Reports',
      notifications: 'Financial Alerts',
      profile: 'Profile',
      settings: 'Settings',
      devtools: 'Dev Tools',
    }
  };

  const t = translations[language];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': 
        return <Home 
          bills={bills} 
          onToggleStatus={handleToggleBillStatus} 
          onDelete={handleDeleteBill} 
          onEdit={handleStartEdit}
          language={language}
        />;
      case 'reports': 
        return <Reports bills={bills} language={language} />;
      case 'notifications':
        return (
          <NotificationsPage 
            notifications={notifications} 
            onBack={() => setCurrentPage('home')} 
            language={language} 
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        );
      case 'profile': 
        return <Profile 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={setCurrentPage} 
          language={language} 
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          onDeleteAccount={() => setIsDeleteModalOpen(true)}
        />;
      case 'settings': 
        return <Settings 
          theme={theme} 
          setTheme={setTheme} 
          language={language}
          setLanguage={setLanguage}
          onBack={() => setCurrentPage('profile')} 
        />;
      case 'devtools': 
        return <DevTools onClearBills={clearAllBills} onBack={() => setCurrentPage('profile')} />;
      default: 
        return <Home bills={bills} onToggleStatus={handleToggleBillStatus} onDelete={handleDeleteBill} onEdit={handleStartEdit} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white transition-colors duration-300">
      {!isLoggedIn ? (
        <Splash onLogin={handleLogin} />
      ) : (
        <>
          <Layout 
            title={t[currentPage] || 'LIBRAS77'} 
            currentPage={currentPage} 
            onNavigate={setCurrentPage}
            user={user}
            onAddClick={() => {
              setEditingBill(null);
              setIsNewBillModalOpen(true);
            }}
            unreadNotifications={unreadCount}
            language={language}
          >
            {renderPage()}
          </Layout>

          <NewBillModal 
            isOpen={isNewBillModalOpen} 
            onClose={() => {
              setIsNewBillModalOpen(false);
              setEditingBill(null);
            }} 
            onSave={handleSaveBill}
            editBill={editingBill}
            language={language}
          />

          <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            user={user}
            onSave={(updatedUser) => {
              setUser(updatedUser);
              setIsEditProfileModalOpen(false);
            }}
            language={language}
          />

          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDeleteAccount}
            language={language}
          />
        </>
      )}
    </div>
  );
};

export default App;
