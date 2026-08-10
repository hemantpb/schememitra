'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getRawSchemes, calculateRecommendation } from '@/lib/recommendationEngine';
import { Recommendation, UserProfile, Sector, EnterpriseSize, Objective } from '@/types/scheme';
import { 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  SlidersHorizontal,
  Building2,
  ChevronDown
} from 'lucide-react';

function RecommendationsContent() {
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<UserProfile>({
    sector: 'food_processing',
    state: 'Maharashtra',
    enterpriseSize: 'micro',
    objectives: ['funding', 'machinery'],
    registrations: ['udyam']
  });

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('schememitra_user_profile');
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }

      const storedSaved = localStorage.getItem('schememitra_saved_schemes');
      if (storedSaved) {
        try {
          setSavedIds(JSON.parse(storedSaved));
        } catch (e) {
          console.error(e);
        }
      }
    }

    const sParam = searchParams.get('sector') as Sector | null;
    const stParam = searchParams.get('state');
    const szParam = searchParams.get('size') as EnterpriseSize | null;

    if (sParam || stParam || szParam) {
      setProfile(prev => ({
        ...prev,
        sector: sParam || prev.sector,
        state: stParam || prev.state,
        enterpriseSize: szParam || prev.enterpriseSize
      }));
    }
  }, [searchParams]);

  const toggleSaveScheme = (schemeId: string) => {
    setSavedIds(prev => {
      const updated = prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('schememitra_saved_schemes', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const rawSchemes = useMemo(() => getRawSchemes(), []);

  const allRecommendations: Recommendation[] = useMemo(() => {
    return rawSchemes
      .map(scheme => calculateRecommendation(profile, scheme))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [rawSchemes, profile]);

  const filteredRecommendations = useMemo(() => {
    return allRecommendations.filter(item => {
      if (item.matchScore < minMatchFilter) return false;
      if (selectedSectorFilter !== 'all' && !item.scheme.sectors.includes(selectedSectorFilter as Sector) && !item.scheme.sectors.includes('general_msme')) {
        return false;
      }
      if (selectedTypeFilter !== 'all' && item.scheme.schemeType !== selectedTypeFilter) {
        return false;
      }
      return true;
    });
  }, [allRecommendations, minMatchFilter, selectedSectorFilter, selectedTypeFilter]);

  const highMatches = filteredRecommendations.filter(r => r.matchScore >= 60);
  const lowerMatches = filteredRecommendations.filter(r => r.matchScore < 60);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Banner header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deterministic Rule-based Analysis</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Your Recommended Schemes</h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Based on profile: <span className="font-semibold text-white capitalize">{profile.sector?.replace('_', ' ')}</span> sector in <span className="font-semibold text-white">{profile.state}</span> ({profile.enterpriseSize} enterprise).
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/wizard"
                className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Edit Business Profile</span>
              </Link>

              {savedIds.length > 0 && (
                <Link
                  href="/saved"
                  className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1" />
                  <span>View Saved Schemes ({savedIds.length})</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Filter Matches:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div>
              <label className="text-slate-500 mr-2">Min Score:</label>
              <select
                value={minMatchFilter}
                onChange={(e) => setMinMatchFilter(Number(e.target.value))}
                className="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
              >
                <option value={0}>All Matches (0%+)</option>
                <option value={50}>50%+ Score</option>
                <option value={70}>70%+ High Match</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 mr-2">Sector:</label>
              <select
                value={selectedSectorFilter}
                onChange={(e) => setSelectedSectorFilter(e.target.value)}
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
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium"
              >
                <option value="all">All Types</option>
                <option value="subsidy">Subsidy</option>
                <option value="loan">Loan</option>
                <option value="grant">Grant</option>
                <option value="incentive">Incentive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 1: High Matches */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <span>Top Matching Schemes</span>
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {highMatches.length} Matches
            </span>
          </h2>

          {highMatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-6">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No high matches found</h3>
              <p className="text-xs text-slate-600 mt-1">Try lowering the filter threshold or updating your business profile objectives.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highMatches.map((item) => {
                const isSaved = savedIds.includes(item.scheme.id);
                return (
                  <div key={item.scheme.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative">
                    <div>
                      {/* Top metadata */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase bg-slate-100 text-slate-700 mb-2">
                            {item.scheme.ministry}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {item.scheme.name} ({item.scheme.shortName})
                          </h3>
                        </div>

                        {/* Match Badge */}
                        <div className="shrink-0 text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-extrabold ${
                            item.matchScore >= 80 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}>
                            {item.matchScore}% Match
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {item.scheme.description}
                      </p>

                      {/* Benefit tag */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs font-semibold text-slate-800">
                        <span className="text-slate-500 font-normal">Benefit: </span>
                        {item.scheme.benefitSummary}
                      </div>

                      {/* Why it matches */}
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Why this matches:</h4>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {item.reasons.slice(0, 3).map((reason, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.warnings.length > 0 && (
                        <div className="mb-4 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200/70 flex items-start space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{item.warnings[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSaveScheme(item.scheme.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center transition-colors ${
                          isSaved 
                            ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            <span>Save Scheme</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/scheme/${item.scheme.id}`}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white flex items-center transition-colors"
                      >
                        <span>View Scheme Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: "Why Not This Scheme?" Lower score matches */}
        {lowerMatches.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <span>Other Schemes ("Why Not This Scheme?")</span>
                <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                  {lowerMatches.length} Schemes
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                These schemes have lower match scores based on your current profile criteria. Unmatched factors are explicitly listed below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lowerMatches.map((item) => {
                const isSaved = savedIds.includes(item.scheme.id);
                return (
                  <div key={item.scheme.id} className="bg-slate-100/70 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase bg-slate-200 text-slate-600 mb-2">
                            {item.scheme.ministry}
                          </span>
                          <h3 className="text-base font-bold text-slate-800">
                            {item.scheme.name} ({item.scheme.shortName})
                          </h3>
                        </div>

                        <div className="shrink-0 px-3 py-1 rounded-xl text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                          {item.matchScore}% Match
                        </div>
                      </div>

                      {/* Unmatched reasons */}
                      <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Why match score is lower:</h4>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {item.unmatchedCriteria.map((unm, i) => (
                            <li key={i} className="flex items-start">
                              <XCircle className="w-3.5 h-3.5 text-rose-500 mr-1.5 shrink-0 mt-0.5" />
                              <span>{unm}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleSaveScheme(item.scheme.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700"
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </button>

                      <Link
                        href={`/scheme/${item.scheme.id}`}
                        className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center"
                      >
                        <span>Check Details</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">Calculating Recommendations...</p>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}
