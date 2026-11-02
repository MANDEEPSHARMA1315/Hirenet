import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Users,
  Eye,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock,
  Kanban,
  Edit,
  Trash2,
  Globe
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RecruiterDashboard = () => {
  const { user, profile, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [compName, setCompName] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [editingCompany, setEditingCompany] = useState(false);

  const fetchRecruiterData = async () => {
    setLoading(true);
    try {
      const compRes = await api.get('/companies/me');
      setCompany(compRes.data);
      if (compRes.data) {
        setCompName(compRes.data.name || '');
        setCompWebsite(compRes.data.website || '');
        setCompDesc(compRes.data.description || '');
      }

      const jobsRes = await api.get('/jobs/recruiter/mine');
      setJobs(jobsRes.data || []);
    } catch (err) {
      console.error('Fetch recruiter data error:', err);
      showToast('Failed to load recruiter workspace data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/companies', {
        name: compName,
        website: compWebsite,
        description: compDesc
      });
      setCompany(res.data);
      setEditingCompany(false);
      await refreshUser();
      showToast('Company profile updated!', 'success');
    } catch (err) {
      console.error('Update company error:', err);
      showToast('Failed to update company profile', 'error');
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      showToast(`Job status changed to ${newStatus}`, 'success');
      fetchRecruiterData();
    } catch (err) {
      console.error('Toggle job status error:', err);
      showToast('Failed to update job status', 'error');
    }
  };

  // Analytics Metrics
  const totalViews = jobs.reduce((acc, j) => acc + (j.viewCount || 0), 0);
  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);
  const activeJobsCount = jobs.filter(j => j.status === 'open').length;
  const avgConversion = totalViews > 0 ? ((totalApplicants / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-brand-400">Recruiter Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {company?.name || `${user?.name}'s Company`}
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-slate-400">
              Account Status: {user?.isVerified ? 'Verified Recruiter' : 'Pending Admin Verification'}
            </span>
            {user?.isVerified && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
          </div>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Recruiter Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Postings</span>
            <Briefcase className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeJobsCount} / {jobs.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Open recruitment positions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Applicants</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{totalApplicants}</div>
          <div className="text-[10px] text-slate-500 mt-1">Across all pipeline stages</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Job Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{totalViews}</div>
          <div className="text-[10px] text-slate-500 mt-1">Impression counts</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Avg Conversion</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{avgConversion}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Applicants per view</div>
        </div>
      </div>

      {/* Main Grid: Company Setup & Job Postings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Company Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-brand-400" />
                <span>Company Profile</span>
              </h3>
              <button
                onClick={() => setEditingCompany(!editingCompany)}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                {editingCompany ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editingCompany ? (
              <form onSubmit={handleUpdateCompany} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Company Name</label>
                  <input
                    type="text"
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Website URL</label>
                  <input
                    type="url"
                    value={compWebsite}
                    onChange={(e) => setCompWebsite(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">About Description</label>
                  <textarea
                    rows={3}
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-xs"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Organization</span>
                  <span className="font-bold text-white text-sm">{company?.name}</span>
                </div>
                {company?.website && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">Website</span>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                      {company.website}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block text-[10px]">Description</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {company?.description || 'No description added yet.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Postings List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Job Listings</h3>
            <span className="text-xs text-slate-400">{jobs.length} Total</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Job Postings Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create your first job listing to start receiving candidate applications.
              </p>
              <Link to="/recruiter/jobs/new" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
                + Post First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-brand-500/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          job.status === 'open'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-slate-400">• {job.location}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{job.title}</h4>
                    </div>

                    {/* Job Performance Stats */}
                    <div className="flex items-center space-x-4 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Views</span>
                        <span className="text-purple-400 font-bold">{job.viewCount}</span>
                      </div>
                      <div className="border-l border-slate-800 pl-4">
                        <span className="text-slate-500 text-[10px] block">Applicants</span>
                        <span className="text-emerald-400 font-bold">{job.applicantCount}</span>
                      </div>
                      <div className="border-l border-slate-800 pl-4">
                        <span className="text-slate-500 text-[10px] block">Conv %</span>
                        <span className="text-amber-400 font-bold">{job.conversionRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-brand-600/20"
                    >
                      <Kanban className="w-4 h-4" />
                      <span>Applicant Kanban Tracker ({job.applicantCount})</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/recruiter/jobs/${job._id}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center space-x-1 border border-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleToggleJobStatus(job._id, job.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          job.status === 'open'
                            ? 'bg-rose-950/40 text-rose-300 border-rose-800/40 hover:bg-rose-900/50'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/50'
                        }`}
                      >
                        {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;
