import React, { useState } from 'react';
import {
  FileText,
  User,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  History,
  ExternalLink
} from 'lucide-react';
import SkillMatchBadge from './SkillMatchBadge';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const KANBAN_STAGES = [
  { id: 'applied', label: 'Applied', color: 'border-slate-700 bg-slate-900/60' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'border-blue-500/40 bg-blue-950/20' },
  { id: 'interview', label: 'Interview', color: 'border-purple-500/40 bg-purple-950/20' },
  { id: 'offer', label: 'Offer Extended', color: 'border-amber-500/40 bg-amber-950/20' },
  { id: 'hired', label: 'Hired', color: 'border-emerald-500/40 bg-emerald-950/20' },
  { id: 'rejected', label: 'Rejected', color: 'border-rose-500/40 bg-rose-950/20' },
];

const KanbanBoard = ({ applications = [], onStatusUpdate }) => {
  const { showToast } = useToast();
  const [selectedHistoryApp, setSelectedHistoryApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleStageChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      showToast(`Applicant moved to ${newStatus.toUpperCase()}`, 'success');
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error('Stage change error:', err);
      showToast('Failed to update candidate pipeline stage', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map((stage) => {
          const stageApps = applications.filter(app => app.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border ${stage.color} p-4 flex flex-col h-[650px] shrink-0 min-w-[260px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-xs">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stageApps.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800/60 rounded-xl text-slate-600 text-xs italic text-center p-2">
                    No candidates in {stage.label}
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app._id}
                      className="glass-card rounded-xl p-3.5 border border-slate-800 hover:border-brand-500/40 transition-all space-y-3 shadow-lg"
                    >
                      {/* Candidate Name & Match Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {app.candidate?.name || 'Applicant'}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">
                            {app.candidateProfile?.headline || app.candidate?.email}
                          </p>
                        </div>
                        {app.matchPercentage !== undefined && (
                          <SkillMatchBadge matchPercentage={app.matchPercentage} />
                        )}
                      </div>

                      {/* Experience & Skills */}
                      {app.candidateProfile && (
                        <div className="space-y-1.5 text-[11px] text-slate-400">
                          {app.candidateProfile.experienceYears > 0 && (
                            <p className="text-slate-300">
                              ⚡ {app.candidateProfile.experienceYears} yrs experience
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {app.candidateProfile.skills?.slice(0, 3).map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cover Letter preview snippet */}
                      {app.coverLetter && (
                        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 italic line-clamp-2">
                          "{app.coverLetter}"
                        </div>
                      )}

                      {/* Links & History Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-brand-400 hover:text-brand-300 font-medium text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600">No Resume</span>
                        )}

                        <button
                          onClick={() => setSelectedHistoryApp(app)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Stage Audit History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick Move Stage Selector Dropdown */}
                      <div className="pt-1">
                        <select
                          value={app.status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStageChange(app._id, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-300 focus:outline-none focus:border-brand-500"
                        >
                          {KANBAN_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move to: {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Audit History Modal */}
      {selectedHistoryApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <History className="w-4 h-4 text-brand-400" />
                <span>Pipeline Audit Trail — {selectedHistoryApp.candidate?.name}</span>
              </h3>
              <button
                onClick={() => setSelectedHistoryApp(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedHistoryApp.statusHistory?.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200 capitalize">
                      Moved to: <span className="text-brand-400">{log.status}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(log.changedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KanbanBoard;
