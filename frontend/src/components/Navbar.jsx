import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';
import LocationSelector from './LocationSelector';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // You can store this in a global state management solution if needed
    console.log('Selected location:', location);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
      setShowProfileMenu(false);
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <nav className="bg-theme-secondary border-b border-theme text-theme-primary shadow-theme sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="text-xl font-bold text-accent-primary flex items-center">
                <motion.span
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mr-2"
                >
                  🍽️
                </motion.span>
                <motion.span
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  SmartPrice
                </motion.span>
              </Link>
            </motion.div>
            
            {/* Desktop menu */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <NavLink to="/new-menu">Create Menu</NavLink>
              {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Theme toggle */}
            <div className="mr-4">
              <ThemeToggle />
            </div>
            
            {/* Profile/Auth Buttons (Desktop) */}
            <div className="hidden md:flex space-x-3">
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-accent-primary hover:text-accent-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-theme-secondary border border-theme"
                    >
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full text-left px-4 py-2 text-sm text-theme-primary hover:bg-theme-tertiary hover:text-accent-primary disabled:opacity-50 flex items-center"
                        >
                          {isLoggingOut ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-accent-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Logging out...
                            </>
                          ) : 'Logout'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      className="border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Log In
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      className="bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-theme-secondary hover:text-accent-primary hover:bg-theme-tertiary focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0, 
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-theme-secondary">
          {/* Location Selector for Mobile */}
          <div className="px-3 py-2">
            <LocationSelector onLocationSelect={handleLocationSelect} />
          </div>
          
          <MobileNavLink to="/" setIsOpen={setIsOpen}>Home</MobileNavLink>
          <MobileNavLink to="/new-menu" setIsOpen={setIsOpen}>Create Menu</MobileNavLink>
          {isAuthenticated && <MobileNavLink to="/dashboard" setIsOpen={setIsOpen}>Dashboard</MobileNavLink>}
          <MobileNavLink to="/about" setIsOpen={setIsOpen}>About</MobileNavLink>
          <MobileNavLink to="/contact" setIsOpen={setIsOpen}>Contact</MobileNavLink>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-2 mt-3 border-t border-theme space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-center border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-accent-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </>
                ) : 'Logout'}
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <motion.button
                    className="w-full text-center border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Log In
                  </motion.button>
                </Link>
                
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <motion.button
                    className="w-full text-center bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-theme-secondary hover:text-accent-primary px-2 py-1 rounded-md text-sm font-medium transition-colors relative"
    >
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className="relative"
      >
        {children}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  );
}

function MobileNavLink({ to, children, setIsOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="block text-theme-secondary hover:bg-theme-tertiary hover:text-accent-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
    >
      <motion.span
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  );
} 