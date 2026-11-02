import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Kanban, ArrowLeft, Users, Briefcase, RefreshCw } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const ApplicantTrackerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}/applications`);
      setJob(res.data.job);
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Fetch job applicants error:', err);
      showToast('Failed to load applicant pipeline for this job', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobApplicants();
  }, [id]);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <Kanban className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {job?.title || 'Applicant Kanban Pipeline'}
              </h1>
              <p className="text-xs text-slate-400">
                Manage candidate transitions across recruitment stages
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{applications.length} Total Applicants</span>
          </div>
          <button
            onClick={fetchJobApplicants}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Refresh Applicants"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Kanban Board Area */}
      {loading ? (
        <div className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
      ) : (
        <KanbanBoard
          applications={applications}
          onStatusUpdate={fetchJobApplicants}
        />
      )}

    </div>
  );
};

export default ApplicantTrackerPage;
