import { describe, it, expect } from 'vitest';
import { getRawSchemes, calculateRecommendation, getRecommendations } from '@/lib/recommendationEngine';
import { UserProfile } from '@/types/scheme';

describe('SchemeMitra Recommendation Engine Integration Tests', () => {
  it('should load seed schemes data correctly', () => {
    const raw = getRawSchemes();
    expect(raw.length).toBeGreaterThanOrEqual(10);
    expect(raw.find(s => s.id === 'pmfme')).toBeDefined();
  });

  it('should compute a high match score (>80%) for PMFME with food processing micro unit in Maharashtra', () => {
    const profile: UserProfile = {
      sector: 'food_processing',
      state: 'Maharashtra',
      district: 'Nagpur',
      enterpriseSize: 'micro',
      objectives: ['funding', 'machinery', 'expansion'],
      registrations: ['udyam', 'fssai']
    };

    const recommendations = getRecommendations(profile);
    const pmfmeMatch = recommendations.find(r => r.scheme.id === 'pmfme');

    expect(pmfmeMatch).toBeDefined();
    expect(pmfmeMatch?.matchScore).toBeGreaterThanOrEqual(80);
    expect(pmfmeMatch?.reasons.length).toBeGreaterThan(0);
    expect(pmfmeMatch?.matchedCriteria.length).toBeGreaterThan(0);
  });

  it('should lower score for sector mismatch and add unmatched warnings', () => {
    const profile: UserProfile = {
      sector: 'textile',
      state: 'Goa',
      enterpriseSize: 'medium',
      objectives: ['export'],
      registrations: []
    };

    const recommendations = getRecommendations(profile);
    const pmfmeMatch = recommendations.find(r => r.scheme.id === 'pmfme');

    expect(pmfmeMatch).toBeDefined();
    expect(pmfmeMatch?.matchScore).toBeLessThan(60);
    expect(pmfmeMatch?.unmatchedCriteria.length).toBeGreaterThan(0);
  });
});
