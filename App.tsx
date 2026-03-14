
import React, { useState, useEffect, useMemo } from 'react';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DevTools from './pages/DevTools';
import NotificationsPage from './pages/Notifications';
import CalendarPage from './pages/Calendar';
import NewBillModal from './components/NewBillModal';
import NewIncomeModal from './components/NewIncomeModal';
import EditProfileModal from './components/EditProfileModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import { Bill, BillStatus, ThemeMode, User, AppNotification, Language, Income, IncomeCategory } from './types';
import { Layout } from './components/Layout';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_USER: User = {
  name: 'Usuário',
  email: '',
  avatar: 'https://picsum.photos/seed/user/200'
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'reports' | 'profile' | 'settings' | 'devtools' | 'notifications' | 'calendar'>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [language, setLanguage] = useState<Language>('pt');
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [isNewIncomeModalOpen, setIsNewIncomeModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  
  const [user, setUser] = useState<User>(DEFAULT_USER);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setUser({
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`
        });
        
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        setDoc(userRef, {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`));

      } else {
        setIsLoggedIn(false);
        setUser(DEFAULT_USER);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Bills Listener
  useEffect(() => {
    if (!isLoggedIn || !auth.currentUser) {
      setBills([]);
      return;
    }

    const q = query(collection(db, 'bills'), where('uid', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const billsData: Bill[] = [];
      snapshot.forEach((doc) => {
        billsData.push({ id: doc.id, ...doc.data() } as Bill);
      });
      setBills(billsData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'bills'));

    return () => unsubscribe();
  }, [isLoggedIn]);

  // Incomes Listener
  useEffect(() => {
    if (!isLoggedIn || !auth.currentUser) {
      setIncomes([]);
      return;
    }

    const q = query(collection(db, 'incomes'), where('uid', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incomesData: Income[] = [];
      snapshot.forEach((doc) => {
        incomesData.push({ id: doc.id, ...doc.data() } as Income);
      });
      setIncomes(incomesData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'incomes'));

    return () => unsubscribe();
  }, [isLoggedIn]);

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
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setCurrentPage('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    // In a real app, we'd delete all user data from Firestore
    // For now, just logout
    setIsDeleteModalOpen(false);
    handleLogout();
  };

  const handleSaveBill = async (billData: Omit<Bill, 'id' | 'status'>) => {
    if (!auth.currentUser) return;

    try {
      if (editingBill) {
        const billRef = doc(db, 'bills', editingBill.id);
        await updateDoc(billRef, { ...billData });
        setEditingBill(null);
      } else {
        await addDoc(collection(db, 'bills'), {
          ...billData,
          uid: auth.currentUser.uid,
          status: BillStatus.PENDING,
          createdAt: new Date().toISOString()
        });
      }
      setIsNewBillModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, editingBill ? OperationType.UPDATE : OperationType.CREATE, 'bills');
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bills', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bills/${id}`);
    }
  };

  const handleToggleBillStatus = async (id: string) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    try {
      const isCurrentlyPaid = bill.status === BillStatus.PAID;
      const billRef = doc(db, 'bills', id);
      await updateDoc(billRef, {
        status: isCurrentlyPaid ? BillStatus.PENDING : BillStatus.PAID,
        paidDate: isCurrentlyPaid ? null : new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bills/${id}`);
    }
  };

  const handleStartEdit = (bill: Bill) => {
    setEditingBill(bill);
    setIsNewBillModalOpen(true);
  };

  const handleSaveIncome = async (incomeData: Omit<Income, 'id'>) => {
    if (!auth.currentUser) return;

    try {
      if (editingIncome) {
        const incomeRef = doc(db, 'incomes', editingIncome.id);
        await updateDoc(incomeRef, { ...incomeData });
        setEditingIncome(null);
      } else {
        await addDoc(collection(db, 'incomes'), {
          ...incomeData,
          uid: auth.currentUser.uid,
          createdAt: new Date().toISOString()
        });
      }
      setIsNewIncomeModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, editingIncome ? OperationType.UPDATE : OperationType.CREATE, 'incomes');
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'incomes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `incomes/${id}`);
    }
  };

  const handleStartEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsNewIncomeModalOpen(true);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllBills = async () => {
    // Batch delete would be better, but for simplicity:
    for (const bill of bills) {
      await handleDeleteBill(bill.id);
    }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-blue-500 font-bold animate-pulse">ORDEMFY</div>
      </div>
    );
  }

  const translations = {
    pt: {
      home: 'Pagamento e Dívida',
      reports: 'Relatório',
      notifications: 'Alertas Financeiros',
      profile: 'Perfil',
      settings: 'Configurações',
      devtools: 'Ferramentas Dev',
      calendar: 'Calendário',
    },
    en: {
      home: 'Payments & Debts',
      reports: 'Reports',
      notifications: 'Financial Alerts',
      profile: 'Profile',
      settings: 'Settings',
      devtools: 'Dev Tools',
      calendar: 'Calendar',
    }
  };

  const t = translations[language];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': 
        return <Home 
          bills={bills} 
          incomes={incomes}
          onToggleStatus={handleToggleBillStatus} 
          onDelete={handleDeleteBill} 
          onEdit={handleStartEdit}
          onDeleteIncome={handleDeleteIncome}
          onEditIncome={handleStartEditIncome}
          language={language}
        />;
      case 'reports': 
        return <Reports bills={bills} incomes={incomes} language={language} />;
      case 'calendar':
        return <CalendarPage bills={bills} language={language} />;
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
            onAddIncomeClick={() => {
              setEditingIncome(null);
              setIsNewIncomeModalOpen(true);
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

          <NewIncomeModal 
            isOpen={isNewIncomeModalOpen} 
            onClose={() => {
              setIsNewIncomeModalOpen(false);
              setEditingIncome(null);
            }} 
            onSave={handleSaveIncome}
            editIncome={editingIncome}
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
