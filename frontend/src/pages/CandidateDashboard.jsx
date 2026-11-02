import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Bookmark, Clock, CheckCircle2, XCircle, ChevronRight, Building2, Sparkles } from 'lucide-react';
import SkillMatchBadge from '../components/SkillMatchBadge';
import JobCard from '../components/JobCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STAGE_ORDER = ['applied', 'shortlisted', 'interview', 'offer', 'hired'];

const CandidateDashboard = () => {
  const { user, profile, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/candidates/me/applications');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-brand-400">Candidate Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-400">
            Track application status changes and manage saved job listings
          </p>
        </div>

        <Link
          to="/candidate/profile"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all flex items-center space-x-2"
        >
          <span>Edit Profile & Resume</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'applications'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'bookmarks'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarked Jobs ({profile?.bookmarkedJobs?.length || 0})</span>
        </button>
      </div>

      {/* Applications View */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-40 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Applications Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore open positions and apply with your uploaded resume and skill match insights.
              </p>
              <Link to="/jobs" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold">
                Explore Jobs
              </Link>
            </div>
          ) : (
            applications.map((app) => {
              const currentStageIdx = STAGE_ORDER.indexOf(app.status);

              return (
                <div
                  key={app._id}
                  className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-brand-500/40 transition-all space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-brand-400">
                        {app.job?.company?.logoUrl ? (
                          <img src={app.job.company.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400">
                          {app.job?.company?.name || 'Company'}
                        </span>
                        <Link to={`/jobs/${app.job?._id}`}>
                          <h3 className="text-base font-bold text-white hover:text-brand-300 transition-colors">
                            {app.job?.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {app.matchPercentage !== undefined && (
                        <SkillMatchBadge
                          matchPercentage={app.matchPercentage}
                          matchedSkills={app.matchedSkills}
                          missingSkills={app.missingSkills}
                          showDetails={true}
                        />
                      )}
                      <span className="text-xs text-slate-500">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Stage Timeline Stepper */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-slate-400 mb-2">Application Stage Trail</div>
                    {app.status === 'rejected' ? (
                      <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/40 text-rose-300 text-xs flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Application Status: Rejected by recruiter</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {STAGE_ORDER.map((stage, idx) => {
                          const isDone = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;

                          return (
                            <div key={stage} className="space-y-1">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isCurrent
                                    ? 'bg-brand-500 shadow-md shadow-brand-500/50 animate-pulse'
                                    : isDone
                                    ? 'bg-brand-600'
                                    : 'bg-slate-800'
                                }`}
                              />
                              <span
                                className={`text-[10px] font-semibold capitalize block ${
                                  isCurrent
                                    ? 'text-brand-300 font-bold'
                                    : isDone
                                    ? 'text-slate-300'
                                    : 'text-slate-600'
                                }`}
                              >
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Cover Letter preview */}
                  {app.coverLetter && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 italic">
                      Cover Letter: "{app.coverLetter}"
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bookmarks View */}
      {activeTab === 'bookmarks' && (
        <div>
          {!profile?.bookmarkedJobs || profile.bookmarkedJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Bookmarked Jobs</h3>
              <p className="text-xs text-slate-400">Save jobs while exploring to access them quickly later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.bookmarkedJobs.map((job) => (
                <JobCard
                  key={typeof job === 'object' ? job._id : job}
                  job={typeof job === 'object' ? job : { _id: job, title: 'Saved Job' }}
                  isBookmarked={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default CandidateDashboard;
