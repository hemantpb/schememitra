import { Sector, EnterpriseSize, Objective } from '@/types/scheme';

export interface StructuredAiProfile {
  sector: Sector;
  state: string;
  city?: string;
  enterprise_size: EnterpriseSize;
  objective: Objective;
  investment?: number;
}

export function parseNaturalLanguageQuery(query: string): Partial<StructuredAiProfile> {
  const normalized = query.toLowerCase();
  const result: Partial<StructuredAiProfile> = {};

  // Sector parsing
  if (normalized.includes('food') || normalized.includes('grain') || normalized.includes('processing') || normalized.includes('bakery')) {
    result.sector = 'food_processing';
  } else if (normalized.includes('textile') || normalized.includes('garment') || normalized.includes('cloth') || normalized.includes('weaving')) {
    result.sector = 'textile';
  } else if (normalized.includes('manufacturing') || normalized.includes('factory') || normalized.includes('auto') || normalized.includes('metal')) {
    result.sector = 'manufacturing';
  } else {
    result.sector = 'general_msme';
  }

  // Location parsing
  if (normalized.includes('maharashtra') || normalized.includes('nagpur') || normalized.includes('pune') || normalized.includes('mumbai') || normalized.includes('nashik')) {
    result.state = 'Maharashtra';
    if (normalized.includes('nagpur')) result.city = 'Nagpur';
    if (normalized.includes('pune')) result.city = 'Pune';
    if (normalized.includes('mumbai')) result.city = 'Mumbai';
  } else if (normalized.includes('gujarat') || normalized.includes('surat') || normalized.includes('ahmedabad')) {
    result.state = 'Gujarat';
  }

  // Enterprise size parsing
  if (normalized.includes('micro') || normalized.includes('small business') || normalized.includes('lakh')) {
    result.enterprise_size = 'micro';
  } else if (normalized.includes('small enterprise') || normalized.includes('medium')) {
    result.enterprise_size = 'small';
  }

  // Objective parsing
  if (normalized.includes('machinery') || normalized.includes('equipment') || normalized.includes('plant')) {
    result.objective = 'machinery';
  } else if (normalized.includes('export') || normalized.includes('international')) {
    result.objective = 'export';
  } else if (normalized.includes('loan') || normalized.includes('funding') || normalized.includes('capital')) {
    result.objective = 'funding';
  }

  // Investment parsing (regex for numbers)
  const numMatch = normalized.match(/(\d+)\s*(lakh|crore|cr|l)/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    const unit = numMatch[2];
    if (unit.startsWith('l')) {
      result.investment = val * 100000;
    } else if (unit.startsWith('c')) {
      result.investment = val * 10000000;
    }
  }

  return result;
}
