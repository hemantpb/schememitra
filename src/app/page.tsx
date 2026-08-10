import Link from 'next/link';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Factory, 
  Shirt, 
  Utensils, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold mb-6 border border-sky-200">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Deterministic Match Engine for MSMEs</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Find Government Schemes <br className="hidden sm:inline" />
                <span className="text-sky-700">for Your Business</span>
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                Tell us about your business and what you want to achieve. SchemeMitra will help you discover relevant government schemes and understand why they match your business.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/wizard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-sky-700 hover:bg-sky-800 shadow-lg shadow-sky-700/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Find My Schemes</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm transition-all"
                >
                  <span>Explore Schemes</span>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-500">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                  100% Transparent Criteria
                </span>
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 mr-1.5" />
                  Verified Govt Sources
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Value Propositions */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How SchemeMitra Works</h2>
              <p className="mt-3 text-slate-600">A clear 3-step decision support system built specifically for busy business owners.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value Prop 1 */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6 font-bold text-xl">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Discover</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Find government schemes tailored to your specific business sector, state location, enterprise scale, and immediate objectives.
                </p>
              </div>

              {/* Value Prop 2 */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 font-bold text-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Understand</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  See breakdown of match scores, eligible benefits, required documents, and transparent explanations for why each scheme matches you.
                </p>
              </div>

              {/* Value Prop 3 */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 font-bold text-xl">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Act</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Get direct links to official government application portals, document checklists, and a step-by-step custom action plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported MVP Sectors */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
              Coverage Across Key MSME Sectors
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/wizard?sector=food_processing" className="p-6 bg-white rounded-xl border border-slate-200 text-center hover:border-sky-500 hover:shadow-sm transition-all group">
                <Utensils className="w-8 h-8 text-sky-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-slate-900 text-sm">Food Processing</h4>
                <p className="text-xs text-slate-500 mt-1">PMFME, PMEGP & State Subsidies</p>
              </Link>

              <Link href="/wizard?sector=textile" className="p-6 bg-white rounded-xl border border-slate-200 text-center hover:border-sky-500 hover:shadow-sm transition-all group">
                <Shirt className="w-8 h-8 text-sky-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-slate-900 text-sm">Textile & Apparel</h4>
                <p className="text-xs text-slate-500 mt-1">ATUFS & Modernization Grants</p>
              </Link>

              <Link href="/wizard?sector=manufacturing" className="p-6 bg-white rounded-xl border border-slate-200 text-center hover:border-sky-500 hover:shadow-sm transition-all group">
                <Factory className="w-8 h-8 text-sky-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-slate-900 text-sm">Manufacturing</h4>
                <p className="text-xs text-slate-500 mt-1">CGTMSE, ZED & Machinery Loans</p>
              </Link>

              <Link href="/wizard?sector=general_msme" className="p-6 bg-white rounded-xl border border-slate-200 text-center hover:border-sky-500 hover:shadow-sm transition-all group">
                <Building2 className="w-8 h-8 text-sky-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-slate-900 text-sm">General MSME</h4>
                <p className="text-xs text-slate-500 mt-1">Stand-Up India, MAI & Export Support</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer Banner */}
        <section className="py-10 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ShieldCheck className="w-10 h-10 text-sky-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-100">Independent Discovery Tool</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
              SchemeMitra is a discovery and decision-support tool. Eligibility and scheme details should always be verified on the official government source before applying.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
