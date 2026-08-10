import Link from 'next/link';
import { Compass, Bookmark, Search, Bot } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-800 transition-colors">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Scheme<span className="text-sky-700">Mitra</span>
            </span>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold leading-none">
              MSME Scheme Discovery
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-4">
          <Link
            href="/ai-search"
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
          >
            <Bot className="w-4 h-4 text-sky-600" />
            <span>AI Search</span>
          </Link>

          <Link
            href="/explore"
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Explore</span>
          </Link>

          <Link
            href="/saved"
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Saved</span>
          </Link>

          <Link
            href="/wizard"
            className="inline-flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold bg-sky-700 text-white shadow-sm hover:bg-sky-800 transition-colors"
          >
            <span>Find My Schemes</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
