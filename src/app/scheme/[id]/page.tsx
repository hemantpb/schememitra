'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getRawSchemes, calculateRecommendation } from '@/lib/recommendationEngine';
import { Scheme, UserProfile, Recommendation } from '@/types/scheme';
import { 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Layers, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  ShieldCheck,
  Calendar,
  Check
} from 'lucide-react';

export default function SchemeDetailPage() {
  const params = useParams();
  const schemeId = params.id as string;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const raw = getRawSchemes();
    const found = raw.find(s => s.id === schemeId);
    if (found) {
      setScheme(found);

      // retrieve stored profile or baseline
      let profile: UserProfile = {
        sector: 'food_processing',
        state: 'Maharashtra',
        enterpriseSize: 'micro',
        objectives: ['funding', 'machinery'],
        registrations: ['udyam']
      };

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('schememitra_user_profile');
        if (stored) {
          try { profile = JSON.parse(stored); } catch (e) { console.error(e); }
        }

        const saved = localStorage.getItem('schememitra_saved_schemes');
        if (saved) {
          try {
            const arr = JSON.parse(saved);
            setIsSaved(arr.includes(found.id));
          } catch (e) { console.error(e); }
        }
      }

      const rec = calculateRecommendation(profile, found);
      setRecommendation(rec);
    }
  }, [schemeId]);

  const toggleSave = () => {
    if (!scheme) return;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('schememitra_saved_schemes');
      let arr: string[] = saved ? JSON.parse(saved) : [];
      if (arr.includes(scheme.id)) {
        arr = arr.filter(id => id !== scheme.id);
        setIsSaved(false);
      } else {
        arr.push(scheme.id);
        setIsSaved(true);
      }
      localStorage.setItem('schememitra_saved_schemes', JSON.stringify(arr));
    }
  };

  if (!scheme || !recommendation) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800">Scheme not found</h2>
            <p className="text-xs text-slate-500 mt-1">The requested scheme ID does not exist in seed dataset.</p>
            <Link href="/explore" className="mt-4 inline-block px-4 py-2 bg-sky-700 text-white text-xs font-semibold rounded-lg">
              Explore All Schemes
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Top back nav & CTA */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/recommendations"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Recommendations</span>
          </Link>

          <button
            type="button"
            onClick={toggleSave}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center transition-colors ${
              isSaved
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 mr-1.5 text-sky-600" />
                <span>Saved to My Schemes</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-1.5 text-slate-500" />
                <span>Save Scheme</span>
              </>
            )}
          </button>
        </div>

        {/* Scheme Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-sky-100 text-sky-800 uppercase tracking-wider">
                  {scheme.ministry}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize">
                  {scheme.schemeType}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  {scheme.verificationStatus === 'verified' ? 'Verified Government Source' : 'Demo Data'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {scheme.name}
              </h1>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {scheme.description}
              </p>
            </div>

            {/* Match Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center shrink-0 min-w-[200px]">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Match Score</div>
              <div className="text-4xl font-extrabold text-sky-700 mb-1">
                {recommendation.matchScore}%
              </div>
              <span className="text-[11px] font-medium text-slate-500 block">
                Based on active profile
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & Benefits */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Layers className="w-5 h-5 text-sky-600 mr-2" />
                <span>Benefits & Scheme Summary</span>
              </h2>

              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 mb-6">
                <h3 className="text-sm font-bold text-sky-900">Key Benefit Highlight</h3>
                <p className="text-sm text-sky-800 mt-1 font-semibold">{scheme.benefitSummary}</p>
                {scheme.benefitAmount && (
                  <p className="text-xs text-sky-700 mt-2 font-normal">
                    <strong>Grant/Subsidy Ceiling:</strong> {scheme.benefitAmount}
                  </p>
                )}
              </div>

              {scheme.beneficiary && (
                <div className="mb-4 text-xs text-slate-700">
                  <strong className="text-slate-900">Target Beneficiaries:</strong> {scheme.beneficiary}
                </div>
              )}
            </section>

            {/* Who Can Apply */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Who Can Apply? (Eligibility Criteria)</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-1">Eligible Sectors</span>
                  <span>{scheme.sectors.map(s => s.replace('_', ' ').toUpperCase()).join(', ')}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-1">Enterprise Scales</span>
                  <span>{scheme.enterpriseSizes.map(s => s.toUpperCase()).join(', ')}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-1">Geographic Coverage</span>
                  <span>{scheme.states.join(', ')}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-900 block mb-1">Required Registrations</span>
                  <span>{scheme.requiredRegistrations?.map(r => r.toUpperCase()).join(', ') || 'None specified'}</span>
                </div>
              </div>
            </section>

            {/* Required Documents */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-sky-600 mr-2" />
                <span>Required Documents</span>
              </h2>

              <ul className="space-y-2.5">
                {scheme.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Application Process */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Application Process Steps</h2>

              <ol className="space-y-4">
                {scheme.applicationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mr-3 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Match explanation card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Your Profile Breakdown</h3>

              <div className="space-y-3 text-xs">
                {recommendation.matchedCriteria.map((match, i) => (
                  <div key={i} className="flex items-start text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                    <span>{match}</span>
                  </div>
                ))}

                {recommendation.unmatchedCriteria.map((unmatch, i) => (
                  <div key={i} className="flex items-start text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                    <span>{unmatch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Source & CTA */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">Official Verification</h3>

              <div className="space-y-2 text-xs text-slate-300 mb-6">
                <div>
                  <span className="text-slate-400">Ministry:</span> {scheme.ministry}
                </div>
                {scheme.department && (
                  <div>
                    <span className="text-slate-400">Department:</span> {scheme.department}
                  </div>
                )}
                <div className="flex items-center text-slate-400 pt-2 border-t border-slate-800">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  <span>Last Verified: {scheme.lastVerifiedAt}</span>
                </div>
              </div>

              <a
                href={scheme.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center shadow-md transition-colors mb-3"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>

              {scheme.guidelineUrl && (
                <a
                  href={scheme.guidelineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center transition-colors"
                >
                  <span>Official Guidelines PDF ↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
