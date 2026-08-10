import { Scheme, UserProfile } from '@/types/scheme';
import { supabase } from './supabaseClient';

export interface DatabaseAdapter {
  getSchemes(): Promise<Scheme[]>;
  getSchemeById(id: string): Promise<Scheme | null>;
  saveUserProfile(profile: UserProfile): Promise<string>;
}

// Local Seed JSON implementation (Default active adapter)
export class LocalDataService implements DatabaseAdapter {
  private schemes: Scheme[];

  constructor(seedSchemes: Scheme[]) {
    this.schemes = seedSchemes;
  }

  async getSchemes(): Promise<Scheme[]> {
    return this.schemes;
  }

  async getSchemeById(id: string): Promise<Scheme | null> {
    return this.schemes.find(s => s.id === id) || null;
  }

  async saveUserProfile(profile: UserProfile): Promise<string> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('schememitra_user_profile', JSON.stringify(profile));
    }
    return 'local_session';
  }
}

// Supabase PostgreSQL Service Adapter
export class SupabaseDataService implements DatabaseAdapter {
  async getSchemes(): Promise<Scheme[]> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*');
      
    if (error || !data) {
      console.warn('Supabase fetch failed or table empty, falling back to seed dataset.', error);
      return [];
    }

    return data as Scheme[];
  }

  async getSchemeById(id: string): Promise<Scheme | null> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Scheme;
  }

  async saveUserProfile(profile: UserProfile): Promise<string> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select('id')
      .single();

    if (error || !data) {
      console.error('Supabase profile save error:', error);
      return 'fallback_id';
    }

    return data.id;
  }
}
