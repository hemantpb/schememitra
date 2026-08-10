'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getRawSchemes } from '@/lib/recommendationEngine';
import { Scheme } from '@/types/scheme';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  ListChecks, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function SavedAndComparePage() {
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('schememitra_saved_schemes');
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored);
          const raw = getRawSchemes();
          const matched = raw.filter(s => ids.includes(s.id));
          setSavedSchemes(matched);
          setSelectedForCompare(matched.slice(0, 3).map(s => s.id));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleRemoveSaved = (schemeId: string) => {
    const updated = savedSchemes.filter(s => s.id !== schemeId);
    setSavedSchemes(updated);
    setSelectedForCompare(prev => prev.filter(id => id !== schemeId));
    if (typeof window !== 'undefined') {
      localStorage.setItem('schememitra_saved_schemes', JSON.stringify(updated.map(s => s.id)));
    }
  };

  const toggleSelectCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 3) {
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };

  const comparedSchemes = savedSchemes.filter(s => selectedForCompare.includes(s.id));

  // Build aggregated action plan
  const actionPlanSteps = [
    { title: 'Step 1: Obtain / Verify Udyam Registration', desc: 'Ensure active Udyam portal registration for your enterprise size & sector.' },
    { title: 'Step 2: Compile Core Financial Statements', desc: 'Collect PAN, GST returns (if applicable), ITRs for previous 2 years, and bank statement.' },
    { title: 'Step 3: Draft Detailed Project Report (DPR)', desc: 'Prepare project cost breakdown, machinery specifications, and projected cash flows.' },
    { title: 'Step 4: Request Machinery Quotations', desc: 'Obtain formal quotations from registered suppliers/OEMs for machinery subsidies.' },
    { title: 'Step 5: Apply via Official Ministry Portals', desc: 'Submit completed documents directly on verified government application URLs.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Saved Schemes & Custom Action Plan
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Compare saved government schemes side-by-side and follow your step-by-step application roadmap.
          </p>
        </div>

        {savedSchemes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No Saved Schemes Yet</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Explore recommendations and click "Save Scheme" to bookmark programs for side-by-side comparison and action planning.
            </p>
            <Link
              href="/recommendations"
              className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Explore Recommendations</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Section 1: Saved Schemes List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Your Saved Schemes ({savedSchemes.length})
                </h2>
                <span className="text-xs text-slate-500">
                  Select up to 3 to compare in table below
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savedSchemes.map(s => {
                  const isCompared = selectedForCompare.includes(s.id);
                  return (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                            {s.ministry}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSaved(s.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-2">{s.name} ({s.shortName})</h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{s.benefitSummary}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <label className="inline-flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => toggleSelectCompare(s.id)}
                            className="rounded text-sky-600 focus:ring-sky-500 mr-2"
                          />
                          <span>Compare</span>
                        </label>

                        <Link href={`/scheme/${s.id}`} className="text-xs font-bold text-sky-700 hover:text-sky-800">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Side-by-Side Comparison Table */}
            {comparedSchemes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <ListChecks className="w-5 h-5 text-sky-600 mr-2" />
                  <span>Scheme Comparison Table ({comparedSchemes.length})</span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="p-3 font-semibold text-slate-600 w-40">Attribute</th>
                        {comparedSchemes.map(s => (
                          <th key={s.id} className="p-3 font-bold text-slate-900 min-w-[220px]">
                            {s.shortName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">Benefit Summary</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3 font-medium text-sky-900">{s.benefitSummary}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">Scheme Type</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3 capitalize">{s.schemeType}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">Sectors</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3">{s.sectors.join(', ')}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">Enterprise Size</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3 uppercase">{s.enterpriseSizes.join(', ')}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">State Availability</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3">{s.states.join(', ')}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">Required Registrations</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3 uppercase">{s.requiredRegistrations?.join(', ') || 'None'}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold bg-slate-50/50 text-slate-600">Official Link</td>
                        {comparedSchemes.map(s => (
                          <td key={s.id} className="p-3">
                            <a
                              href={s.applicationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-700 font-bold hover:underline inline-flex items-center"
                            >
                              <span>Apply Portal</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 3: Generated Scheme Action Plan */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Roadmap</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Your Scheme Action Plan</h2>
              <p className="text-slate-300 text-xs sm:text-sm mb-6">
                Step-by-step execution roadmap derived from your saved government schemes.
              </p>

              <div className="space-y-4">
                {actionPlanSteps.map((step, idx) => (
                  <div key={idx} className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex items-start space-x-4">
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
