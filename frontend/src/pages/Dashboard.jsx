import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { menuService } from '../services/menu.service';

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMenuId, setExpandedMenuId] = useState(null);
  const [buttonCooldowns, setButtonCooldowns] = useState({});
  const cooldownTimersRef = useRef({});

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await menuService.getAllMenusForUser();
        console.log('Menu Response:', response);
        if (response && response.data) {
          setMenus(response.data || []);
        } else {
          setError('Failed to load menus - invalid data format');
        }
      } catch (err) {
        console.error('Error fetching menus:', err);
        setError('Failed to load your menus. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Quick links for dashboard navigation
  const quickLinks = [
    {
      title: 'Create Menu',
      description: 'Design and customize a new menu',
      icon: '📝',
      path: '/new-menu',
      color: 'bg-green-100 dark:bg-green-800'
    }
  ];

  // Get menu type label
  const getMenuTypeLabel = (type) => {
    const menuTypes = {
      'regular': 'Regular',
      'breakfast': 'Breakfast',
      'lunch': 'Lunch',
      'dinner': 'Dinner',
      'snack': 'Snack',
      'special': 'Special',
      'dessert': 'Dessert',
    };
    return menuTypes[type] || type;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Toggle menu expansion
  const toggleMenuExpansion = (menuId) => {
    if (expandedMenuId === menuId) {
      setExpandedMenuId(null);
    } else {
      setExpandedMenuId(menuId);
    }
  };

  // Handle report generation with cooldown
  const handleGenerateReport = (menuId) => {
    // Skip if already in cooldown
    if (buttonCooldowns[menuId]) return;
    
    // Call the service
    menuService.generateReport(menuId);
    
    // Set cooldown for this menu
    setButtonCooldowns(prev => ({...prev, [menuId]: true}));
    
    // Start a timer to reset the cooldown after 60 seconds
    cooldownTimersRef.current[menuId] = setTimeout(() => {
      setButtonCooldowns(prev => ({...prev, [menuId]: false}));
    }, 60000); // 1 minute cooldown
  };
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(cooldownTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-accent-primary mb-2">Welcome to your Dashboard</h1>
          <p className="text-theme-secondary max-w-3xl">
            Manage your menus and access all your MenuMaker features from this central hub.
          </p>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={link.path} className="block">
                <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-theme-tertiary' : 'bg-white'} hover:shadow-lg transition-shadow`}>
                  <div className={`w-12 h-12 ${link.color} rounded-full flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{link.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-theme-primary">{link.title}</h3>
                  <p className="text-theme-secondary">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Your Menus section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-theme-tertiary' : 'bg-white'} mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-theme-primary">Your Menus</h2>
            <Link to="/new-menu">
              <button className="bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Create New
              </button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-md text-red-500">
              {error}
            </div>
          ) : menus.length === 0 ? (
            <div className="p-4 border border-theme rounded-md bg-theme-secondary bg-opacity-5">
              <p className="text-theme-secondary">You haven't created any menus yet. Get started by clicking "Create Menu"!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {menus.map((menu) => (
                <motion.div 
                  key={menu._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border border-theme rounded-xl overflow-hidden ${isDarkMode ? 'bg-theme-tertiary' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow`}
                >
                  {/* Menu Header */}
                  <div 
                    className={`p-5 cursor-pointer ${expandedMenuId === menu._id ? 'border-b border-theme' : ''}`}
                    onClick={() => toggleMenuExpansion(menu._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold text-xl">{menu.name}</h3>
                          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                            menu.type === 'lunch' || menu.type === 'dinner' ? 'bg-green-100 text-green-800' : 
                            menu.type === 'breakfast' ? 'bg-blue-100 text-blue-800' :
                            menu.type === 'snack' ? 'bg-yellow-100 text-yellow-800' :
                            menu.type === 'special' ? 'bg-purple-100 text-purple-800' :
                            menu.type === 'dessert' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getMenuTypeLabel(menu.type)}
                          </span>
                        </div>
                        <p className="text-theme-secondary text-sm mt-2">{menu.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xs text-theme-secondary">Created</p>
                          <p className="text-sm font-medium">{formatDate(menu.createdAt)}</p>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 bg-theme-secondary bg-opacity-10 rounded-full">
                          <svg 
                            className={`w-4 h-4 transform transition-transform ${expandedMenuId === menu._id ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <div className="flex items-center bg-theme-secondary bg-opacity-10 rounded-full px-3 py-1">
                        <svg className="w-4 h-4 mr-1 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="text-xs font-medium">
                          {Array.isArray(menu.items) ? menu.items.length : 0} items
                        </span>
                      </div>
                      
                      <div className="ml-auto">
                        <Link to={`/menu/${menu._id}`} className="text-accent-primary hover:text-accent-secondary text-sm font-medium mr-4 transition-colors">
                          View
                        </Link>
                        <button
                          onClick={() => handleGenerateReport(menu._id)}
                          disabled={buttonCooldowns[menu._id]}
                          className={`text-sm font-medium mr-4 transition-colors ${
                            buttonCooldowns[menu._id] 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-accent-primary hover:text-accent-secondary cursor-pointer'
                          }`}
                        >
                          {buttonCooldowns[menu._id] ? 'Processing...' : 'Get Reports'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items (Expanded View) */}
                  {expandedMenuId === menu._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      {Array.isArray(menu.items) && menu.items.length > 0 ? (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-theme-secondary mb-3">Menu Items</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {menu.items.map((item, index) => (
                              <div 
                                key={item._id || index} 
                                className="bg-theme-primary p-4 rounded-lg border border-theme border-opacity-20"
                              >
                                <div className="flex justify-between">
                                  <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                                    <h5 className="font-medium">{item.name}</h5>
                                  </div>
                                  <div className="font-bold text-accent-primary">
                                    {formatPrice(item.price)}
                                  </div>
                                </div>
                                <p className="text-sm text-theme-secondary mt-2">{item.description}</p>
                                <div className="mt-2">
                                  <span className="inline-block bg-theme-secondary bg-opacity-10 text-theme-secondary text-xs px-2 py-1 rounded">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-theme-secondary text-sm italic">
                          This menu has no items yet. <Link to={`/menu/${menu._id}`} className="text-accent-primary font-medium">Add some!</Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Get started section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary p-8 text-white"
        >
          <div className="md:flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to create your next menu?</h2>
              <p className="mb-4 md:mb-0 opacity-90">Design beautiful custom menus with our easy-to-use editor.</p>
            </div>
            <Link to="/new-menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-accent-primary font-medium px-6 py-3 rounded-full shadow-md"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 