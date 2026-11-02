import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Briefcase,
  Building2,
  Users,
  Sparkles,
  TrendingUp,
  Filter,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Palette,
  Terminal,
  Cloud,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Clock,
  ShieldCheck,
  Flame,
  Compass
} from 'lucide-react';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const JOB_CATEGORIES = [
  { id: 'react', title: 'Frontend Development', icon: Code2, count: '7 Openings', color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30' },
  { id: 'node.js', title: 'Backend & Microservices', icon: Terminal, count: '7 Openings', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'mongodb', title: 'Full Stack Engineering', icon: Layers, count: '6 Openings', color: 'from-brand-500/20 to-purple-500/20 text-brand-400 border-brand-500/30' },
  { id: 'python', title: 'AI & Data Science', icon: Cpu, count: '7 Openings', color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30' },
  { id: 'docker', title: 'Cloud & DevOps / SRE', icon: Cloud, count: '5 Openings', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'figma', title: 'UI/UX & Product Design', icon: Palette, count: '5 Openings', color: 'from-amber-500/20 to-rose-500/20 text-amber-400 border-amber-500/30' },
];

const FEATURED_COMPANIES = [
  { name: 'TechCorp Innovations', jobs: 6, rating: '4.9 ★', verified: true, logo: '🏢' },
  { name: 'Innovate AI Labs', jobs: 6, rating: '4.8 ★', verified: true, logo: '🤖' },
  { name: 'CloudScale Systems', jobs: 5, rating: '5.0 ★', verified: true, logo: '☁️' },
  { name: 'FinTech Core Global', jobs: 5, rating: '4.9 ★', verified: true, logo: '💳' },
  { name: 'DesignCraft Studio', jobs: 5, rating: '4.9 ★', verified: true, logo: '🎨' },
  { name: 'DataSphere Analytics', jobs: 5, rating: '5.0 ★', verified: true, logo: '📊' },
  { name: 'NexGen Mobile Labs', jobs: 5, rating: '4.8 ★', verified: true, logo: '📱' },
  { name: 'CyberShield Security', jobs: 5, rating: '5.0 ★', verified: true, logo: '🛡️' },
];

const QUICK_TAGS = ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'Tailwind', 'Docker', 'AWS', 'Kubernetes', 'Figma'];

const LandingPage = () => {
  const { isAuthenticated, isCandidate, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    minSalary: '',
    skills: '',
    page: 1
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.jobs || []);
      setTotalJobs(res.data.totalJobs || 0);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
    const explorerEl = document.getElementById('explorer-section');
    if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      minSalary: '',
      skills: '',
      page: 1
    });
  };

  const handleCategoryClick = (skillTag) => {
    handleFilterChange({ skills: skillTag });
    const explorerEl = document.getElementById('explorer-section');
    if (explorerEl) explorerEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      {/* Dynamic Hero Section */}
      <section className="relative pt-12 pb-20">
        
        {/* Animated Orbs & Background Grid */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-600/30 via-purple-600/20 to-indigo-600/30 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-indigo-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold shadow-lg backdrop-blur-md">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>AI Skill-Match Algorithm • Kanban Pipeline • Zero Spam</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Find Your Next Career Move With{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              Precision Matching
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified tech recruiters. Upload your resume, see your instant <strong className="text-brand-300">% skill match</strong>, and track your application status in real-time.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 backdrop-blur-xl">
            <div className="flex-1 flex items-center space-x-3 px-4 py-1.5 w-full">
              <Search className="w-5 h-5 text-brand-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, tech stack (e.g. React, Node, Python, Remote)..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('explorer-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-xl shadow-brand-600/30 transition-all transform hover:scale-[1.02] shrink-0 flex items-center justify-center space-x-2"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Skill Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Popular Tags:</span>
            {QUICK_TAGS.map((tag) => {
              const isSelected = filters.skills.includes(tag.toLowerCase());
              return (
                <button
                  key={tag}
                  onClick={() => handleFilterChange({ skills: tag.toLowerCase() })}
                  className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-all border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-600/30'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Live Platform Highlights & Metrics */}
          <div className="pt-6 space-y-4 max-w-6xl mx-auto">
            
            {/* Header chip */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium text-slate-300">Live Platform Metrics</span>
                <span className="text-slate-600">•</span>
                <span>56+ Verified Openings Across 10 Tech Domains</span>
              </div>
            </div>

            {/* 6 Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Card 1: 56+ Active Tech Jobs */}
              <div
                onClick={() => {
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-left hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">56+</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">Active Tech Jobs</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">10 tech domains</div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                    +8 Today
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">View →</span>
                </div>
              </div>

              {/* Card 2: 94% Skill Match */}
              <div
                onClick={() => {
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-left hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-emerald-400 group-hover:text-emerald-300 transition-colors">94%</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">Precision Match</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Per candidate profile</div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    AI Analysis
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">Check →</span>
                </div>
              </div>

              {/* Card 3: $135k Median Pay */}
              <div
                onClick={() => {
                  handleFilterChange({ minSalary: '120000' });
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-left hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-amber-400 group-hover:text-amber-300 transition-colors">$135k</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">Median Pay</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Up to $235k / yr</div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                    Transparent
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">Filter →</span>
                </div>
              </div>

              {/* Card 4: <48h Recruiter Response */}
              <div
                onClick={() => {
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-left hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-cyan-400 group-hover:text-cyan-300 transition-colors">&lt;48h</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">Response Speed</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Direct hiring manager</div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    Zero Ghost
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">Fast →</span>
                </div>
              </div>

              {/* Card 5: Kanban Pipeline */}
              <div
                onClick={() => {
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-left hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-purple-400 group-hover:text-purple-300 transition-colors">Live</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">Kanban Board</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Track Applied → Offer</div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                    Real-time
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">Track →</span>
                </div>
              </div>

              {/* Card 6: 100% Verified */}
              <div
                onClick={() => {
                  const el = document.getElementById('companies-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card p-4 rounded-2xl border border-slate-800 text-left hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-rose-400 group-hover:text-rose-300 transition-colors">100%</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">Verified Teams</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">9 audited tech firms</div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                    Zero Spam
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-slate-300 transition-colors">Audit →</span>
                </div>
              </div>

            </div>

            {/* Fast-Track Presets Strip */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center space-x-1 mr-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast-Track Presets:</span>
              </span>

              {[
                { label: '🌐 Remote Only', filter: { location: 'Remote' } },
                { label: '💰 $140k+ High Pay', filter: { minSalary: '140000' } },
                { label: '⭐ Senior Roles', filter: { experienceLevel: 'senior' } },
                { label: '🚀 Mid-Level', filter: { experienceLevel: 'mid' } },
                { label: '🎓 Entry / Internships', filter: { experienceLevel: 'entry' } },
                { label: '🤖 AI & Data Science', filter: { skills: 'python' } },
                { label: '⚡ React & Frontend', filter: { skills: 'react' } },
                { label: '🛡️ Cybersecurity & SRE', filter: { skills: 'security' } },
              ].map((preset, idx) => {
                const isActive = (preset.filter.location && filters.location === preset.filter.location) ||
                  (preset.filter.experienceLevel && filters.experienceLevel === preset.filter.experienceLevel) ||
                  (preset.filter.minSalary && filters.minSalary === preset.filter.minSalary) ||
                  (preset.filter.skills && filters.skills === preset.filter.skills);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      handleFilterChange(preset.filter);
                      const el = document.getElementById('explorer-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border ${
                      isActive
                        ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-600/30'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800/90 hover:border-slate-700 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Live Trust Banner */}
            <div className="glass-panel py-2 px-4 rounded-xl border border-slate-800/70 flex flex-wrap items-center justify-around gap-3 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong className="text-slate-200">9 Verified Employers</strong> actively hiring</span>
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span><strong className="text-slate-200">Sub-second</strong> AI Skill Matching</span>
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-400" />
                <span><strong className="text-slate-200">100% Direct</strong> Applications (No Agency Spam)</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Top Hiring Companies Showcase Marquee */}
      <section id="companies-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>Hiring Companies On HireNet</span>
            </h3>
            <span className="text-[11px] text-brand-400 font-semibold">100% Verified Accounts</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_COMPANIES.map((company, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-brand-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-xl border border-slate-800">
                    {company.logo}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">{company.name}</h4>
                      {company.verified && <CheckCircle2 className="w-3 h-3 text-brand-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400">{company.jobs} Open Positions</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {company.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Category Cards Explorer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Explore By Specialization</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Filter tech job listings by your primary stack and domain expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {JOB_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`glass-card rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br ${cat.color} group relative overflow-hidden`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
                    {cat.count}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                    <span>Explore opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Job Explorer Section */}
      <section id="explorer-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-brand-400" />
              <h2 className="text-2xl font-bold text-white">Featured Position Listings</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Showing {totalJobs} position{totalJobs === 1 ? '' : 's'} matching active filters
            </p>
          </div>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/25 transition-all"
            >
              <span>Sign in as Candidate to view % Skill Match</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column Filters */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Column Job Listings */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Jobs Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No open postings match your current filter criteria. Try resetting keyword or location filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-400">
                      Showing <strong className="text-white">{(filters.page - 1) * 12 + 1}</strong> to <strong className="text-white">{Math.min(filters.page * 12, totalJobs)}</strong> of <strong className="text-white">{totalJobs}</strong> open positions
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        disabled={filters.page <= 1}
                        onClick={() => handlePageChange(filters.page - 1)}
                        className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 text-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border ${
                              filters.page === p
                                ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-600/30'
                                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={filters.page >= totalPages}
                        onClick={() => handlePageChange(filters.page + 1)}
                        className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 text-xs"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </section>

    </div>
  );
};

export default LandingPage;
