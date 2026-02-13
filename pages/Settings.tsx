
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ThemeMode, Language } from '../types';

interface SettingsProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, language, setLanguage, onBack }) => {
  const t = {
    title: language === 'pt' ? 'Configurações' : 'Settings',
    langLabel: language === 'pt' ? 'Idioma' : 'Language',
    themeLabel: language === 'pt' ? 'Tema' : 'Theme',
    themes: {
      light: language === 'pt' ? 'Claro' : 'Light',
      dark: language === 'pt' ? 'Escuro' : 'Dark',
      system: language === 'pt' ? 'Sistema' : 'System',
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black">{t.title}</h2>
      </div>

      <div className="space-y-6">
        {/* Language Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">{t.langLabel}</h3>
          <div className="space-y-2">
            <RadioOption label="Português (Brasil)" active={language === 'pt'} onClick={() => setLanguage('pt')} />
            <RadioOption label="English (US)" active={language === 'en'} onClick={() => setLanguage('en')} />
          </div>
        </div>

        {/* Theme Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">{t.themeLabel}</h3>
          <div className="space-y-2">
            <RadioOption label={t.themes.light} active={theme === 'light'} onClick={() => setTheme('light')} />
            <RadioOption label={t.themes.dark} active={theme === 'dark'} onClick={() => setTheme('dark')} />
            <RadioOption label={t.themes.system} active={theme === 'system'} onClick={() => setTheme('system')} />
          </div>
        </div>
      </div>
    </div>
  );
};

const RadioOption = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${active ? 'bg-blue-600/10 border-blue-600/20' : 'bg-slate-100 dark:bg-slate-800/30 border-transparent'} border-2`}
  >
    <span className={`font-medium ${active ? 'text-blue-500' : ''}`}>{label}</span>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-blue-500 bg-blue-500' : 'border-slate-400'}`}>
      {active && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  </button>
);

export default Settings;
