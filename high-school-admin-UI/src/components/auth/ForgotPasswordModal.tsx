import { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, Building2, Phone, Clock } from 'lucide-react';
import Button from '@/components/common/Button';
import { authService } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  defaultIdentifier?: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  roleName,
  defaultIdentifier = '',
}: Props) {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email address or school ID.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(identifier.trim());
      setSuccessMessage(
        response.message ||
          'Password recovery instructions have been dispatched to your registered contact or assigned school advisor.'
      );
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to send password recovery request. Please contact the school administrator directly.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setIdentifier('');
    setError('');
    onClose();
  };

  return (
    <div
      id="forgot-password-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id="close-forgot-password-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Mail size={24} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Reset {roleName} Password
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Enter your registered school email address or School ID (e.g., ADM-xxx, TCH-xxx, STU-xxx). We will verify your account and initiate the secure password reset flow.
            </p>

            {error && (
              <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Email or School ID
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="forgot-password-identifier-input"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. user@varinhigh.edu.kh or STU-2026-089"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Administrative Help & Support Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Building2 size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>School Administrator Support Contact</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" />
                    <span>it-support@varinhigh.edu.kh</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400" />
                    <span>+855 (0) 23 888 999 • Administration Wing, Room 102</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" />
                    <span>Office Hours: Monday – Friday, 7:30 AM – 5:00 PM</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  id="cancel-forgot-password-btn"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  id="submit-forgot-password-btn"
                  variant="solid"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isLoading ? 'Submitting...' : 'Send Recovery Link'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Request Received
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {successMessage}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              Identifier submitted: <strong className="text-slate-900 dark:text-white font-mono">{identifier}</strong>
            </div>

            <div className="mt-6">
              <Button
                id="back-to-signin-after-forgot-btn"
                variant="solid"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-semibold cursor-pointer"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
