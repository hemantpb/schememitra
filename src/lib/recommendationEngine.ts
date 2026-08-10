import { Scheme, UserProfile, Recommendation } from '@/types/scheme';
import schemesData from '@/data/schemes.json';

const ALL_SCHEMES: Scheme[] = schemesData as Scheme[];

export function getRawSchemes(): Scheme[] {
  return ALL_SCHEMES;
}

export function calculateRecommendation(profile: UserProfile, scheme: Scheme): Recommendation {
  let score = 0;
  const matchedCriteria: string[] = [];
  const unmatchedCriteria: string[] = [];
  const warnings: string[] = [];
  const reasons: string[] = [];

  // 1. Sector Match (Max 30 points)
  if (profile.sector) {
    if (scheme.sectors.includes(profile.sector) || scheme.sectors.includes('general_msme')) {
      score += 30;
      matchedCriteria.push(`Sector: Matches ${profile.sector.replace('_', ' ').toUpperCase()} sector eligibility`);
      reasons.push(`Relevant for your business sector (${profile.sector.replace('_', ' ')})`);
    } else {
      unmatchedCriteria.push(`Sector: Scheme specifically targets [${scheme.sectors.join(', ')}]`);
    }
  } else {
    // default baseline if unselected
    score += 15;
  }

  // 2. State / Location Match (Max 20 points)
  if (profile.state) {
    if (scheme.states.includes('All') || scheme.states.includes(profile.state)) {
      score += 20;
      matchedCriteria.push(`Location: Available in ${profile.state}`);
      reasons.push(`Active for businesses located in ${profile.state}`);
    } else {
      unmatchedCriteria.push(`Location: Exclusively available in ${scheme.states.join(', ')}`);
      warnings.push(`This scheme is restricted to ${scheme.states.join(', ')}`);
    }
  } else {
    score += 10;
  }

  // 3. Enterprise Size Match (Max 20 points)
  if (profile.enterpriseSize) {
    if (scheme.enterpriseSizes.includes(profile.enterpriseSize)) {
      score += 20;
      matchedCriteria.push(`Enterprise Size: Eligible for ${profile.enterpriseSize} enterprises`);
      reasons.push(`Designed for ${profile.enterpriseSize}-sized enterprises`);
    } else {
      unmatchedCriteria.push(`Enterprise Size: Scheme is for [${scheme.enterpriseSizes.join(', ')}] units`);
      warnings.push(`Unit size requirement (${scheme.enterpriseSizes.join('/')}) should be verified`);
    }
  } else {
    score += 10;
  }

  // 4. Objective Match (Max 20 points)
  if (profile.objectives && profile.objectives.length > 0) {
    const matchedObjs = profile.objectives.filter(obj => scheme.objectives.includes(obj));
    if (matchedObjs.length > 0) {
      const objPoints = Math.min(20, Math.round((matchedObjs.length / profile.objectives.length) * 20));
      score += objPoints;
      matchedCriteria.push(`Objective: Matches your need for ${matchedObjs.join(', ')}`);
      reasons.push(`Supports your core goals (${matchedObjs.join(', ')})`);
    } else {
      unmatchedCriteria.push(`Objective: Scheme focuses on ${scheme.objectives.join(', ')}`);
    }
  } else {
    score += 10;
  }

  // 5. Registration Match (Max 10 points)
  if (scheme.requiredRegistrations && scheme.requiredRegistrations.length > 0) {
    if (profile.registrations && profile.registrations.length > 0) {
      const missingRegs = scheme.requiredRegistrations.filter(r => !profile.registrations?.includes(r));
      if (missingRegs.length === 0) {
        score += 10;
        matchedCriteria.push(`Registrations: You possess all required registrations (${scheme.requiredRegistrations.join(', ').toUpperCase()})`);
      } else {
        const hasSome = scheme.requiredRegistrations.some(r => profile.registrations?.includes(r));
        score += hasSome ? 5 : 0;
        warnings.push(`Missing mandatory registration: ${missingRegs.join(', ').toUpperCase()}`);
      }
    } else {
      warnings.push(`Requires registration: ${scheme.requiredRegistrations.join(', ').toUpperCase()}`);
    }
  } else {
    score += 10; // No strict registrations required
  }

  return {
    scheme,
    matchScore: Math.min(100, score),
    matchedCriteria,
    unmatchedCriteria,
    warnings,
    reasons
  };
}

export function getRecommendations(profile: UserProfile): Recommendation[] {
  return ALL_SCHEMES
    .map(scheme => calculateRecommendation(profile, scheme))
    .sort((a, b) => b.matchScore - a.matchScore);
}
