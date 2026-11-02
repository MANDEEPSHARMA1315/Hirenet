import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, Eye, EyeOff, User, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userObj = await login(email, password);
      showToast(`Welcome back, ${userObj.name}!`, 'success');

      if (userObj.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (userObj.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast(err.response?.data?.message || 'Invalid login credentials', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel rounded-3xl p-8 sm:p-10 max-w-md w-full border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to HireNet</h2>
          <p className="text-xs text-slate-400">Access your applications, job postings, and applicant pipelines</p>
        </div>

        {/* Quick Demo Login Preset Buttons for Mandeep Sharma */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-[11px]">Quick Demo Sign In (Mandeep Sharma):</span>
            <span className="text-[10px] text-brand-400 font-semibold">1-Click Login</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setEmail('mandeep@techcorp.com'); setPassword('password123'); }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-semibold transition-all text-center flex flex-col items-center space-y-1"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => { setEmail('mandeep@gmail.com'); setPassword('password123'); }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-semibold transition-all text-center flex flex-col items-center space-y-1"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => { setEmail('mandeep.admin@hirenet.com'); setPassword('password123'); }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-semibold transition-all text-center flex flex-col items-center space-y-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Mandeep (Admin)</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
