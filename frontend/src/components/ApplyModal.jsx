import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [coverLetter, setCoverLetter] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      await api.post(`/jobs/${job._id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('Application submitted successfully!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Apply error:', err);
      if (err.response && err.response.status === 409) {
        showToast('You have already applied to this position!', 'error');
      } else {
        showToast(err.response?.data?.message || 'Failed to submit application', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-brand-400">Job Application</span>
            <h2 className="text-xl font-bold text-white mt-1">{job.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{job.company?.name} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200">
              Resume Attachment <span className="text-rose-400">*</span>
            </label>

            {profile?.resumeUrl && !selectedFile && (
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Profile Resume Attached</p>
                    <p className="text-[10px] text-slate-400">{profile.resumeUrl.split('/').pop()}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Default
                </span>
              </div>
            )}

            <div className="relative border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-xl p-4 text-center transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload className="w-6 h-6 text-brand-400" />
                <p className="text-xs font-semibold text-slate-300">
                  {selectedFile ? selectedFile.name : 'Upload custom resume (PDF, DOC, max 5MB)'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {selectedFile ? 'Click to change file' : 'Or use default profile resume if available'}
                </p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Cover Letter / Statement <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Why are you a great fit for this role? Highlight your relevant achievements..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (!profile?.resumeUrl && !selectedFile)}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
