import React from 'react';
import { Building2, Heart, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function Footer({ onCategoryClick, onNavigate }) {
  const categories = [
    'Study Room',
    'Hangout Space',
    'Meeting Room',
    'Party/Event Space',
    'Terrace',
    'Private Room'
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Lend<span className="text-brand-400">Mate</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find a space. Book it by the hour. The frictionless hourly rental platform for students, creators, and teams around SRM & Chennai.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Kattankulathur & SRM University, Chennai</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Space Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategoryClick && onCategoryClick(cat)}
                    className="hover:text-brand-400 transition-colors text-slate-400 text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Why LendMate?
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Zero full-day locks: pay strictly for the hours you need</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Double-booking guarantee with real-time slot conflict prevention</span>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Verified hosts with transparent amenities & power backup</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Project Info */}
          <div>
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-800">
                Hackathon Showcase
              </span>
              <h5 className="text-white font-bold text-sm mt-3">LendMate MVP</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Built with React, Vite, Tailwind CSS, Express, and SQLite. Features real-time slot overlap prevention and instant owner analytics.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LendMate Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for high-impact campus productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
