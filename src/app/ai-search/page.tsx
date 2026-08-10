'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { parseNaturalLanguageQuery } from '@/lib/aiParser';
import { Sparkles, ArrowRight, Bot, Lightbulb, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AiSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any | null>(null);

  const sampleQueries = [
    'I run a small food processing business in Nagpur and need ₹20 lakh for machinery.',
    'Micro textile manufacturing unit in Kolhapur looking for export grant and interest subsidy.',
    'Small manufacturing enterprise in Pune seeking collateral-free loan for business expansion.'
  ];

  const handleSampleClick = (sample: string) => {
    setQuery(sample);
    const parsed = parseNaturalLanguageQuery(sample);
    setParsedPreview(parsed);
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (text.length > 5) {
      setParsedPreview(parseNaturalLanguageQuery(text));
    } else {
      setParsedPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    const parsed = parseNaturalLanguageQuery(query);

    const profile = {
      sector: parsed.sector || 'food_processing',
      state: parsed.state || 'Maharashtra',
      district: parsed.city || 'Nagpur',
      enterpriseSize: parsed.enterprise_size || 'micro',
      objectives: [parsed.objective || 'machinery', 'funding'],
      registrations: ['udyam']
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('schememitra_user_profile', JSON.stringify(profile));
    }

    setTimeout(() => {
      router.push(`/recommendations?sector=${profile.sector}&state=${profile.state}&size=${profile.enterpriseSize}`);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-4 border border-sky-200">
            <Bot className="w-4 h-4 text-sky-600" />
            <span>AI Natural Language Search Layer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Describe Your Business Need
          </h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Type in plain English or Marathi/Hindi transliterated context. Our AI layer extracts your structured business profile and routes it through our transparent recommendation engine.
          </p>
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Tell us about your business & goals:
            </label>
            <textarea
              rows={4}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="e.g. I run a small food processing business in Nagpur and need ₹20 lakh for machinery..."
              className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none leading-relaxed"
            />
          </div>

          {/* Parsed JSON Preview */}
          {parsedPreview && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-sky-800 mb-2 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Extracted Structured Profile Payload:</span>
              </div>
              <pre className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto font-mono">
                {JSON.stringify(parsedPreview, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
              <span>Eligibility evaluated by deterministic rules engine</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !query.trim()}
              className="px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center shadow-md transition-colors disabled:opacity-50"
            >
              <span>{isProcessing ? 'Extracting & Matching...' : 'Find Matching Schemes'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>

        {/* Sample queries */}
        <div className="bg-slate-100/70 rounded-2xl border border-slate-200 p-6">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 text-amber-500 mr-1.5" />
            <span>Try sample prompts:</span>
          </h3>

          <div className="space-y-2">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-sky-500 hover:text-sky-900 transition-colors"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
