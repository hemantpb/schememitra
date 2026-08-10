import { Sector, EnterpriseSize, Registration, Objective, UserProfile } from '@/types/scheme';

export const INDIAN_STATES = [
  'Maharashtra',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu & Kashmir',
  'Ladakh'
];

export const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Beed',
  'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur',
  'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani',
  'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane',
  'Wardha', 'Washim', 'Yavatmal'
];

export const SECTORS_LIST: { id: Sector; label: string; description: string; icon: string }[] = [
  {
    id: 'food_processing',
    label: 'Food Processing',
    description: 'Agro-processing, grain milling, cold storage, dairy, packaged foods',
    icon: 'Utensils'
  },
  {
    id: 'textile',
    label: 'Textile & Apparel',
    description: 'Weaving, garmenting, spinning, technical textiles, handloom',
    icon: 'Shirt'
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    description: 'Auto components, engineering, plastics, electronics, chemicals',
    icon: 'Factory'
  },
  {
    id: 'general_msme',
    label: 'General MSME / Services',
    description: 'Trading, IT services, logistics, repair, general enterprise',
    icon: 'Building2'
  },
  {
    id: 'other',
    label: 'Other Sector',
    description: 'Other specialized or emerging business sectors',
    icon: 'MoreHorizontal'
  }
];

export const OBJECTIVES_LIST: { id: Objective; label: string; description: string }[] = [
  { id: 'funding', label: 'Funding & Working Capital', description: 'Collateral-free loans, credit guarantees, margin money' },
  { id: 'machinery', label: 'Machinery / Technology Upgrade', description: 'Capital investment subsidy for new machinery' },
  { id: 'expansion', label: 'Business Expansion', description: 'Scaling operations, setting up new units, building capacity' },
  { id: 'export', label: 'Export Promotion', description: 'Market access, international trade fair participation' },
  { id: 'marketing', label: 'Marketing & Branding', description: 'Exhibition stalls, branding support, market linkages' },
  { id: 'infrastructure', label: 'Infrastructure & Industrial Land', description: 'Cluster common facility centers, land concessions' },
  { id: 'skill_development', label: 'Skill Development & Training', description: 'Employee training EDPs, quality certification' },
  { id: 'energy_efficiency', label: 'Energy Efficiency & Sustainability', description: 'ZED certification, green technology adoption' }
];

export const REGISTRATIONS_LIST: { id: Registration; label: string; description: string }[] = [
  { id: 'udyam', label: 'Udyam Registration', description: 'Govt MSME Registration Number' },
  { id: 'gst', label: 'GST Registration', description: 'Goods & Services Tax Identification' },
  { id: 'fssai', label: 'FSSAI License / Registration', description: 'Food Safety and Standards Authority' },
  { id: 'iec', label: 'Import Export Code (IEC)', description: 'Directorate General of Foreign Trade' },
  { id: 'other', label: 'Other Registrations', description: 'Trade License, Shop & Est, Factory License' }
];
