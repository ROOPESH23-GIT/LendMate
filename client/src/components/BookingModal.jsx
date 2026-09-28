import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export default function BookingModal({ space, isOpen, onClose, onBookingSuccess, initialDate }) {
  const { currentUser } = useAuth();

  // Tomorrow as default date
  const getDefaultDate = () => {
    if (initialDate) return initialDate;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState(getDefaultDate());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [durationHours, setDurationHours] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // When modal opens or space changes
  useEffect(() => {
    if (space) {
      // Set reasonable initial times based on operating hours
      const s = space.available_start || '09:00';
      setStartTime(s);
      
      // Calculate +2 hours
      const [h, m] = s.split(':').map(Number);
      const endH = Math.min(23, h + 2);
      const formattedEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      setEndTime(formattedEnd <= space.available_end ? formattedEnd : space.available_end);
      
      setErrorMessage('');
      setSuccessBooking(null);
      fetchExistingSlots(space.id, bookingDate);
    }
  }, [space, isOpen]);

  // Fetch occupied slots for selected date
  const fetchExistingSlots = async (spaceId, date) => {
    try {
      const res = await fetch(`/api/spaces/${spaceId}?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.booked_slots || []);
      }
    } catch (err) {
      console.error('Failed to load slots', err);
    }
  };

  // Re-fetch booked slots when date changes
  const handleDateChange = (newDate) => {
    setBookingDate(newDate);
    setErrorMessage('');
    if (space) {
      fetchExistingSlots(space.id, newDate);
    }
  };

  // Recalculate duration and price automatically
  useEffect(() => {
    if (!startTime || !endTime || !space) return;

    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);

    const startDecimal = sH + sM / 60;
    const endDecimal = eH + eM / 60;

    const diff = endDecimal - startDecimal;
    if (diff > 0) {
      setDurationHours(diff);
      const price = Math.round(diff * space.price_per_hour * 100) / 100;
      setTotalPrice(price);
      setErrorMessage('');
    } else {
      setDurationHours(0);
      setTotalPrice(0);
      setErrorMessage('End time must be later than start time.');
    }
  }, [startTime, endTime, space]);

  if (!isOpen || !space) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!bookingDate) {
      setErrorMessage('Please select a date.');
      return;
    }
    if (durationHours <= 0) {
      setErrorMessage('End time must be strictly after start time.');
      return;
    }
    if (startTime < space.available_start || endTime > space.available_end) {
      setErrorMessage(`Booking must be within space available hours (${space.available_start} - ${space.available_end}).`);
      return;
    }

    setLoading(true);

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
        // Double booking rejection or other server error
        setErrorMessage(data.error || 'Failed to complete booking. Please try another slot.');
        setLoading(false);
        // Refresh booked slots to show current conflicts
        fetchExistingSlots(space.id, bookingDate);
        return;
      }

      setLoading(false);
      setSuccessBooking(data.booking);
      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Network error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              LM
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {successBooking ? 'Booking Confirmed!' : 'Book Space by the Hour'}
              </h3>
              <p className="text-xs text-slate-500">
                {successBooking ? 'Your hourly reservation is secured' : 'Instant confirmation with zero booking fees'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {successBooking ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  You're all set!
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  Your reservation for <strong className="text-slate-900">{space.name}</strong> has been confirmed.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-mono font-bold text-brand-600">#LM-{successBooking.id.toString().padStart(5, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-800">{successBooking.booking_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot</span>
                  <span className="font-semibold text-slate-800">{successBooking.start_time} - {successBooking.end_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-800">{durationHours} hr{durationHours > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Booked By</span>
                  <span className="font-semibold text-slate-800">{currentUser?.name} ({currentUser?.email})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/80 text-sm">
                  <span className="font-bold text-slate-900">Total Price</span>
                  <span className="font-bold text-emerald-600 text-base">₹{successBooking.total_price}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.hash = '#my-bookings';
                  }}
                  className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Space summary card */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <img
                  src={space.image_url}
                  alt={space.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={space.category} size="sm" />
                    <span className="text-xs font-bold text-brand-600">₹{space.price_per_hour}/hr</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                    {space.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{space.location}</span>
                  </div>
                </div>
              </div>

              {/* Operating hours info badge */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-amber-800">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Host available hours: <strong>{space.available_start} - {space.available_end}</strong>
                </span>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  <span>Select Date</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none font-medium"
                />
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>End Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none font-medium"
                  />
                </div>
              </div>

              {/* Booked Slots Indicator */}
              {bookedSlots.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reserved slots on {bookingDate}:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {bookedSlots.map((b) => (
                      <span
                        key={b.id}
                        className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium"
                      >
                        {b.start_time} - {b.end_time} (Booked)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Price Calculation Summary */}
              {durationHours > 0 && (
                <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Duration:</span>
                    <span className="font-bold text-slate-900">{durationHours} hour{durationHours > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Rate:</span>
                    <span>₹{space.price_per_hour} / hr</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-brand-200/80 text-sm font-extrabold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-brand-600 text-lg">₹{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Error Banner - Shows Double Booking conflict clearly */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Booking Conflict / Error</div>
                    <div className="mt-0.5 leading-relaxed">{errorMessage}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || durationHours <= 0}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    loading || durationHours <= 0
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg shadow-brand-500/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking Availability...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Book (₹{totalPrice})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Booking as: <strong className="text-slate-600">{currentUser?.name}</strong> ({currentUser?.role})
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
