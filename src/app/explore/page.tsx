'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getRawSchemes } from '@/lib/recommendationEngine';
import { Scheme, Sector, SchemeType } from '@/types/scheme';
import { Search, Filter, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const allSchemes = useMemo(() => getRawSchemes(), []);

  const filteredSchemes = useMemo(() => {
    return allSchemes.filter(scheme => {
      // Search filter
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesName = scheme.name.toLowerCase().includes(term);
        const matchesShortName = scheme.shortName.toLowerCase().includes(term);
        const matchesDesc = scheme.description.toLowerCase().includes(term);
        const matchesMinistry = scheme.ministry.toLowerCase().includes(term);
        const matchesObjectives = scheme.objectives.some(o => o.toLowerCase().includes(term));
        if (!matchesName && !matchesShortName && !matchesDesc && !matchesMinistry && !matchesObjectives) {
          return false;
        }
      }

      // Sector filter
      if (selectedSector !== 'all' && !scheme.sectors.includes(selectedSector as Sector) && !scheme.sectors.includes('general_msme')) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && scheme.schemeType !== selectedType) {
        return false;
      }

      return true;
    });
  }, [allSchemes, searchTerm, selectedSector, selectedType]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Government Schemes
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Search across verified central and state schemes for Indian MSMEs & entrepreneurs.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 mb-8 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme by name, machinery, grant, ministry, or objective (e.g. machinery, PMFME, subsidy)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Filters:</span>
            </div>

            <div>
              <label className="text-slate-500 mr-2">Sector:</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
              >
                <option value="all">All Sectors</option>
                <option value="food_processing">Food Processing</option>
                <option value="textile">Textile & Apparel</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="general_msme">General MSME</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 mr-2">Scheme Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
              >
                <option value="all">All Types</option>
                <option value="subsidy">Subsidy</option>
                <option value="loan">Loan</option>
                <option value="grant">Grant</option>
                <option value="incentive">Incentive</option>
              </select>
            </div>

            <div className="ml-auto text-slate-500 font-semibold">
              Showing {filteredSchemes.length} of {allSchemes.length} schemes
            </div>
          </div>
        </div>

        {/* Results grid */}
        {filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No schemes found matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or setting filters to 'All'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map(scheme => (
              <div key={scheme.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 uppercase">
                      {scheme.ministry}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 capitalize">
                      {scheme.schemeType}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {scheme.name} ({scheme.shortName})
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                    <span className="text-slate-500 font-normal">Benefit: </span>
                    {scheme.benefitSummary}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                    Official Portal
                  </span>

                  <Link
                    href={`/scheme/${scheme.id}`}
                    className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center"
                  >
                    <span>View Scheme</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
