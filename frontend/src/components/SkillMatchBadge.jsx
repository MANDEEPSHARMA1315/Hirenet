import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const SkillMatchBadge = ({ matchPercentage, matchedSkills = [], missingSkills = [], showDetails = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (matchPercentage === undefined || matchPercentage === null) return null;

  let colorStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  let badgeLabel = 'Match Score';

  if (matchPercentage >= 80) {
    colorStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50';
    badgeLabel = 'Strong Match';
  } else if (matchPercentage >= 50) {
    colorStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-950/50';
    badgeLabel = 'Partial Match';
  } else {
    colorStyle = 'bg-slate-900 text-slate-400 border-slate-800';
    badgeLabel = 'Low Match';
  }

  return (
    <div className="inline-block text-left">
      <div
        onClick={() => showDetails && setExpanded(!expanded)}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold shadow-sm transition-all ${colorStyle} ${
          showDetails ? 'cursor-pointer hover:brightness-110' : ''
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{matchPercentage}% Skill Match</span>
        {showDetails && (
          expanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
        )}
      </div>

      {showDetails && expanded && (
        <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 text-xs z-20 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center space-x-1 text-emerald-400 font-semibold mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Matched Skills ({matchedSkills.length})</span>
            </div>
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {matchedSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[10px]">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">No skills matched directly</p>
            )}
          </div>

          {missingSkills.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-1 text-rose-400 font-semibold mb-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Missing Requirements ({missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300 text-[10px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillMatchBadge;
