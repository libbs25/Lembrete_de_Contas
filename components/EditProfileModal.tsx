
import React, { useState, useEffect } from 'react';
import { X, Save, Camera } from 'lucide-react';
import { User, Language } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
  language: Language;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSave, language }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, name, email, avatar });
  };

  const t = {
    title: language === 'pt' ? 'Editar Perfil' : 'Edit Profile',
    nameLabel: language === 'pt' ? 'Nome Completo' : 'Full Name',
    emailLabel: language === 'pt' ? 'E-mail' : 'Email Address',
    avatarLabel: language === 'pt' ? 'URL da Foto' : 'Avatar URL',
    saveBtn: language === 'pt' ? 'Salvar Alterações' : 'Save Changes',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-bold">{t.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative">
              <img 
                src={avatar || 'https://picsum.photos/200'} 
                alt="Preview" 
                className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-500/10 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-white shadow-lg">
                <Camera size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.nameLabel}</label>
            <input 
              type="text" 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.emailLabel}</label>
            <input 
              type="email" 
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t.avatarLabel}</label>
            <input 
              type="text" 
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} />
            {t.saveBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
