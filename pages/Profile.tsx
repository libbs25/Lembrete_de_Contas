
import React from 'react';
import { User as UserIcon, Settings, Code, LogOut, ChevronRight, Trash2 } from 'lucide-react';
import { User, Language } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: any) => void;
  language: Language;
  onEditProfile: () => void;
  onDeleteAccount: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onNavigate, language, onEditProfile, onDeleteAccount }) => {
  const t = {
    editProfile: language === 'pt' ? 'Editar perfil' : 'Edit profile',
    editSubtitle: language === 'pt' ? 'Alterar nome e foto' : 'Change name and photo',
    settings: language === 'pt' ? 'Configurações' : 'Settings',
    settingsSubtitle: language === 'pt' ? 'Idioma e Tema' : 'Language and Theme',
    devtools: language === 'pt' ? 'Ferramentas Dev' : 'Dev Tools',
    devSubtitle: language === 'pt' ? 'Testar funcionalidades' : 'Test features',
    logout: language === 'pt' ? 'Sair da conta' : 'Log out',
    logoutSubtitle: language === 'pt' ? 'Encerrar sessão' : 'End session',
    deleteAccount: language === 'pt' ? 'Excluir conta' : 'Delete account',
    deleteSubtitle: language === 'pt' ? 'Esta ação é permanente' : 'This action is permanent',
    version: language === 'pt' ? 'VERSÃO' : 'VERSION',
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* User Header */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 flex items-center gap-4">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-blue-500/20" 
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-2">
        <MenuItem 
          icon={<UserIcon size={20} />} 
          label={t.editProfile} 
          subtitle={t.editSubtitle} 
          onClick={onEditProfile} 
        />
        <MenuItem 
          icon={<Settings size={20} />} 
          label={t.settings} 
          subtitle={t.settingsSubtitle} 
          onClick={() => onNavigate('settings')} 
        />
        <MenuItem 
          icon={<Code size={20} />} 
          label={t.devtools} 
          subtitle={t.devSubtitle} 
          onClick={() => onNavigate('devtools')} 
        />
        <MenuItem 
          icon={<LogOut size={20} />} 
          label={t.logout} 
          subtitle={t.logoutSubtitle} 
          onClick={onLogout} 
        />
      </div>

      {/* Danger Zone */}
      <button 
        onClick={onDeleteAccount}
        className="bg-red-500/10 dark:bg-red-500/5 p-4 rounded-2xl flex items-center gap-4 text-red-500 active:bg-red-500/20 transition-colors mt-4 w-full"
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Trash2 size={20} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold">{t.deleteAccount}</p>
          <p className="text-xs opacity-70">{t.deleteSubtitle}</p>
        </div>
      </button>

      <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mt-8">
        {t.version} 1.4.3.R1.0
      </p>
    </div>
  );
};

const MenuItem = ({ icon, label, subtitle, onClick }: { icon: any, label: string, subtitle: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-slate-100 dark:bg-slate-800/30 p-4 rounded-2xl flex items-center gap-4 active:bg-slate-200 dark:active:bg-slate-800 transition-colors group"
  >
    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className="font-bold group-active:text-blue-500 transition-colors">{label}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
    <ChevronRight size={18} className="text-slate-400" />
  </button>
);

export default Profile;
