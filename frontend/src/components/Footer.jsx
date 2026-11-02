import React from 'react';
import { Briefcase, Heart, Code2, Database, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Hire<span className="text-brand-400">Net</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Designed & Architected by <strong className="text-slate-200 font-bold">Mandeep Sharma</strong>. An intelligent full-stack recruitment platform with real-time skill-match analysis, resume tracking, and recruiter Kanban pipelines.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-500 pt-2">
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <Code2 className="w-3 h-3 text-brand-400" />
                <span>React + Vite</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB MERN</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <Shield className="w-3 h-3 text-purple-400" />
                <span>JWT Auth & RBAC</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Candidates</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/jobs" className="hover:text-white transition-colors">Browse Job Listings</a></li>
              <li><a href="/candidate/profile" className="hover:text-white transition-colors">Build Candidate Profile</a></li>
              <li><a href="/candidate/dashboard" className="hover:text-white transition-colors">Application Tracker</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Recruiters</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/recruiter/jobs/new" className="hover:text-white transition-colors">Post a Job</a></li>
              <li><a href="/recruiter/dashboard" className="hover:text-white transition-colors">Kanban Pipeline</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Company Verification</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} HireNet Platform — Original Full Stack Project by <strong className="text-brand-400">Mandeep Sharma</strong></p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>MERN Stack Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
