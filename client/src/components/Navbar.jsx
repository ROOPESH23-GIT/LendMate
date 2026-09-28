import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { 
  Building2, 
  CalendarDays, 
  LayoutDashboard, 
  PlusCircle, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  Check, 
  LogOut,
  Sparkles,
  Compass
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenAddSpace }) {
  const { currentUser, switchAccount, logout, isOwner } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Lend<span className="text-brand-600">Mate</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded border border-brand-200">
                  Hourly
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 font-medium hidden sm:block">
                Find a space. Book it by the hour.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActivePage('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'home'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('browse')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activePage === 'browse'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Browse Spaces</span>
            </button>
            <button
              onClick={() => setActivePage('my-bookings')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activePage === 'my-bookings'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>My Bookings</span>
            </button>

            {/* Owner Links */}
            {isOwner && (
              <button
                onClick={() => setActivePage('owner-dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activePage === 'owner-dashboard'
                    ? 'text-indigo-700 bg-indigo-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Owner Dashboard</span>
              </button>
            )}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* List a Space button for owners / quick add */}
            {isOwner ? (
              <button
                onClick={onOpenAddSpace}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all hover:shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List a Space</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  // Switch to owner demo
                  const owner = DEMO_ACCOUNTS.find(a => a.role === 'owner');
                  if (owner) switchAccount(owner);
                  setActivePage('owner-dashboard');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-brand-600 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Switch to Owner Mode</span>
              </button>
            )}

            {/* Demo User Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs text-slate-700 font-medium"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                  isOwner ? 'bg-amber-500' : 'bg-brand-600'
                }`}>
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {currentUser?.name || 'Guest'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight capitalize">
                    {currentUser?.role === 'owner' ? '👑 Space Owner' : '🎓 Student / Renter'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {accountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setAccountDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Demo Role Switcher
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Switch instantly between Student & Owner views:
                    </p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => switchAccount(acc)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          currentUser?.id === acc.id
                            ? 'bg-brand-50 text-brand-700 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-900">{acc.name}</div>
                          <div className="text-[10px] text-slate-400">{acc.title} ({acc.role})</div>
                        </div>
                        {currentUser?.id === acc.id && (
                          <Check className="w-4 h-4 text-brand-600" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                    <button
                      onClick={() => setActivePage('login')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Custom Login / Register</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {/* User badge */}
          <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-slate-900">{currentUser?.name}</div>
              <div className="text-xs text-slate-500 capitalize">{currentUser?.role}</div>
            </div>
            <button
              onClick={() => {
                const isNowOwner = currentUser?.role === 'owner';
                const next = DEMO_ACCOUNTS.find(a => (isNowOwner ? a.role === 'user' : a.role === 'owner'));
                if (next) switchAccount(next);
              }}
              className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-700"
            >
              Switch Role
            </button>
          </div>

          <button
            onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activePage === 'home' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => { setActivePage('browse'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activePage === 'browse' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
            }`}
          >
            Browse Spaces
          </button>
          <button
            onClick={() => { setActivePage('my-bookings'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activePage === 'my-bookings' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
            }`}
          >
            My Bookings
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => { setActivePage('owner-dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activePage === 'owner-dashboard' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                }`}
              >
                Owner Dashboard
              </button>
              <button
                onClick={() => { onOpenAddSpace(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600"
              >
                + List a Space
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => { setActivePage('login'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-500"
            >
              Sign Out / Switch User
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
