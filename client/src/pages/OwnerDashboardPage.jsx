import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  IndianRupee, 
  PlusCircle, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';
import CategoryBadge from '../components/CategoryBadge';

export default function OwnerDashboardPage({ onOpenAddSpace, onSelectSpace }) {
  const { currentUser } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total_spaces: 0, total_bookings: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('spaces'); // 'spaces' or 'bookings'

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const ownerId = currentUser?.id || 1;

      // Fetch owned spaces
      const sRes = await fetch(`/api/owner/spaces`, {
        headers: { 'x-user-id': String(ownerId) }
      });
      const sData = await sRes.json();
      setSpaces(Array.isArray(sData) ? sData : []);

      // Fetch owner bookings & stats
      const bRes = await fetch(`/api/owner/bookings`, {
        headers: { 'x-user-id': String(ownerId) }
      });
      const bData = await bRes.json();
      setBookings(bData.bookings || []);
      setStats(bData.stats || { total_spaces: 0, total_bookings: 0, total_revenue: 0 });

    } catch (err) {
      console.error('Owner data fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 w-fit px-2.5 py-1 rounded-md border border-indigo-200">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Host Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 mt-2">
            Owner Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong className="text-slate-800">{currentUser?.name}</strong>. Manage your listed spaces and incoming reservations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOwnerData}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenAddSpace}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List New Space</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Metric 1: Total Spaces */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Listed Spaces</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {stats.total_spaces || spaces.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Active hourly listings</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Total Bookings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {stats.total_bookings}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Confirmed reservations</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Earnings</span>
            <div className="text-3xl font-black text-indigo-600 mt-1 flex items-center">
              <span>₹{stats.total_revenue}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Hourly payout balance</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('spaces')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'spaces'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>My Listed Spaces ({spaces.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Customer Bookings ({bookings.length})</span>
        </button>
      </div>

      {/* Tab 1: Listed Spaces */}
      {activeTab === 'spaces' && (
        <div>
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading your listed properties...</p>
            </div>
          ) : spaces.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-6 shadow-xs">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No spaces listed yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Start earning by listing your first study pod, meeting room, or event terrace.
              </p>
              <button
                onClick={onOpenAddSpace}
                className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                + List Your First Space
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-100">
                      <img
                        src={s.image_url}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <CategoryBadge category={s.category} size="sm" />
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/95 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 shadow-xs">
                        ₹{s.price_per_hour}/hr
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">{s.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{s.location}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                        <div>
                          <span className="text-slate-400">Capacity: </span>
                          <span className="font-semibold">{s.capacity} seats</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Hours: </span>
                          <span className="font-semibold">{s.available_start} - {s.available_end}</span>
                        </div>
                      </div>

                      {/* Performance metrics for this space */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Bookings</div>
                          <div className="font-bold text-slate-800">{s.total_bookings_count || 0} reserved</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Revenue</div>
                          <div className="font-bold text-emerald-600">₹{s.total_earnings || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onSelectSpace(s)}
                      className="w-full py-2.5 text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                    >
                      View Space Page
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Customer Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Customer Reservations Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live record of all reservations booked across your spaces.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No reservations recorded yet for your spaces.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Space</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Revenue</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-600">
                        #LM-{b.id.toString().padStart(5, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{b.space_name}</div>
                        <div className="text-[10px] text-slate-400">{b.space_category}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{b.user_name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          {b.user_email && <span>{b.user_email}</span>}
                          {b.user_phone && <span>{b.user_phone}</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{b.booking_date}</div>
                        <div className="text-[10px] text-slate-500">{b.start_time} - {b.end_time}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 text-sm">
                        ₹{b.total_price}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {b.status === 'confirmed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Confirmed</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Cancelled</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
