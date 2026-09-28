import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Share2,
  Check,
  Loader2
} from 'lucide-react';
import CategoryBadge from '../components/CategoryBadge';
import { useAuth } from '../context/AuthContext';

export default function SpaceDetailsPage({ spaceId, onBack, onBookingSuccess, onNavigateToMyBookings }) {
  const { currentUser } = useAuth();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking widget states
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState(getTomorrow());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [durationHours, setDurationHours] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchSpaceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/spaces/${spaceId}?date=${bookingDate}`);
      if (!res.ok) throw new Error('Failed to load space details');
      const data = await res.json();
      setSpace(data);

      // Auto-set operating hours bounds
      if (data.available_start) {
        setStartTime(data.available_start);
        const [h, m] = data.available_start.split(':').map(Number);
        const endH = Math.min(23, h + 2);
        const autoEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        setEndTime(autoEnd <= data.available_end ? autoEnd : data.available_end);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchSpaceDetails();
    }
  }, [spaceId, bookingDate]);

  // Recalculate duration & total price
  useEffect(() => {
    if (!startTime || !endTime || !space) return;

    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const diff = (eH + eM / 60) - (sH + sM / 60);

    if (diff > 0) {
      setDurationHours(diff);
      const calculated = Math.round(diff * space.price_per_hour * 100) / 100;
      setTotalPrice(calculated);
      setBookingError('');
    } else {
      setDurationHours(0);
      setTotalPrice(0);
      setBookingError('End time must be later than start time.');
    }
  }, [startTime, endTime, space]);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (durationHours <= 0) {
      setBookingError('End time must be after start time.');
      return;
    }
    if (startTime < space.available_start || endTime > space.available_end) {
      setBookingError(`Booking time must fall within host operating hours (${space.available_start} - ${space.available_end}).`);
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(currentUser?.id || 3)
        },
        body: JSON.stringify({
          space_id: space.id,
          user_id: currentUser?.id || 3,
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // DOUBLE BOOKING OVERLAP ERROR HANDLING
        setBookingError(data.error || 'This space is already booked for the selected time.');
        setBookingLoading(false);
        // Refresh space to show latest reserved slots
        fetchSpaceDetails();
        return;
      }

      setBookingLoading(false);
      setBookingSuccess(data.booking);
      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }
    } catch (err) {
      setBookingLoading(false);
      setBookingError('Network connection failed. Please retry.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading space details...</p>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Space Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Unable to locate this space.'}</p>
        <button
          onClick={onBack}
          className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const amenitiesList = space.amenities
    ? space.amenities.split(',').map(a => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Spaces</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied' : 'Share Space'}</span>
        </button>
      </div>

      {/* Main Grid: Details Left, Booking Widget Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Image & Space Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Image */}
          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-slate-200">
            <img
              src={space.image_url}
              alt={space.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <CategoryBadge category={space.category} size="md" />
            </div>
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/60">
              <span className="text-xs text-slate-500 font-medium">Rate: </span>
              <span className="text-xl font-black text-brand-600">₹{space.price_per_hour}</span>
              <span className="text-xs text-slate-500"> / hour</span>
            </div>
          </div>

          {/* Space Title & Location */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {space.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{space.location}</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-slate-400 font-medium">Seating Capacity</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span>Up to {space.capacity} guests</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-slate-400 font-medium">Operating Hours</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span>{space.available_start} - {space.available_end}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                <div className="text-slate-400 font-medium">Hourly Billing</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-brand-500" />
                  <span>₹{space.price_per_hour}/hr flat</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                About this space
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {space.description}
              </p>
            </div>

            {/* Amenities Checklist */}
            {amenitiesList.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Included Amenities & Perks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {amenitiesList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Card */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Space Host Information
              </h3>
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                  {space.owner_name ? space.owner_name.charAt(0) : 'H'}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {space.owner_name || 'Verified Space Host'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-3">
                    {space.owner_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {space.owner_email}
                      </span>
                    )}
                    {space.owner_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {space.owner_phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Hourly Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
            
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-950">₹{space.price_per_hour}</span>
                  <span className="text-xs text-slate-500 font-medium"> / hour</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Instant Confirmation
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Operating window: <strong className="text-slate-800">{space.available_start} - {space.available_end}</strong>
              </p>
            </div>

            {bookingSuccess ? (
              /* Success View */
              <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Booking Confirmed!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Reference: <strong>#LM-{bookingSuccess.id.toString().padStart(5, '0')}</strong>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-left space-y-1.5 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-semibold">{bookingSuccess.booking_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hours:</span>
                    <span className="font-semibold">{bookingSuccess.start_time} - {bookingSuccess.end_time}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Paid:</span>
                    <span className="text-emerald-600 font-bold">₹{bookingSuccess.total_price}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={onNavigateToMyBookings}
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    View in My Bookings
                  </button>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleBook} className="space-y-4">
                
                {/* Date Picker */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                  />
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>Start Time</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>End Time</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Show Reserved Slots If Any */}
                {space.booked_slots && space.booked_slots.length > 0 && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                    <div className="font-bold text-amber-900 mb-1">
                      Unavailable slots on this date:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {space.booked_slots.map((b) => (
                        <span
                          key={b.id}
                          className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-mono"
                        >
                          {b.start_time} - {b.end_time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duration & Price Calculation */}
                {durationHours > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Duration:</span>
                      <span className="font-bold text-slate-900">{durationHours} hr{durationHours > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Rate:</span>
                      <span>₹{space.price_per_hour}/hr</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                      <span>Total Amount:</span>
                      <span className="text-brand-600 text-base">₹{totalPrice}</span>
                    </div>
                  </div>
                )}

                {/* Double-Booking Error Banner */}
                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Slot Unavailable / Overlap</div>
                      <div className="mt-0.5 leading-relaxed">{bookingError}</div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || durationHours <= 0}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    bookingLoading || durationHours <= 0
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25 hover:shadow-lg'
                  }`}
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking Overlaps & Reserving...</span>
                    </>
                  ) : (
                    <span>Confirm & Book Space (₹{totalPrice})</span>
                  )}
                </button>

                <div className="text-[11px] text-slate-400 text-center">
                  Renting as: <strong className="text-slate-700">{currentUser?.name}</strong> ({currentUser?.role})
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
