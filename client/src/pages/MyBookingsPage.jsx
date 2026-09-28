import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Trash2, 
  ArrowRight, 
  RefreshCw,
  Loader2,
  Calendar
} from 'lucide-react';
import CategoryBadge from '../components/CategoryBadge';

export default function MyBookingsPage({ onNavigateToBrowse }) {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        headers: {
          'x-user-id': String(currentUser?.id || 3)
        }
      });
      if (!res.ok) throw new Error('Failed to load your bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The reserved time slot will become immediately available for other users.')) {
      return;
    }

    setCancellingId(bookingId);
    setCancelFeedback('');

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': String(currentUser?.id || 3)
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');

      setCancelFeedback('Booking cancelled successfully. The slot is now freed.');
      // Refresh list
      fetchBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
      setTimeout(() => setCancelFeedback(''), 4000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 w-fit px-2.5 py-1 rounded-md border border-brand-200">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Reservations</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 mt-2">
            My Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Viewing reservations for <strong className="text-slate-800">{currentUser?.name}</strong> ({currentUser?.email})
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-center px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Cancel Feedback Banner */}
      {cancelFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{cancelFeedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'confirmed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active / Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'cancelled'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your reservations...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl max-w-md mx-auto my-8">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">Failed to retrieve bookings</h3>
          <p className="text-xs text-slate-600 mt-1">{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No bookings found</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {activeTab === 'all'
              ? "You haven't reserved any hourly spaces yet. Find a study room or hangout lounge to get started!"
              : `You have no ${activeTab} bookings.`}
          </p>
          <button
            onClick={onNavigateToBrowse}
            className="mt-6 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Spaces Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                
                {/* Left: Space info & Image */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={b.image_url}
                    alt={b.space_name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={b.space_category} size="sm" />
                      <span className="text-[11px] font-mono text-slate-400">
                        #LM-{b.id.toString().padStart(5, '0')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {b.space_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.space_location}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Date & Time details */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Booking Date</div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-500" />
                      <span>{b.booking_date}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Time Interval</div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>{b.start_time} - {b.end_time}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Price</div>
                    <div className="font-bold text-brand-600 flex items-center gap-0.5 mt-0.5 text-sm">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{b.total_price}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status badge & Cancel Action */}
                <div className="flex items-center gap-3 self-end md:self-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200 line-through'
                    }`}
                  >
                    {isConfirmed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancelled</span>
                      </>
                    )}
                  </span>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      disabled={cancellingId === b.id}
                      title="Cancel this reservation"
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
                    >
                      {cancellingId === b.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
