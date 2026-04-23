
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';

interface SplashProps {
  onLogin: () => void;
}

const Splash: React.FC<SplashProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Sua conta ainda não foi verificada. Verifique sua caixa de entrada (e a pasta de spam) para o link de confirmação.');
          setLoading(false);
          return;
        }
        onLogin();
      } else {
        if (!name) {
          setError('Por favor, informe seu nome.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        setSuccess('Conta criada! Enviamos um link de confirmação para o seu e-mail. Você precisa clicar no link antes de fazer login.');
        setMode('login');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = 'Erro ao processar. Tente novamente.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está cadastrado. Se você esqueceu a senha, use a opção "Esqueceu?". Se ainda não verificou o e-mail, tente fazer login para reenviar o link.';
      }
      if (err.code === 'auth/operation-not-allowed') {
        message = 'O cadastro por e-mail está desativado no Firebase. ATENÇÃO: Você precisa ir no Console do Firebase > Authentication > Sign-in method e ATIVAR "E-mail/Senha".';
      }
      if (err.code === 'auth/weak-password') message = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      if (err.code === 'auth/invalid-email') message = 'O formato do e-mail é inválido.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') message = 'E-mail ou senha incorretos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError('Tente fazer login primeiro para reenviar o e-mail de verificação.');
      return;
    }
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setSuccess('E-mail de verificação reenviado! Verifique sua caixa de entrada.');
      setError(null);
    } catch (err: any) {
      setError('Erro ao reenviar e-mail: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Erro ao entrar com Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-montserrat text-white">
      {/* Background subtle glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[400px] z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2">
            ORDEM<span className="text-blue-500">FY</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Sistema de gestão para assistências técnicas
          </p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
              {error}
              {error.includes('verificada') && (
                <button 
                  onClick={handleResendVerification}
                  className="block w-full mt-2 text-blue-500 hover:underline uppercase tracking-widest text-[10px]"
                >
                  Reenviar e-mail de verificação
                </button>
              )}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-bold text-center">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  Nome Completo
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} className="opacity-0" /> {/* Placeholder icon or use User icon */}
                    <Lock size={18} className="absolute inset-0 opacity-0" />
                    <ArrowRight size={18} className="absolute inset-0 opacity-50" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                E-mail
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Senha
                </label>
                <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                  Esqueceu?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (mode === 'login' ? 'Entrando...' : 'Criando conta...') : (mode === 'login' ? 'Entrar na plataforma' : 'Criar minha conta')}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141414] px-2 text-gray-500 font-bold tracking-widest">Ou continue com</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              {loading ? 'Carregando...' : 'Entrar com Google'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center space-y-4">
            <p className="text-gray-500 text-sm">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'} {' '}
              <button 
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccess(null);
                }} 
                className="text-blue-500 font-bold hover:underline"
              >
                {mode === 'login' ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </p>
            {mode === 'login' && (
              <button 
                type="button"
                onClick={onLogin}
                className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-gray-400 transition-colors"
              >
                Entrar como Visitante
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">
            © 2026 ORDEMFY • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
