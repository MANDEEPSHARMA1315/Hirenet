import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Save, ArrowLeft, Wrench } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const JobFormPage = () => {
  const { id } = useParams(); // If present, edit mode!
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('Remote');
  const [jobType, setJobType] = useState('full-time');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [salaryMin, setSalaryMin] = useState(80000);
  const [salaryMax, setSalaryMax] = useState(130000);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);
          const j = res.data;
          setTitle(j.title || '');
          setDescription(j.description || '');
          setSkillsRequired(j.skillsRequired || []);
          setLocation(j.location || 'Remote');
          setJobType(j.jobType || 'full-time');
          setExperienceLevel(j.experienceLevel || 'mid');
          setSalaryMin(j.salaryMin || 0);
          setSalaryMax(j.salaryMax || 0);
        } catch (err) {
          console.error('Fetch job error:', err);
          showToast('Failed to load job details', 'error');
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const clean = skillInput.trim().toLowerCase();
    if (!skillsRequired.includes(clean)) {
      setSkillsRequired([...skillsRequired, clean]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsRequired(skillsRequired.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skillsRequired.length === 0) {
      showToast('Please add at least one required skill tag', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        skillsRequired,
        location,
        jobType,
        experienceLevel,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax)
      };

      if (isEditMode) {
        await api.put(`/jobs/${id}`, payload);
        showToast('Job posting updated successfully!', 'success');
      } else {
        await api.post('/jobs', payload);
        showToast('New job posting published successfully!', 'success');
      }

      navigate('/recruiter/dashboard');
    } catch (err) {
      console.error('Job submit error:', err);
      showToast(err.response?.data?.message || 'Failed to save job posting', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <button
        onClick={() => navigate('/recruiter/dashboard')}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recruiter Dashboard</span>
      </button>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-semibold text-brand-400">Recruitment Management</span>
          <h1 className="text-2xl font-black text-white mt-1">
            {isEditMode ? 'Edit Job Posting' : 'Create New Job Listing'}
          </h1>
          <p className="text-xs text-slate-400">
            Define requirements and required skill tags to enable candidate skill match scoring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Job Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Full Stack Developer (React & Node)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Location</label>
              <input
                type="text"
                required
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Employment Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Min Salary ($/year)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Max Salary ($/year)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Skill Tags Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Wrench className="w-3.5 h-3.5 text-brand-400" />
              <span>Required Technical Skills <span className="text-rose-400">*</span></span>
            </label>
            <p className="text-[11px] text-slate-400">Skills added here form the baseline for candidate match percentage calculation.</p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type skill tag (e.g. react, node.js, mongodb)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skillsRequired.map((skill, idx) => (
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Detailed Job Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={6}
              required
              placeholder="Describe core responsibilities, team culture, requirements, and benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : isEditMode ? 'Save Changes' : 'Publish Job Listing'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default JobFormPage;
