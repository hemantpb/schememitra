import { describe, it, expect } from 'vitest';
import { parseNaturalLanguageQuery } from '@/lib/aiParser';
import { LocalDataService } from '@/lib/dataService';
import seedData from '@/data/schemes.json';
import { Scheme } from '@/types/scheme';

describe('SchemeMitra Phase 9 & 10 AI Parser & Data Service Tests', () => {
  it('should parse natural language query into structured json profile', () => {
    const input = 'I run a small food processing business in Nagpur and need ₹20 lakh for machinery.';
    const parsed = parseNaturalLanguageQuery(input);

    expect(parsed.sector).toBe('food_processing');
    expect(parsed.state).toBe('Maharashtra');
    expect(parsed.city).toBe('Nagpur');
    expect(parsed.objective).toBe('machinery');
    expect(parsed.investment).toBe(2000000);
  });

  it('should fetch schemes via DatabaseAdapter local service', async () => {
    const service = new LocalDataService(seedData as Scheme[]);
    const schemes = await service.getSchemes();
    expect(schemes.length).toBeGreaterThan(0);

    const pmfme = await service.getSchemeById('pmfme');
    expect(pmfme).not.toBeNull();
    expect(pmfme?.name).toContain('Formalisation of Micro Food Processing');
  });
});
