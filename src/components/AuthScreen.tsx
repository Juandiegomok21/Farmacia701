import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onCancel, isModal = false }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos. Por favor, verifica tus datos.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta registrada con este correo electrónico.';
      case 'auth/invalid-email':
        return 'El formato de correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe contener al menos 6 caracteres.';
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de autenticación de Google.';
      default:
        return err?.message || 'Ocurrió un error al procesar tu solicitud.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor ingresa tu nombre completo.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(name.trim(), email.trim(), password);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Brand Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white text-center relative">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner mb-3">
          <span className="text-2xl font-black tracking-tight text-white">701</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Farmacia 701</h2>
        <p className="text-xs text-blue-100 mt-1">
          {mode === 'login' ? 'Acceso a tu portal de salud y recetas digitales' : 'Regístrate para gestionar tus recetas y medicamentos'}
        </p>

        {isModal && onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            mode === 'login'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-xs hover:border-slate-300 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{mode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}</span>
        </button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
              o con tu correo
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Roberto Chen"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="paciente@farmacia701.com"
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-slate-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Entrar a Farmacia 701' : 'Completar Registro'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Datos clínicos protegidos</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cloud SQL Sync</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {content}
    </div>
  );
};
