import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Clock, Bookmark, CheckCircle2 } from 'lucide-react';
import SkillMatchBadge from './SkillMatchBadge';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const JobCard = ({ job, isBookmarked = false, onBookmarkToggle }) => {
  const { isCandidate, isAuthenticated, profile, refreshUser } = useAuth();
  const { showToast } = useToast();

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please sign in as a candidate to bookmark jobs', 'info');
      return;
    }

    if (!isCandidate) {
      showToast('Only candidate accounts can bookmark job listings', 'info');
      return;
    }

    try {
      await api.post(`/candidates/me/bookmarks/${job._id}`);
      await refreshUser();
      if (onBookmarkToggle) onBookmarkToggle(job._id);
      showToast('Bookmark updated', 'success');
    } catch (err) {
      console.error('Bookmark error:', err);
      showToast('Failed to bookmark job', 'error');
    }
  };

  const isBookmarkedInProfile = profile?.bookmarkedJobs?.some(
    item => (typeof item === 'object' ? item._id === job._id : item === job._id)
  ) || isBookmarked;

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary Undisclosed';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k / year`;
    if (min) return `From $${(min / 1000).toFixed(0)}k / year`;
    return `Up to $${(max / 1000).toFixed(0)}k / year`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col justify-between group border border-slate-800/80 hover:border-brand-500/40">
      
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-brand-400 text-lg overflow-hidden shrink-0 group-hover:border-brand-500/50 transition-colors">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-brand-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-400">{job.company?.name || 'Company'}</span>
                {job.company?.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 inline" title="Verified Company" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {isCandidate && job.matchPercentage !== undefined && (
              <SkillMatchBadge
                matchPercentage={job.matchPercentage}
                matchedSkills={job.matchedSkills}
                missingSkills={job.missingSkills}
                showDetails={true}
              />
            )}
            {isCandidate && (
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarkedInProfile
                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
                title={isBookmarkedInProfile ? 'Remove Bookmark' : 'Save Job'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarkedInProfile ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Job Tags (Location, Salary, JobType, Exp) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium text-slate-400">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 capitalize">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.jobType}</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20 capitalize text-[11px] font-semibold">
            {job.experienceLevel} level
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Skills required pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skillsRequired?.slice(0, 5).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 5 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-500 text-[10px]">
              +{job.skillsRequired.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Posted {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-brand-600 text-slate-200 hover:text-white border border-slate-800 hover:border-brand-500 transition-all shadow-sm"
        >
          View Details & Apply →
        </Link>
      </div>

    </div>
  );
};

export default JobCard;
