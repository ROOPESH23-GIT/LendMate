import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

import HomePage from './pages/HomePage';
import BrowseSpacesPage from './pages/BrowseSpacesPage';
import SpaceDetailsPage from './pages/SpaceDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AddSpacePage from './pages/AddSpacePage';
import LoginPage from './pages/LoginPage';

function MainApp() {
  const { currentUser, isOwner } = useAuth();
  
  const [activePage, setActivePage] = useState('home');
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [browseCategory, setBrowseCategory] = useState('All');
  
  // Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [modalSpace, setModalSpace] = useState(null);

  // Cached spaces list for home page
  const [spaces, setSpaces] = useState([]);

  const loadSpaces = async () => {
    try {
      const res = await fetch('/api/spaces');
      if (res.ok) {
        const data = await res.json();
        setSpaces(data);
      }
    } catch (err) {
      console.error('Failed to load initial spaces', err);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  // Listen to hash changes for quick navigation (e.g. #my-bookings)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'browse', 'my-bookings', 'owner-dashboard', 'add-space', 'login'].includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectSpace = (space) => {
    setSelectedSpaceId(space.id);
    setActivePage('space-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = (space) => {
    setModalSpace(space);
    setBookingModalOpen(true);
  };

  const handleCategorySelect = (category) => {
    setBrowseCategory(category);
    setActivePage('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSpaceCreated = (newSpace) => {
    loadSpaces();
    setActivePage('owner-dashboard');
  };

  const handleBookingSuccess = (booking) => {
    // Optionally trigger feedback or reload
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAddSpace={() => {
          setActivePage('add-space');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            spaces={spaces}
            onSelectSpace={handleSelectSpace}
            onBookNow={handleBookNow}
            onNavigateToBrowse={() => {
              setBrowseCategory('All');
              setActivePage('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCategorySelect={handleCategorySelect}
            onOpenAddSpace={() => {
              setActivePage('add-space');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'browse' && (
          <BrowseSpacesPage
            onSelectSpace={handleSelectSpace}
            onBookNow={handleBookNow}
            initialCategory={browseCategory}
            onCategoryChange={(cat) => setBrowseCategory(cat)}
          />
        )}

        {activePage === 'space-details' && (
          <SpaceDetailsPage
            spaceId={selectedSpaceId}
            onBack={() => {
              setActivePage('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookingSuccess={handleBookingSuccess}
            onNavigateToMyBookings={() => {
              setActivePage('my-bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'my-bookings' && (
          <MyBookingsPage
            onNavigateToBrowse={() => {
              setBrowseCategory('All');
              setActivePage('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'owner-dashboard' && (
          <OwnerDashboardPage
            onOpenAddSpace={() => {
              setActivePage('add-space');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSpace={handleSelectSpace}
          />
        )}

        {activePage === 'add-space' && (
          <AddSpacePage
            onBack={() => {
              setActivePage('owner-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSpaceCreated={handleSpaceCreated}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onLoginSuccess={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Booking Modal */}
      <BookingModal
        space={modalSpace}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBookingSuccess={(booking) => {
          handleBookingSuccess(booking);
          loadSpaces();
        }}
      />

      {/* Startup Footer */}
      <Footer
        onCategoryClick={handleCategorySelect}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
