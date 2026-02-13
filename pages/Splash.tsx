
import React from 'react';
import { Fingerprint } from 'lucide-react';

interface SplashProps {
  onLogin: () => void;
}

const Splash: React.FC<SplashProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#606C38] flex flex-col items-center justify-between p-8 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Character Logo */}
        <div className="relative w-64 h-64 mb-4">
          <svg viewBox="0 0 200 200" className="w-full h-full text-black">
            <path d="M50 140 L150 140 L130 180 L70 180 Z" fill="currentColor" />
            <path d="M40 80 Q50 30 70 50 L130 50 Q150 30 160 80 L140 130 L60 130 Z" fill="currentColor" />
            {/* Mask */}
            <rect x="70" y="85" width="60" height="20" rx="5" fill="#111" />
            <text x="100" y="100" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OC</text>
            {/* Mouth */}
            <path d="M80 115 Q100 130 120 115" stroke="white" strokeWidth="3" fill="none" />
            <path d="M85 118 L90 125 L95 119 L100 126 L105 119 L110 126 L115 118" stroke="white" strokeWidth="2" fill="none" />
            {/* Gem */}
            <path d="M100 145 L115 160 L100 175 L85 160 Z" fill="#888" stroke="white" strokeWidth="1" />
            {/* Horns */}
            <path d="M75 55 L65 30 L85 50 Z" fill="currentColor" />
            <path d="M125 55 L135 30 L115 50 Z" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight">LIBRAS77</h1>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button 
          onClick={onLogin}
          className="w-full bg-black text-white font-semibold py-4 rounded-full flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <Fingerprint size={24} />
          Acesso Biométrico
        </button>

        <button 
          onClick={onLogin}
          className="w-full bg-white text-slate-800 font-semibold py-4 rounded-full flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continuar com o Google
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={onLogin}
            className="flex-1 bg-[#D1D5DB] text-slate-800 font-semibold py-4 rounded-full shadow-md active:scale-95 transition-transform"
          >
            Cadastrar
          </button>
          <button 
            onClick={onLogin}
            className="flex-1 border border-black text-black font-semibold py-4 rounded-full active:scale-95 transition-transform"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
