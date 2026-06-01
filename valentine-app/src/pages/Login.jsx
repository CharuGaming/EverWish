import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Mail, Key, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { loginAdmin, requestPasswordReset, resetPassword } from '../api';

export default function Login() {
  const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [email, setEmail] = useState('');
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        localStorage.setItem('adminToken', res.token);
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSuccessMsg(res.message || 'OTP sent to your email.');
        setView('reset');
      } else {
        setError(res.message || 'Failed to request reset.');
      }
    } catch (err) {
      setError('Failed to request reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await resetPassword(email, otp, newPassword);
      if (res.success) {
        setSuccessMsg('Password reset successful! You can now login.');
        setTimeout(() => {
          setView('login');
          setSuccessMsg('');
          setPassword('');
          setOtp('');
          setNewPassword('');
        }, 2000);
      } else {
        setError(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Failed to reset password. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-900">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[120px]" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-amber-500/20 blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">EverWish</h1>
            <p className="text-white/50 text-sm tracking-widest uppercase">Admin Portal</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm text-center mb-6"
              >
                {error}
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl text-sm text-center mb-6"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="Username or Email"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button 
                      type="button" 
                      onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }}
                      className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Login <ArrowRight size={18} /></>
                  )}
                </button>
              </motion.form>
            )}

            {view === 'forgot' && (
              <motion.form 
                key="forgot-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleForgot}
                className="space-y-4"
              >
                <p className="text-white/70 text-sm text-center mb-6">Enter your email address to receive a password reset OTP.</p>
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="email" 
                      placeholder="Admin Email Address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send OTP'}
                </button>

                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}
                    className="text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </button>
                </div>
              </motion.form>
            )}

            {view === 'reset' && (
              <motion.form 
                key="reset-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleReset}
                className="space-y-4"
              >
                <p className="text-white/70 text-sm text-center mb-6">Enter the 6-digit OTP sent to {email}</p>
                
                <div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="6-Digit OTP"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all tracking-widest font-mono"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="relative mt-4">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Reset Password'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
