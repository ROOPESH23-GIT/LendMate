import React from 'react';
import { 
  Building2, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  BookOpen, 
  PartyPopper, 
  Sun, 
  Briefcase, 
  Lock 
} from 'lucide-react';
import SpaceCard from '../components/SpaceCard';

const CATEGORIES = [
  {
    name: 'Study Room',
    icon: BookOpen,
    tagline: 'Quiet, distraction-free pods with fast Wi-Fi',
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200'
  },
  {
    name: 'Hangout Space',
    icon: Users,
    tagline: 'Gaming lounges, beanbags & TV screens for squads',
    color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200'
  },
  {
    name: 'Meeting Room',
    icon: Briefcase,
    tagline: 'Projectors, whiteboards & conference rigs for teams',
    color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200'
  },
  {
    name: 'Party/Event Space',
    icon: PartyPopper,
    tagline: 'Banquet halls & acoustic stages for celebrations',
    color: 'from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200'
  },
  {
    name: 'Terrace',
    icon: Sun,
    tagline: 'Rooftops with lake view, string lights & BBQ',
    color: 'from-orange-500/10 to-rose-500/10 text-orange-600 border-orange-200'
  },
  {
    name: 'Private Room',
    icon: Lock,
    tagline: 'Dolby Atmos home theaters & creator podcast studios',
    color: 'from-rose-500/10 to-red-500/10 text-rose-600 border-rose-200'
  }
];

export default function HomePage({ spaces, onSelectSpace, onBookNow, onNavigateToBrowse, onCategorySelect, onOpenAddSpace }) {
  const featuredSpaces = spaces.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 border border-brand-200 text-brand-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Campus & City Hourly Space Rental</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Find a space. <br />
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Book it by the hour.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              From distraction-free study pods for semester exams to rooftop terraces and 4K private screening lounges around SRM University & Chennai. Reserve in seconds, pay strictly for the time you use.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigateToBrowse()}
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group text-sm"
              >
                <span>Browse Available Spaces</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onCategorySelect('Study Room')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-2xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Book Study Pods (from ₹120/hr)</span>
              </button>
            </div>

            {/* Key Value Props Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200/80 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Hourly Pricing</div>
                  <div className="text-[11px] text-slate-500">Pay for minutes used</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Zero Overlaps</div>
                  <div className="text-[11px] text-slate-500">Conflict-free algorithm</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">SRM & Chennai</div>
                  <div className="text-[11px] text-slate-500">Walkable campus hubs</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Instant Access</div>
                  <div className="text-[11px] text-slate-500">Immediate confirmation</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              Curated Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">
              Explore by Space Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find exactly what you need for study, work, chilling, or celebration.
            </p>
          </div>
          <button
            onClick={() => onNavigateToBrowse()}
            className="mt-4 md:mt-0 text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all spaces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => onCategorySelect(cat.name)}
                className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-brand-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-brand-600">
                  <span>Browse {cat.name}s</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED SPACES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Popular Around SRM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">
              Featured Spaces Available Today
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated spaces verified for Wi-Fi, air conditioning, and power backup.
            </p>
          </div>
          <button
            onClick={() => onNavigateToBrowse()}
            className="mt-4 md:mt-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
          >
            See all ({spaces.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onSelect={onSelectSpace}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 bg-brand-900/60 px-3 py-1 rounded-md border border-brand-700">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
              How LendMate Works
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Renting a room for a couple of hours shouldn't involve paperwork or awkward calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Pick Your Space</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter by Study Room, Hangout, Meeting, or Terrace near SRM Potheri, Guduvanchery, or Chennai.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Select Exact Hours</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose your date, start and end time. The system calculates the total instantly and prevents double-booking overlaps.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Instant Confirmation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get your digital booking pass immediately. Show up, unlock the space, connect to Wi-Fi, and enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-brand-50 to-indigo-50 rounded-3xl p-8 sm:p-10 border border-brand-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100/80 px-2.5 py-0.5 rounded">
              For Property Owners & Hosts
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Have an idle room, terrace, or workshop hall?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Monetize empty hours by listing your space on LendMate. Set your custom hourly rates, operating hours, and track bookings seamlessly from your Owner Dashboard.
            </p>
          </div>
          <button
            onClick={onOpenAddSpace}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 shrink-0"
          >
            <span>List Your Space Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
