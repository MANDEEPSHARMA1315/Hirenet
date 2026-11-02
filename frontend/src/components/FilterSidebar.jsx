import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw, DollarSign, Wrench } from 'lucide-react';

const POPULAR_SKILLS = [
  'react',
  'node.js',
  'typescript',
  'python',
  'mongodb',
  'docker',
  'kubernetes',
  'aws',
  'figma',
  'security',
  'mobile',
  'tailwind'
];

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [locationInput, setLocationInput] = useState(filters.location || '');

  // Debounce search inputs by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        search: searchInput,
        location: locationInput
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, locationInput]);

  const handleJobTypeToggle = (type) => {
    const current = filters.jobType || '';
    onFilterChange({ jobType: current === type ? '' : type });
  };

  const handleExpToggle = (level) => {
    const current = filters.experienceLevel || '';
    onFilterChange({ experienceLevel: current === level ? '' : level });
  };

  const handleSkillToggle = (skill) => {
    let currentSkills = filters.skills ? filters.skills.split(',').filter(Boolean) : [];
    if (currentSkills.includes(skill)) {
      currentSkills = currentSkills.filter(s => s !== skill);
    } else {
      currentSkills.push(skill);
    }
    onFilterChange({ skills: currentSkills.join(',') });
  };

  const handleReset = () => {
    setSearchInput('');
    setLocationInput('');
    onReset();
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-6">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-brand-400" />
          <span>Filter Job Listings</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Keyword Search</label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Role, skill, or keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Location Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Location</label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="City, state, or 'Remote'"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Job Type Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Job Type</label>
        <div className="space-y-1.5">
          {['full-time', 'part-time', 'contract', 'internship', 'remote'].map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer capitalize"
            >
              <input
                type="checkbox"
                checked={filters.jobType === type}
                onChange={() => handleJobTypeToggle(type)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-brand-600 focus:ring-brand-500 focus:ring-offset-slate-900"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Experience Level</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['entry', 'mid', 'senior'].map((level) => (
            <button
              key={level}
              onClick={() => handleExpToggle(level)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                filters.experienceLevel === level
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Min Salary Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Min Salary</span>
          <span className="text-brand-400 font-mono">
            {filters.minSalary ? `$${(filters.minSalary / 1000).toFixed(0)}k/yr` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="10000"
          value={filters.minSalary || 0}
          onChange={(e) => onFilterChange({ minSalary: e.target.value === '0' ? '' : e.target.value })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Popular Required Skills Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
          <Wrench className="w-3.5 h-3.5 text-brand-400" />
          <span>Skill Filter</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.map((skill) => {
            const activeSkills = filters.skills ? filters.skills.split(',') : [];
            const isSelected = activeSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                  isSelected
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default FilterSidebar;
