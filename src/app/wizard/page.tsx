'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Sector, 
  EnterpriseSize, 
  Registration, 
  Objective, 
  UserProfile 
} from '@/types/scheme';
import { 
  SECTORS_LIST, 
  INDIAN_STATES, 
  MAHARASHTRA_DISTRICTS, 
  OBJECTIVES_LIST, 
  REGISTRATIONS_LIST 
} from '@/data/wizardConstants';
import { 
  Utensils, 
  Shirt, 
  Factory, 
  Building2, 
  MoreHorizontal, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-6 h-6" />,
  Shirt: <Shirt className="w-6 h-6" />,
  Factory: <Factory className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  MoreHorizontal: <MoreHorizontal className="w-6 h-6" />
};

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    sector: 'food_processing',
    state: 'Maharashtra',
    district: 'Nagpur',
    enterpriseSize: 'micro',
    annualTurnover: 25,
    employeeCount: 5,
    businessAge: 3,
    registrations: ['udyam'],
    objectives: ['funding', 'machinery']
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sectorParam = searchParams.get('sector') as Sector | null;
    if (sectorParam) {
      setProfile(prev => ({ ...prev, sector: sectorParam }));
    }
  }, [searchParams]);

  const handleNext = () => {
    setError(null);
    if (step === 1 && !profile.sector) {
      setError('Please select a business sector');
      return;
    }
    if (step === 2 && !profile.state) {
      setError('Please select your business state');
      return;
    }
    if (step === 3 && !profile.enterpriseSize) {
      setError('Please select your enterprise size');
      return;
    }
    if (step === 5 && (!profile.objectives || profile.objectives.length === 0)) {
      setError('Please select at least one objective you want help with');
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Save profile to localStorage and redirect to recommendations page
      if (typeof window !== 'undefined') {
        localStorage.setItem('schememitra_user_profile', JSON.stringify(profile));
      }
      const query = new URLSearchParams({
        sector: profile.sector || '',
        state: profile.state || '',
        size: profile.enterpriseSize || ''
      }).toString();
      router.push(`/recommendations?${query}`);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleRegistration = (reg: Registration) => {
    setProfile(prev => {
      const current = prev.registrations || [];
      if (current.includes(reg)) {
        return { ...prev, registrations: current.filter(r => r !== reg) };
      } else {
        return { ...prev, registrations: [...current, reg] };
      }
    });
  };

  const toggleObjective = (obj: Objective) => {
    setProfile(prev => {
      const current = prev.objectives || [];
      if (current.includes(obj)) {
        return { ...prev, objectives: current.filter(o => o !== obj) };
      } else {
        return { ...prev, objectives: [...current, obj] };
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Progress Bar & Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-700 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          <div className="mt-6">
            {step === 1 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">What is your Business Sector?</h1>
                <p className="text-slate-600 text-sm mt-1">Select the primary sector your enterprise operates in.</p>
              </div>
            )}
            {step === 2 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Where is your business located?</h1>
                <p className="text-slate-600 text-sm mt-1">Select state and district to match both Central & State-specific subsidies.</p>
              </div>
            )}
            {step === 3 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Business Size & Metrics</h1>
                <p className="text-slate-600 text-sm mt-1">Provide approximate enterprise scale details to evaluate ceiling limits.</p>
              </div>
            )}
            {step === 4 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Current Business Registrations</h1>
                <p className="text-slate-600 text-sm mt-1">Check all active registrations (or skip if not registered yet).</p>
              </div>
            )}
            {step === 5 && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">What do you want help with?</h1>
                <p className="text-slate-600 text-sm mt-1">Select all key objectives for your business right now.</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center space-x-3 text-amber-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTORS_LIST.map((item) => {
                const isSelected = profile.sector === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, sector: item.id }))}
                    className={`p-5 rounded-xl border text-left flex items-start space-x-4 transition-all ${
                      isSelected 
                        ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-600/20' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${isSelected ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {iconMap[item.icon]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-base">{item.label}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">State / Union Territory</label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">District</label>
                {profile.state === 'Maharashtra' ? (
                  <select
                    value={profile.district}
                    onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
                  >
                    {MAHARASHTRA_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter district name (e.g. Surat, Indore)"
                    value={profile.district || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
                  />
                )}
                <p className="text-xs text-slate-500 mt-2">Defaulted & prioritized for Maharashtra state industrial policies.</p>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Enterprise Size</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'micro', label: 'Micro', desc: 'Investment < ₹1 Cr | Turnover < ₹5 Cr' },
                    { id: 'small', label: 'Small', desc: 'Investment < ₹10 Cr | Turnover < ₹50 Cr' },
                    { id: 'medium', label: 'Medium', desc: 'Investment < ₹50 Cr | Turnover < ₹250 Cr' }
                  ].map((size) => {
                    const isSelected = profile.enterpriseSize === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, enterpriseSize: size.id as EnterpriseSize }))}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-600/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold text-slate-900">{size.label}</span>
                        <span className="block text-xs text-slate-500 mt-1 leading-normal">{size.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Turnover (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={profile.annualTurnover || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, annualTurnover: Number(e.target.value) }))}
                    className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
                    placeholder="e.g. 25"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employees</label>
                  <input
                    type="number"
                    value={profile.employeeCount || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, employeeCount: Number(e.target.value) }))}
                    className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
                    placeholder="e.g. 8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Age (Years)</label>
                  <input
                    type="number"
                    value={profile.businessAge || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, businessAge: Number(e.target.value) }))}
                    className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-3">
              {REGISTRATIONS_LIST.map((reg) => {
                const isSelected = profile.registrations?.includes(reg.id);
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => toggleRegistration(reg.id)}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSelected 
                        ? 'border-sky-600 bg-sky-50/50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{reg.label}</h4>
                      <p className="text-xs text-slate-500">{reg.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-sky-700 border-sky-700 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OBJECTIVES_LIST.map((obj) => {
                const isSelected = profile.objectives?.includes(obj.id);
                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => toggleObjective(obj.id)}
                    className={`p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-600/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="pr-2">
                      <h4 className="font-bold text-slate-900 text-sm">{obj.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{obj.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center border ${
                      isSelected ? 'bg-sky-700 border-sky-700 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation CTAs */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                step === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold bg-sky-700 hover:bg-sky-800 text-white shadow-sm transition-colors"
            >
              <span>{step === 5 ? 'Get Recommendations' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">Loading Wizard...</p>
      </div>
    }>
      <WizardContent />
    </Suspense>
  );
}
