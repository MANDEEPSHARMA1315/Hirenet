/**
 * Calculates skill match percentage and details between candidate skills and job requirements.
 * @param {Array<string>} candidateSkills 
 * @param {Array<string>} requiredSkills 
 * @returns {Object} { matchPercentage: number, matchedSkills: Array<string>, missingSkills: Array<string> }
 */
const calculateSkillMatch = (candidateSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: candidateSkills,
      missingSkills: []
    };
  }

  const normCandidate = candidateSkills.map(s => s.trim().toLowerCase());
  const normRequired = requiredSkills.map(s => s.trim().toLowerCase());

  const matchedSkills = [];
  const missingSkills = [];

  normRequired.forEach(reqSkill => {
    if (normCandidate.includes(reqSkill)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / normRequired.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills
  };
};

module.exports = { calculateSkillMatch };
