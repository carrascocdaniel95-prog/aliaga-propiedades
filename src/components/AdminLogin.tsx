import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pauli2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);

      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.message || 'Credenciales incorrectas');
      }
    }, 400);
  };

  const fillQuickCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="p-6 sm:p-8 max-w-md mx-auto space-y-6">
      
      {/* Brand & Security Header */}
      <div className="text-center space-y-2">
        <div className="relative w-20 h-20 rounded-3xl overflow-hidden mx-auto shadow-xl border-2 border-teal-500/30">
          <img
            src="/logo-aliaga-emblem.jpg"
            alt="Aliaga Gestión & Corretaje"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-slate-900 text-[#c5a358] flex items-center justify-center shadow">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-slate-900">
          Mantenedor de Propiedades
        </h3>
        <p className="text-xs text-[#1e3a5f] font-bold uppercase tracking-wider">
          Aliaga Gestión & Corretaje
        </p>
        <p className="text-xs text-slate-500 font-medium">
          Acceso seguro restringido para la administración y gestión de publicaciones
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Username */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Usuario o Correo
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin o paulina@paulipropiedades.cl"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Contraseña
            </label>
          </div>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Credentials Helper Card */}
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 space-y-1.5 text-[11px] text-teal-900">
          <div className="flex items-center justify-between font-bold text-teal-800">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Credenciales de Administrador:
            </span>
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin', 'pauli2026')}
              className="text-teal-700 underline hover:text-teal-900 font-bold"
            >
              Autocompletar
            </button>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
            <span>Usuario: <strong>admin</strong></span>
            <span>Clave: <strong>pauli2026</strong></span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Iniciar Sesión en el Mantenedor</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition-colors"
        >
          Volver a la página principal
        </button>

      </form>

      {/* Security Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Panel seguro con encriptación y control de sesiones</span>
      </div>

    </div>
  );
};
