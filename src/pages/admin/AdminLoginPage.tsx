import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Administrator email is required.' })
    .email({ message: 'Please enter a valid administrator email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginDevPreview, isBackendConfigured, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to /admin or previous page
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setAuthError(
          result.error ||
            'Invalid credentials or administrator account not verified. Please verify your identity.'
        );
      }
    } catch {
      setAuthError('Network communication error. Unable to reach authentication gateway.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevPreviewAccess = () => {
    loginDevPreview();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-brand-600/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-navy-900 border border-brand-400/40 shadow-xl shadow-brand-500/20 mb-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 5L19 19" />
              <path d="M19 5L5 19" />
              <circle cx="12" cy="12" r="2.5" fill="#10B981" stroke="#0E86D4" strokeWidth="1.5" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            X Management
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-400">
            Super Admin Control Center
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-md">
          {/* Backend Status Alert */}
          {!isBackendConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-200">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Backend Authentication Unconfigured</span>
              </div>
              <p className="text-[11px] text-amber-300/90">
                No production database credentials (<code className="font-mono text-amber-200">VITE_SUPABASE_URL</code>) are detected in environment variables. Live authentication requires backend configuration.
              </p>
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-[10px] text-amber-400/80">UI/UX Evaluation:</span>
                <button
                  type="button"
                  onClick={handleDevPreviewAccess}
                  className="font-bold underline text-amber-200 hover:text-white transition-colors"
                >
                  Enter Dev Preview Mode →
                </button>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{authError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Administrator Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="admin-email"
                  placeholder="superadmin@xmanagement.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                  }`}
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-rose-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
                  }`}
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            >
              {isSubmitting ? 'Verifying Authorization...' : 'Authenticate Super Admin'}
            </Button>
          </form>

          {/* Development Quick Preview Action */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleDevPreviewAccess}
              className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Development Preview Session</span>
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
              Bypasses login strictly for UI/UX inspection when backend is not configured.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
