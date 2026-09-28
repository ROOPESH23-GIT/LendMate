import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Users, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Loader2,
  Check
} from 'lucide-react';

const CATEGORIES = [
  'Study Room',
  'Hangout Space',
  'Meeting Room',
  'Party/Event Space',
  'Terrace',
  'Private Room'
];

const PRESET_IMAGES = [
  {
    label: 'Modern Study Pod',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Cozy Gaming Lounge',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Glass Meeting Suite',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Rooftop Terrace',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Dolby Screening Suite',
    url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Workshop Event Hall',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80'
  }
];

const POPULAR_AMENITIES = [
  'High-Speed Wi-Fi',
  'Air Conditioning',
  'Power Backup / Inverter',
  'Laser Projector & Screen',
  'Whiteboard & Markers',
  'PlayStation 5 Console',
  'Dolby Surround Sound',
  'Ergonomic Mesh Chairs',
  'Water Dispenser',
  'Mini Fridge / Coffee Machine',
  'Private Washroom Access',
  'Terrace BBQ Setup'
];

export default function AddSpacePage({ onBack, onSpaceCreated }) {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Study Room',
    location: '',
    price_per_hour: '',
    capacity: '',
    image_url: PRESET_IMAGES[0].url,
    available_start: '08:00',
    available_end: '22:00',
    amenities: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (item) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== item)
          : [...prev.amenities, item]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) return setError('Please enter a space title.');
    if (!formData.description.trim()) return setError('Please enter a description.');
    if (!formData.location.trim()) return setError('Please specify the location or campus landmark.');
    if (!formData.price_per_hour || Number(formData.price_per_hour) <= 0) {
      return setError('Hourly rate must be a valid positive amount.');
    }
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      return setError('Capacity must be at least 1 person.');
    }
    if (formData.available_start >= formData.available_end) {
      return setError('Available end time must be later than start time.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(currentUser?.id || 1)
        },
        body: JSON.stringify({
          ...formData,
          price_per_hour: Number(formData.price_per_hour),
          capacity: Number(formData.capacity),
          amenities: formData.amenities.join(', '),
          owner_id: currentUser?.id || 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to list space');
      }

      setLoading(false);
      setSuccess(true);
      if (onSpaceCreated) {
        onSpaceCreated(data.space);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Back</span>
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 w-fit px-2.5 py-1 rounded-md border border-indigo-200">
          <Building2 className="w-3.5 h-3.5" />
          <span>New Property Listing</span>
        </div>
        <h1 className="text-3xl font-black text-slate-950 mt-2">
          List a New Hourly Space
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish your space to students, freelancers, and teams around SRM & Chennai.
        </p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Space Listed Successfully!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your hourly space is now live in the LendMate directory and ready to receive bookings.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Go to Owner Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Space Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Space Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quiet Study Pod near SRM Arch"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location / Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Potheri, Near SRM Hospital, Chennai"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Pricing & Capacity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
                <span>Price Per Hour (₹) *</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 200"
                value={formData.price_per_hour}
                onChange={(e) => handleInputChange('price_per_hour', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Max Capacity (Persons) *</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 6"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold"
              />
            </div>
          </div>

          {/* Operating Hours Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Available From *</span>
              </label>
              <input
                type="time"
                required
                value={formData.available_start}
                onChange={(e) => handleInputChange('available_start', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Available Until *</span>
              </label>
              <input
                type="time"
                required
                value={formData.available_end}
                onChange={(e) => handleInputChange('available_end', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Highlight what makes this space great for study, work, or leisure..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Image URL with Preset Pickers */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Space Image URL *</span>
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none mb-2"
            />
            
            <p className="text-[11px] text-slate-400 mb-2 font-medium">Or choose a preset photography photo:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => handleInputChange('image_url', img.url)}
                  className={`p-2 rounded-xl text-left border text-xs flex items-center gap-2 transition-all ${
                    formData.image_url === img.url
                      ? 'border-indigo-600 bg-indigo-50/70 font-bold text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <span className="truncate">{img.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Amenities & Equipment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_AMENITIES.map((item) => {
                const isSelected = formData.amenities.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    className={`p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Space...</span>
                </>
              ) : (
                <span>Publish Space to Directory</span>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
