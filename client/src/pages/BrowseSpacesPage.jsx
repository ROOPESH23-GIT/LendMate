import React, { useState, useEffect } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import SpaceCard from '../components/SpaceCard';
import { Compass, Sparkles, AlertCircle, RefreshCw, SlidersHorizontal } from 'lucide-react';

export default function BrowseSpacesPage({ onSelectSpace, onBookNow, initialCategory, onCategoryChange }) {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: initialCategory || 'All',
    max_price: '',
    capacity: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  // Sync initial category if changed from outside
  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const fetchSpaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.capacity) params.append('capacity', filters.capacity);
      if (filters.date) params.append('date', filters.date);
      if (filters.start_time) params.append('start_time', filters.start_time);
      if (filters.end_time) params.append('end_time', filters.end_time);

      const res = await fetch(`/api/spaces?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load spaces');
      const data = await res.json();
      setSpaces(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 w-fit px-2.5 py-1 rounded-md border border-brand-200">
          <Compass className="w-3.5 h-3.5" />
          <span>Hourly Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
          Browse Available Spaces
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore study rooms, meeting suites, terraces, and private lounges in Chennai & SRM.
        </p>
      </div>

      {/* Prominent Search & Filters Bar */}
      <SearchFilterBar
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchSpaces}
      />

      {/* Result Status & Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div>
          Showing <strong className="text-slate-900 font-semibold">{spaces.length}</strong> space{spaces.length === 1 ? '' : 's'}
          {filters.category && filters.category !== 'All' && (
            <span> in <span className="font-semibold text-brand-600">"{filters.category}"</span></span>
          )}
          {filters.date && (
            <span> available on <span className="font-semibold text-slate-800">{filters.date}</span></span>
          )}
        </div>
        <button
          onClick={fetchSpaces}
          className="flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
              <div className="h-48 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Failed to load spaces</h3>
          <p className="text-xs text-slate-600 mt-1">{error}</p>
          <button
            onClick={fetchSpaces}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      ) : spaces.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching spaces found</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Try adjusting your search keywords, broadening your price/capacity range, or clearing date filters.
          </p>
          <button
            onClick={() => setFilters({
              search: '',
              category: 'All',
              max_price: '',
              capacity: '',
              date: '',
              start_time: '',
              end_time: ''
            })}
            className="mt-5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onSelect={onSelectSpace}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      )}

    </div>
  );
}
