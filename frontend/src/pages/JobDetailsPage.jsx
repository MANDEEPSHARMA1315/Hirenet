import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Globe,
  Share2,
  Users
} from 'lucide-react';
import SkillMatchBadge from '../components/SkillMatchBadge';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate, profile, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);

      if (isAuthenticated && isCandidate) {
        // Check if candidate already applied
        const appRes = await api.get('/candidates/me/applications');
        const applied = appRes.data.some(app => app.job?._id === id || app.job === id);
        setHasApplied(applied);
      }
    } catch (err) {
      console.error('Fetch job details error:', err);
      showToast('Failed to load job posting details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, isAuthenticated]);

  const isBookmarkedInProfile = profile?.bookmarkedJobs?.some(
    item => (typeof item === 'object' ? item._id === id : item === id)
  );

  const handleBookmark = async () => {
    if (!isAuthenticated || !isCandidate) {
      showToast('Please sign in as a candidate to bookmark jobs', 'info');
      return;
    }
    try {
      await api.post(`/candidates/me/bookmarks/${id}`);
      await refreshUser();
      showToast('Bookmark updated', 'success');
    } catch (err) {
      console.error('Bookmark error:', err);
      showToast('Failed to bookmark job', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-900 rounded-lg" />
        <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-64 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Job Posting Not Found</h2>
        <p className="text-xs text-slate-400">This job may have been closed or removed by the recruiter.</p>
        <Link to="/jobs" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
          Back to Job Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </button>

      {/* Main Header Banner Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-brand-400 text-2xl overflow-hidden shrink-0">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-brand-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-brand-400">{job.company?.name}</span>
                {job.company?.isVerified && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    <CheckCircle2 className="w-3 h-3 text-brand-400" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{job.title}</h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">{job.jobType}</span>
                </span>
                <span>•</span>
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {isCandidate && (
              <button
                onClick={handleBookmark}
                className={`p-3 rounded-xl border transition-all ${
                  isBookmarkedInProfile
                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={isBookmarkedInProfile ? 'Remove Bookmark' : 'Bookmark Job'}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarkedInProfile ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {isCandidate ? (
              hasApplied ? (
                <div className="px-6 py-3 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-2 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Application Submitted</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 transition-all"
                >
                  Apply Now
                </button>
              )
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-extrabold bg-brand-600 text-white hover:bg-brand-500 text-center"
              >
                Sign In to Apply
              </Link>
            ) : (
              <div className="text-xs text-slate-400 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
                Log in as Candidate to Apply
              </div>
            )}
          </div>

        </div>

        {/* Skill Match Banner if Candidate */}
        {isCandidate && job.matchPercentage !== undefined && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Your Skill Match Analysis</span>
              </div>
              <SkillMatchBadge matchPercentage={job.matchPercentage} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/30">
                <span className="font-semibold text-emerald-300">Matching Skills: </span>
                <span className="text-emerald-200">
                  {job.matchedSkills?.length ? job.matchedSkills.join(', ') : 'None'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/30">
                <span className="font-semibold text-rose-300">Missing Requirements: </span>
                <span className="text-rose-200">
                  {job.missingSkills?.length ? job.missingSkills.join(', ') : 'None! You match 100%'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Description & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Job Description
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Required Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-brand-300 border border-slate-800 text-xs font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Job Overview Sidebar */}
        <div className="space-y-6">
          
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Overview
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Offered Compensation</span>
                <span className="font-bold text-emerald-400">
                  ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Experience Level</span>
                <span className="font-semibold text-slate-200 capitalize">{job.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Employment Type</span>
                <span className="font-semibold text-slate-200 capitalize">{job.jobType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Views Counter</span>
                <span className="font-semibold text-slate-200">{job.viewCount} views</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Applicants</span>
                <span className="font-semibold text-brand-400">{job.totalApplications || 0} candidates</span>
              </div>
            </div>
          </div>

          {/* Company Profile Card */}
          {job.company && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">About {job.company.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {job.company.description || 'Innovative organization building modern software applications.'}
              </p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold pt-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Company Website</span>
                </a>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          setHasApplied(true);
          fetchJobDetails();
        }}
      />

    </div>
  );
};

export default JobDetailsPage;
