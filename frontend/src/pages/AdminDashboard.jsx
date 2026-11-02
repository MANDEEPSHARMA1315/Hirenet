import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Users, Building2, Briefcase, FileText, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const queueRes = await api.get('/admin/recruiters/pending');
      setPendingQueue(queueRes.data.companies || []);
    } catch (err) {
      console.error('Fetch admin data error:', err);
      showToast('Failed to load admin management data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (userId, currentVerified) => {
    try {
      await api.patch(`/admin/recruiters/${userId}/verify`, {
        isVerified: !currentVerified
      });
      showToast(`Recruiter verification status updated!`, 'success');
      fetchAdminData();
    } catch (err) {
      console.error('Verify error:', err);
      showToast('Failed to update verification status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-purple-400">System Administration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Platform Admin Control Panel</h1>
          <p className="text-xs text-slate-400">Verify recruiter organizations, moderate job postings, and audit platform metrics</p>
        </div>
        <ShieldCheck className="w-10 h-10 text-purple-400 shrink-0" />
      </div>

      {/* Platform Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Candidates</span>
              <Users className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.users?.totalCandidates || 0}</div>
            <div className="text-[10px] text-slate-500 mt-1">Registered applicants</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Recruiters</span>
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">{stats.users?.totalRecruiters || 0}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              {stats.users?.verifiedRecruiters || 0} Verified • {stats.users?.pendingRecruiters || 0} Pending
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Active Jobs</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats.jobs?.active || 0}</div>
            <div className="text-[10px] text-slate-500 mt-1">{stats.jobs?.total || 0} total postings</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Total Applications</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats.applications?.total || 0}</div>
            <div className="text-[10px] text-slate-500 mt-1">Submitted applications</div>
          </div>
        </div>
      )}

      {/* Recruiter Verification Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Recruiter & Company Verification Queue</span>
          </h3>
          <span className="text-xs text-slate-400">{pendingQueue.length} Companies</span>
        </div>

        {loading ? (
          <div className="h-40 bg-slate-900/60 rounded-xl animate-pulse" />
        ) : pendingQueue.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs italic">
            No recruiter verification requests pending.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Company Name</th>
                  <th className="p-3 font-semibold">Recruiter Email</th>
                  <th className="p-3 font-semibold">Website</th>
                  <th className="p-3 font-semibold">Verification Status</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {pendingQueue.map((item) => {
                  const recruiterUser = item.recruiter || {};
                  const isVerified = recruiterUser.isVerified || item.isVerified;

                  return (
                    <tr key={item._id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3 font-mono">{recruiterUser.email || 'N/A'}</td>
                      <td className="p-3">
                        {item.website ? (
                          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                            {item.website}
                          </a>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isVerified
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {isVerified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleVerification(recruiterUser._id, isVerified)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isVerified
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20'
                          }`}
                        >
                          {isVerified ? 'Revoke Access' : 'Approve & Verify'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
