import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Car,
  Users,
  TrendingUp,
  Bell,
  Plus,
  Filter,
  Search
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import BookingForm from '../components/BookingForm';
import BookingCard from '../components/BookingCard';
import VendorRequestCard from '../components/VendorRequestCard';

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [liveRequests, setLiveRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  useEffect(() => {
    if (user) {
      // Initialize sample bookings
      const sampleBookings = [
        {
          id: 'BK001',
          guestName: 'John Doe',
          guestPhone: '+1-555-0123',
          pickupLocation: '123 Business Center, Downtown',
          dropoffLocation: 'Airport Terminal 1',
          date: '2025-01-15',
          time: '14:30',
          carCategory: 'sedan',
          status: 'confirmed',
          companyName: 'TechCorp Inc.',
          driverName: 'Mike Johnson'
        },
        {
          id: 'BK002',
          guestName: 'Sarah Wilson',
          guestPhone: '+1-555-0124',
          pickupLocation: 'Hotel Grand Plaza',
          dropoffLocation: '456 Corporate Ave',
          date: '2025-01-16',
          time: '09:00',
          carCategory: 'suv',
          status: 'ongoing',
          companyName: 'Global Solutions',
          driverName: 'David Smith'
        }
      ];

      const sampleRequests = user.role === 'vendor' ? [
        {
          id: 'REQ001',
          guestName: 'Alice Brown',
          guestPhone: '+1-555-0125',
          pickupLocation: 'Central Station',
          dropoffLocation: 'Business District',
          date: '2025-01-15',
          time: '16:00',
          carCategory: 'luxury',
          companyName: 'Enterprise Corp',
          slaMinutes: 15
        }
      ] : [];

      setBookings(sampleBookings);
      setLiveRequests(sampleRequests);
    }
  }, [user]);

  const handleLogin = (role, email) => {
    setUser({ role, email, name: email.split('@')[0] });
    toast.success(`Welcome! Logged in as ${role}`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    toast.info('Logged out successfully');
  };

  const handleBookingSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newBooking = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        ...data,
        status: 'pending',
        companyName: user.email.split('@')[0]
      };

      setBookings(prev => [newBooking, ...prev]);
      toast.success('Booking request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit booking request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    toast.success(`Booking ${bookingId} status updated to ${newStatus}`);
  };

  const handleRequestAction = (requestId, action) => {
    setLiveRequests(prev => prev.filter(req => req.id !== requestId));

    if (action === 'accept') {
      const request = liveRequests.find(req => req.id === requestId);
      if (request) {
        const newBooking = {
          ...request,
          id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
          status: 'confirmed'
        };
        setBookings(prev => [newBooking, ...prev]);
      }
      toast.success('Request accepted successfully!');
    } else if (action === 'reject') {
      toast.info('Request rejected');
    } else if (action === 'openmarket') {
      toast.info('Request moved to open market');
    }
  };

  const getFilteredBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    return filtered;
  };

  const getStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const ongoing = bookings.filter(b => b.status === 'ongoing').length;
    const completed = bookings.filter(b => b.status === 'completed').length;

    return { total, pending, ongoing, completed };
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const stats = getStats();
  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userRole={user.role}
        onLogout={handleLogout}
        currentUser={user.name}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {user.role === 'company' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-['Lato'] ${activeTab === 'dashboard'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('book')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-['Lato'] ${activeTab === 'book'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Book Cab
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-['Lato'] ${activeTab === 'bookings'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  My Bookings
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-['Lato'] ${activeTab === 'dashboard'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-['Lato'] relative ${activeTab === 'requests'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Live Requests
                  {liveRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {liveRequests.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-['Lato'] ${activeTab === 'bookings'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  All Bookings
                </button>
              </>
            )}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Car className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-['Lato']">
                          Total Bookings
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 font-['Poppins']">
                          {stats.total}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-['Lato']">
                          Pending
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 font-['Poppins']">
                          {stats.pending}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-['Lato']">
                          Ongoing
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 font-['Poppins']">
                          {stats.ongoing}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-['Lato']">
                          Completed
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 font-['Poppins']">
                          {stats.completed}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Poppins']">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 font-['Lato']">
                          Booking {booking.id} - {booking.guestName}
                        </p>
                        <p className="text-sm text-gray-500 font-['Lato']">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                              booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'book' && user.role === 'company' && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookingForm onSubmit={handleBookingSubmit} isSubmitting={isSubmitting} />
            </motion.div>
          )}

          {activeTab === 'requests' && user.role === 'vendor' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="h-5 w-5 text-indigo-700" />
                  <h2 className="text-xl font-semibold text-gray-900 font-['Poppins']">
                    Live Booking Requests
                  </h2>
                </div>
                {liveRequests.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 font-['Poppins']">
                      No live requests
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-['Lato']">
                      New booking requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liveRequests.map((request) => (
                      <VendorRequestCard
                        key={request.id}
                        request={request}
                        onAccept={(id) => handleRequestAction(id, 'accept')}
                        onReject={(id) => handleRequestAction(id, 'reject')}
                        onOpenMarket={(id) => handleRequestAction(id, 'openmarket')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 font-['Poppins']">
                    {user.role === 'company' ? 'My Bookings' : 'All Bookings'}
                  </h2>
                  <div className="mt-4 sm:mt-0 flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-['Lato']"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-['Lato']"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Car className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 font-['Poppins']">
                      No bookings found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-['Lato']">
                      {user.role === 'company'
                        ? 'Start by creating your first booking.'
                        : 'Bookings will appear here once you accept requests.'
                      }
                    </p>
                    {user.role === 'company' && (
                      <div className="mt-6">
                        <button
                          onClick={() => setActiveTab('book')}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-['Lato']"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Book New Cab
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onStatusChange={handleStatusChange}
                        userRole={user.role}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Home;