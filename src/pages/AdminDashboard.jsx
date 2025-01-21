import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from '@/components/admin/HomePage';
import InfoPage from '@/components/admin/InfoPage';
import OrdersPage from '@/components/admin/OrdersPage';
import { Button } from '@/components/ui/button';
import { UserData } from '@/context/UserContext';
import { Home, Info, MenuIcon, ShoppingBag, X } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = UserData();

  // Redirect if user is not an admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  // Renders the content of the selected page
  const renderPageContent = () => {
    switch (selectedPage) {
      case 'home':
        return <HomePage />;
      case 'orders':
        return <OrdersPage />;
      case 'info':
        return <InfoPage />;
      default:
        return <HomePage />;
    }
  };

  // Handle navigation and close the sidebar
  const handleNavigation = (page) => {
    setSelectedPage(page);
    setSidebarOpen(false); // Close the sidebar after navigating
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 h-full shadow-lg transition-transform duration-300 bg-background-50 border-b backdrop-blur z-50`}
      >
        {/* Overlay for small screens */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="flex flex-col h-full p-4">
          <h1 className="text-lg font-bold mb-4">Admin Panel</h1>
          <div className="space-y-4">
            {/* Home Button */}
            <Button
              variant="ghost"
              onClick={() => handleNavigation('home')}
              className={`w-full flex items-center gap-2 ${
                selectedPage === 'home' ? 'bg-gray-500' : ''
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </Button>

            {/* Orders Button */}
            <Button
              variant="ghost"
              onClick={() => handleNavigation('orders')}
              className={`w-full flex items-center gap-2 ${
                selectedPage === 'orders' ? 'bg-gray-500' : ''
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </Button>

            {/* Info Button */}
            <Button
              variant="ghost"
              onClick={() => handleNavigation('info')}
              className={`w-full flex items-center gap-2 ${
                selectedPage === 'info' ? 'bg-gray-500' : ''
              }`}
            >
              <Info className="w-5 h-5" />
              Info
            </Button>

            {/* Close Button for Small Screens */}
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="shadow p-4 flex items-center justify-between lg:justify-end">
          {/* Menu Button for Small Screens */}
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-bold hidden lg:block">Admin Dashboard</h2>
        </div>

        {/* Page Content */}
        <div className="p-4">{renderPageContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
