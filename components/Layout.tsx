
import React from 'react';
import { Home as HomeIcon, Calendar, PieChart, User as UserIcon, Plus, Bell } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage: string;
  onNavigate: (page: any) => void;
  user: User;
  onAddClick: () => void;
  unreadNotifications?: number;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  currentPage, 
  onNavigate, 
  user, 
  onAddClick,
  unreadNotifications = 0
}) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 dark:bg-blue-700 py-4 px-6 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-4">
           <button 
            onClick={() => onNavigate('notifications')}
            className="relative p-2 text-white/90 hover:text-white transition-colors"
           >
             <Bell size={24} />
             {unreadNotifications > 0 && (
               <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-blue-600 animate-pulse">
                 {unreadNotifications}
               </span>
             )}
           </button>
        </div>
        <h1 className="text-white text-xl font-bold text-center flex-1 truncate px-2">{title}</h1>
        <div className="flex items-center">
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border-2 border-white/50 cursor-pointer hover:opacity-80"
            onClick={() => onNavigate('profile')}
          />
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative bg-slate-50 dark:bg-[#0F172A]">
        {children}
      </main>

      {/* Floating Action Button */}
      {currentPage === 'home' && (
        <button 
          onClick={onAddClick}
          className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform active:scale-95 hover:scale-110 z-30"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] border-t dark:border-slate-800 flex justify-around items-center py-3 px-2 z-40 transition-colors duration-300">
        <NavItem 
          icon={<HomeIcon size={24} />} 
          label="Início" 
          active={currentPage === 'home'} 
          onClick={() => onNavigate('home')} 
        />
        <NavItem 
          icon={<Calendar size={24} />} 
          label="Calendário" 
          active={currentPage === 'calendar'} 
          onClick={() => {}} 
        />
        <NavItem 
          icon={<PieChart size={24} />} 
          label="Relatório" 
          active={currentPage === 'reports'} 
          onClick={() => onNavigate('reports')} 
        />
        <NavItem 
          icon={<UserIcon size={24} />} 
          label="Perfil" 
          active={['profile', 'settings', 'devtools'].includes(currentPage)} 
          onClick={() => onNavigate('profile')} 
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-500' : 'text-slate-400'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);
