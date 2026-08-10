'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getRawSchemes } from '@/lib/recommendationEngine';
import { Scheme } from '@/types/scheme';
import { 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Edit, 
  Plus, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  BarChart2
} from 'lucide-react';

export default function AdminPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [activeTab, setActiveTab] = useState<'schemes' | 'analytics' | 'verification'>('schemes');

  useEffect(() => {
    setSchemes(getRawSchemes());
  }, []);

  const verifiedCount = schemes.filter(s => s.verificationStatus === 'verified').length;
  const needsVerifCount = schemes.filter(s => s.verificationStatus === 'needs_verification').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold mb-2">
              <span>Admin Management Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              SchemeMitra Admin Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage government scheme data, verification lifecycle, and track product metrics.</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => alert('New Scheme creation modal in production Supabase layer.')}
              className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add New Scheme</span>
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center space-x-4 border-b border-slate-200 mb-8 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className={`pb-3 transition-colors ${activeTab === 'schemes' ? 'text-sky-700 border-b-2 border-sky-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Schemes ({schemes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`pb-3 transition-colors ${activeTab === 'verification' ? 'text-sky-700 border-b-2 border-sky-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Verification Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 transition-colors ${activeTab === 'analytics' ? 'text-sky-700 border-b-2 border-sky-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Product Analytics
          </button>
        </div>

        {/* Tab 1: Schemes Management */}
        {activeTab === 'schemes' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-4">Scheme Name</th>
                    <th className="p-4">Ministry</th>
                    <th className="p-4">Sectors</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Last Verified</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {schemes.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="p-4 font-bold text-slate-900">
                        {s.name} ({s.shortName})
                      </td>
                      <td className="p-4">{s.ministry}</td>
                      <td className="p-4">{s.sectors.join(', ')}</td>
                      <td className="p-4">
                        {s.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Needs Verification
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">{s.lastVerifiedAt}</td>
                      <td className="p-4 text-right">
                        <a
                          href={s.officialSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-700 font-semibold hover:underline inline-flex items-center mr-3"
                        >
                          <span>Source</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Verification Status */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Seed Schemes</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{schemes.length}</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <span className="text-xs font-semibold text-emerald-600 uppercase">🟢 Officially Verified</span>
                <div className="text-3xl font-extrabold text-emerald-700 mt-1">{verifiedCount}</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <span className="text-xs font-semibold text-amber-600 uppercase">🟡 Needs Periodic Audit</span>
                <div className="text-3xl font-extrabold text-amber-700 mt-1">{needsVerifCount}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-3">Verification Rule Guidelines</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All schemes must specify an official government portal URL, ministry name, and last verified timestamp. If official guidelines are modified or expired, update the verification status to 🟡 Needs Verification or 🔴 Expired.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Analytics */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3 text-sky-700 mb-2">
              <BarChart2 className="w-6 h-6" />
              <h2 className="text-lg font-bold text-slate-900">Primary Product Metric: Qualified Scheme Actions</h2>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Definition:</strong> Number of users who discover a relevant scheme and take a qualified high-intent action such as saving a scheme, comparing schemes, or clicking the official application portal CTA.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500">Homepage Views</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">1,240</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500">Profile Completions</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">890</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500">Scheme Saved</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">340</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-800">Apply CTA Clicks</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">412</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
