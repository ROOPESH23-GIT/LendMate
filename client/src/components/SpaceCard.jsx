import React from 'react';
import { MapPin, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export default function SpaceCard({ space, onSelect, onBookNow }) {
  const amenitiesList = space.amenities
    ? space.amenities.split(',').map(a => a.trim()).filter(Boolean).slice(0, 3)
    : [];

  return (
    <div
      onClick={() => onSelect(space)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={space.image_url}
          alt={space.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Floating Category */}
        <div className="absolute top-3.5 left-3.5">
          <CategoryBadge category={space.category} />
        </div>

        {/* Floating Price Tag */}
        <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-white/50 text-slate-900">
          <span className="text-xs text-slate-500 font-medium">From </span>
          <span className="text-base font-bold text-brand-600">₹{space.price_per_hour}</span>
          <span className="text-xs text-slate-500">/hr</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {space.name}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{space.location}</span>
          </div>

          <p className="text-slate-600 text-xs mt-2.5 line-clamp-2 leading-relaxed">
            {space.description}
          </p>

          {/* Quick Info Badges */}
          <div className="flex items-center gap-4 mt-3.5 py-2.5 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-brand-500" />
              <span>Up to {space.capacity} people</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{space.available_start} - {space.available_end}</span>
            </div>
          </div>

          {/* Amenities Pills */}
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {amenitiesList.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                >
                  {item}
                </span>
              ))}
              {space.amenities.split(',').length > 3 && (
                <span className="text-[11px] text-slate-400 px-1 py-0.5 font-medium">
                  +{space.amenities.split(',').length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="mt-5 pt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(space);
            }}
            className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(space);
            }}
            className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-1 group/btn"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
