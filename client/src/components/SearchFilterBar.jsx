import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, Calendar, Clock, Users, IndianRupee, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Study Room',
  'Hangout Space',
  'Meeting Room',
  'Party/Event Space',
  'Terrace',
  'Private Room'
];

export default function SearchFilterBar({ filters, setFilters, onSearch, compact = false }) {
  const [showAdvanced, setShowAdvanced] = useState(!compact);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All',
      max_price: '',
      capacity: '',
      date: '',
      start_time: '',
      end_time: ''
    });
  };

  const hasActiveFilters = 
    filters.search || 
    (filters.category && filters.category !== 'All') || 
    filters.max_price || 
    filters.capacity || 
    filters.date || 
    filters.start_time || 
    filters.end_time;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-200/80">
      
      {/* Top Search Bar Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Name / Location Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by space name, location, or landmark (e.g. SRM, Potheri)..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleInputChange('search', '')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toggle Filters & Search Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all ${
              showAdvanced || hasActiveFilters
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-600"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset all filters"
              className="p-3 rounded-2xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = (filters.category || 'All') === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleInputChange('category', cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Expandable Grid */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
          
          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              <span>Max Price / hr</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={filters.max_price}
              onChange={(e) => handleInputChange('max_price', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            />
          </div>

          {/* Min Capacity */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Min Capacity</span>
            </label>
            <input
              type="number"
              placeholder="Seats required"
              value={filters.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Start Time</span>
            </label>
            <input
              type="time"
              value={filters.start_time}
              onChange={(e) => handleInputChange('start_time', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>End Time</span>
            </label>
            <input
              type="time"
              value={filters.end_time}
              onChange={(e) => handleInputChange('end_time', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            />
          </div>

        </div>
      )}

    </div>
  );
}
