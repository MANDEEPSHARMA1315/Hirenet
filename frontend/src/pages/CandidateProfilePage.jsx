import React, { useState, useEffect } from 'react';
import { User, FileText, Upload, Plus, Trash2, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CandidateProfilePage = () => {
  const { user, profile, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setSkills(profile.skills || []);
      setExperienceYears(profile.experienceYears || 0);
      setLocation(profile.location || '');
      setEducation(profile.education || []);
      setWorkHistory(profile.workHistory || []);
    }
  }, [profile]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const cleanSkill = skillInput.trim().toLowerCase();
    if (!skills.includes(cleanSkill)) {
      setSkills([...skills, cleanSkill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      await api.post('/candidates/me/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await refreshUser();
      showToast('Resume uploaded and attached to candidate profile!', 'success');
    } catch (err) {
      console.error('Resume upload error:', err);
      showToast('Failed to upload resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/candidates/me', {
        headline,
        skills,
        experienceYears,
        location,
        education,
        workHistory
      });

      await refreshUser();
      showToast('Candidate profile updated successfully!', 'success');
    } catch (err) {
      console.error('Save profile error:', err);
      showToast('Failed to save profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-brand-400">Candidate Profile & Skills</span>
          <h1 className="text-2xl font-black text-white mt-1">Profile Builder</h1>
          <p className="text-xs text-slate-400">Your skills power the real-time % match scoring algorithm across all job postings</p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Resume Section */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Resume Management</span>
            </h3>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                Preview Resume →
              </a>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full relative border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-xl p-4 text-center transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload className="w-6 h-6 text-brand-400" />
                <p className="text-xs font-semibold text-slate-300">
                  {uploadingResume ? 'Uploading resume...' : 'Upload PDF or DOC Resume (< 5MB)'}
                </p>
                {profile?.resumeUrl && (
                  <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Current file: {profile.resumeUrl.split('/').pop()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Details */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Professional Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Developer (React & Node.js)"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Total Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Preferred Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Technical Skills ({skills.length})</span>
              </h3>
              <p className="text-[11px] text-slate-400">Add skills like React, Node.js, Python, Tailwind, Docker, etc.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type skill name and press Add..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-brand-950/80 border border-brand-500/40 text-brand-300 text-xs font-mono"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

      </form>

    </div>
  );
};

export default CandidateProfilePage;
