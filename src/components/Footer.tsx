import Link from 'next/link';
import { ShieldAlert, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SchemeMitra</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              Empowering Indian MSMEs and entrepreneurs to discover, understand, and apply for relevant central and state government schemes with total transparency.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 max-w-lg flex items-start space-x-3 text-xs text-slate-300">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Disclaimer:</strong> SchemeMitra is an independent discovery and decision-support tool. Scheme details, eligibility criteria, and benefits must be verified on official government portals before submitting formal applications.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Supported Sectors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/wizard?sector=food_processing" className="hover:text-white transition-colors">Food Processing</Link></li>
              <li><Link href="/wizard?sector=textile" className="hover:text-white transition-colors">Textile & Apparel</Link></li>
              <li><Link href="/wizard?sector=manufacturing" className="hover:text-white transition-colors">Manufacturing</Link></li>
              <li><Link href="/wizard?sector=general_msme" className="hover:text-white transition-colors">General MSME</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Official Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://myscheme.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">myScheme Portal ↗</a></li>
              <li><a href="https://msme.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Ministry of MSME ↗</a></li>
              <li><a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Udyam Registration ↗</a></li>
              <li><a href="https://mofpi.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">MoFPI Portal ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
          <p>© {new Date().getFullYear()} SchemeMitra. Built for Indian MSMEs & Entrepreneurs.</p>
        </div>
      </div>
    </footer>
  );
}
