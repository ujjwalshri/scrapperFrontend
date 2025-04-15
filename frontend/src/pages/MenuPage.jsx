import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';
import { menuService } from '../services/menu.service';
import { scrapperService } from '../services/scrapper.service';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [currentMenu, setCurrentMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    isVeg: true,
    category: 'main course'
  });
  
  // Chart data states
  const [distanceChartData, setDistanceChartData] = useState(null);
  const [ratingChartData, setRatingChartData] = useState(null);
  
  const menuTypes = [
    { id: 'regular', name: 'Regular' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snack', name: 'Snack' },
    { id: 'special', name: 'Special' },
    { id: 'dessert', name: 'Dessert' },
  ];
  
  const itemCategories = [
    { id: 'starter', name: 'Starter' },
    { id: 'main course', name: 'Main Course' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'beverage', name: 'Beverage' },
    { id: 'snack', name: 'Snack' },
    { id: 'special', name: 'Special' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Fetch menu data on component mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await menuService.getMenu(id);
        setCurrentMenu(response.data);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      if (currentMenu && currentMenu.location) {
        const result = await scrapperService.searchRestaurants({
          dishName: searchQuery.trim(),
          latitude: currentMenu.location.lat,
          longitude: currentMenu.location.lon
        });
        setSearchResults(result.data);
      } else {
        // Use default location if menu doesn't have location
        const result = await scrapperService.searchRestaurants({
          dishName: searchQuery.trim(),
          latitude: 12.9716,  // Default Bangalore coordinates
          longitude: 77.5946
        });
        setSearchResults(result.data);
      }
    } catch (err) {
      console.error('Error searching for restaurants:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddItemClick = (dish) => {
    setSelectedDish(dish);
    setNewMenuItem({
      ...newMenuItem,
      name: dish?.item || searchQuery,
      price: dish?.price/100 ? parseFloat(dish.price/100) : '',
    });
    setShowAddItemModal(true);
  };

  const handleAddMenuItem = async () => {
    try {
      if (!currentMenu) return;

      // Validate required fields
      if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price) {
        return; // Show validation error
      }

      const itemData = {
        name: newMenuItem.name,
        description: newMenuItem.description,
        price: parseFloat(newMenuItem.price),
        isVeg: newMenuItem.isVeg,
        category: newMenuItem.category,
      };

      await menuService.addMenuItem(currentMenu._id, itemData);
      
      // Reset form and close modal
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        isVeg: true,
        category: 'main course'
      });
      setShowAddItemModal(false);
      
      // Fetch updated menu to reflect changes
      const response = await menuService.getMenu(currentMenu._id);
      setCurrentMenu(response.data);
      
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };

  // Handle menu item deletion
  const handleDeleteMenuItem = async (itemId) => {
    try {
      if (!currentMenu) return;
      
      // Confirm before deleting
      if (!window.confirm('Are you sure you want to delete this menu item?')) {
        return;
      }
      
      await menuService.deleteMenuItem(currentMenu._id, itemId);
      
      // Fetch updated menu to reflect changes
      const response = await menuService.getMenu(currentMenu._id);
      setCurrentMenu(response.data);
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  // Format currency for display
  const formatPrice = (price) => {
    return (price/100).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `Price: ₹${context.parsed.y}`;
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (₹)',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: {
            bottom: 10
          }
        },
        ticks: {
          callback: (value) => `₹${value}`,
          font: {
            size: 12
          },
          padding: 8
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.15)',
          drawBorder: false
        },
        beginAtZero: true
      },
      x: {
        ticks: {
          font: {
            size: 12
          },
          padding: 8
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.3
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  // Distance chart specific options
  const distanceChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: 'Distance (km)',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: {
            top: 10
          }
        }
      }
    }
  };

  // Rating chart specific options
  const ratingChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: 'Rating (out of 5)',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: {
            top: 10
          }
        }
      }
    }
  };

  // Effect to prepare chart data when search results change
  useEffect(() => {
    if (searchResults?.data?.analytics) {
      const analytics = searchResults.data.analytics;
      
      // Prepare Price vs Distance data
      if (analytics.priceVSdistance && analytics.priceVSdistance.length > 0) {
        // Create coordinates array for distance chart
        const distanceCoords = analytics.priceVSdistance.map(item => ({
          x: item.distance, 
          y: item.price / 100 // Converting to base currency unit
        }));
        
        // Log coordinates to console
        console.log('Price vs Distance Coordinates:', distanceCoords);
        
        // Sort by distance for line chart
        distanceCoords.sort((a, b) => a.x - b.x);
        
        // Prepare chart dataset for Line chart
        setDistanceChartData({
          labels: distanceCoords.map(item => item.x.toFixed(1)),
          datasets: [{
            label: 'Price by Distance',
            data: distanceCoords.map(item => item.y),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: false,
            tension: 0.1,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        });
      } else if (searchResults.data.cards) {
        // Fallback if priceVSdistance isn't available
        const distanceData = searchResults.data.cards.map(restaurant => ({
          distance: restaurant.distance || Math.random() * 8,
          price: restaurant.price / 100 // Converting to base currency unit
        }));
        
        distanceData.sort((a, b) => a.distance - b.distance);
        
        setDistanceChartData({
          labels: distanceData.map(item => item.distance.toFixed(1)),
          datasets: [{
            label: 'Price by Distance',
            data: distanceData.map(item => item.price),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: false,
            tension: 0.1,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        });
      }
      
      // Prepare Price vs Rating data
      if (analytics.priceVSrating && analytics.priceVSrating.length > 0) {
        // Create coordinates array for rating chart
        const ratingCoords = analytics.priceVSrating.map(item => ({
          x: item.rating,
          y: item.price / 100 // Converting to base currency unit
        }));
        
        // Log coordinates to console
        console.log('Price vs Rating Coordinates:', ratingCoords);
        
        // Sort by rating for line chart
        ratingCoords.sort((a, b) => a.x - b.x);
        
        // Group by ratings and calculate average prices for each rating
        const ratingGroups = {};
        ratingCoords.forEach(item => {
          const rating = item.x.toFixed(1);
          if (!ratingGroups[rating]) {
            ratingGroups[rating] = {
              sum: item.y,
              count: 1
            };
          } else {
            ratingGroups[rating].sum += item.y;
            ratingGroups[rating].count++;
          }
        });
        
        const labels = Object.keys(ratingGroups).sort((a, b) => parseFloat(a) - parseFloat(b));
        const averagePrices = labels.map(rating => ratingGroups[rating].sum / ratingGroups[rating].count);
        
        // Prepare chart dataset for Line chart
        setRatingChartData({
          labels: labels,
          datasets: [{
            label: 'Average Price by Rating',
            data: averagePrices,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: false,
            tension: 0.1,
            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        });
      } else if (searchResults.data.cards) {
        // Fallback if priceVSrating isn't available
        // Group restaurants by rating and calculate average price
        const ratingGroups = {};
        searchResults.data.cards.forEach(restaurant => {
          const rating = restaurant.avgRating ? Math.floor(restaurant.avgRating * 2) / 2 : 4; // Round to nearest 0.5
          if (!ratingGroups[rating]) {
            ratingGroups[rating] = { total: 0, count: 0 };
          }
          ratingGroups[rating].total += restaurant.price / 100; // Converting to base currency unit
          ratingGroups[rating].count += 1;
        });
        
        const ratings = Object.keys(ratingGroups).sort((a, b) => parseFloat(a) - parseFloat(b));
        const averagePrices = ratings.map(rating => 
          ratingGroups[rating].total / ratingGroups[rating].count
        );
        
        setRatingChartData({
          labels: ratings,
          datasets: [{
            label: 'Average Price by Rating',
            data: averagePrices,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: false,
            tension: 0.1,
            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        });
      }
    }
  }, [searchResults]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-theme-secondary">Loading your menu...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-theme-secondary rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Menu</h2>
          <p className="text-theme-secondary mb-6">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Menu not found state
  if (!currentMenu) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-theme-secondary rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Menu Not Found</h2>
          <p className="text-theme-secondary mb-6">The requested menu could not be found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-theme-primary text-theme-primary transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="w-full px-2 py-4">
        {/* Menu Details and Search */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Side - Menu Details */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-3 rounded-xl p-6 shadow-lg h-[calc(100vh-120px)] overflow-hidden flex flex-col ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="mb-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`p-4 rounded-lg mb-4 ${
                  isDarkMode 
                    ? 'bg-indigo-900 bg-opacity-30 border-l-4 border-indigo-500' 
                    : 'bg-indigo-50 border-l-4 border-indigo-500'
                }`}
              >
                <h2 className="text-2xl font-bold mb-2">{currentMenu.name}</h2>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentMenu.description}
                </p>
                <div className="inline-block bg-accent-primary text-white text-xs px-2 py-1 rounded-full">
                  {menuTypes.find(t => t.id === currentMenu.type)?.name || currentMenu.type}
                </div>
              </motion.div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Menu Items</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
                }`}>
                  {currentMenu.items?.length || 0} items
                </span>
              </div>
              
              {/* Menu Items List */}
              {currentMenu.items && currentMenu.items.length > 0 && (
                <motion.div 
                  variants={containerVariants}
                  className="space-y-4 mb-6"
                >
                  {currentMenu.items.map((item) => (
                    <motion.div 
                      key={item._id} 
                      variants={itemVariants}
                      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      className={`p-4 rounded-lg shadow-sm border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                            <h4 className="font-medium">{item.name}</h4>
                          </div>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {item.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-accent-primary font-medium">{item.price}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                              isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteMenuItem(item._id)}
                          className={`text-red-500 hover:text-red-700 p-1 rounded-full ${
                            isDarkMode ? 'hover:bg-red-900' : 'hover:bg-red-50'
                          }`}
                          title="Delete item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {/* Add Menu Item Form - Always visible */}
              <motion.div 
                variants={fadeInVariants}
                className={`rounded-lg p-4 shadow-sm mb-4 mx-auto w-full ${
                  isDarkMode 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <h4 className={`font-medium text-center mb-4 border-b pb-2 ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>Add Menu Item</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                      className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Item name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                      className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={newMenuItem.category}
                      onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                      className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {itemCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newMenuItem.isVeg}
                        onChange={(e) => setNewMenuItem({...newMenuItem, isVeg: e.target.checked})}
                        className="mr-2 text-accent-primary focus:ring-accent-primary rounded"
                      />
                      <span>Vegetarian</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                      className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Item description"
                      rows="2"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddMenuItem}
                    className="w-full py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium transition-colors shadow-md"
                  >
                    Add to Menu
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Search */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-9 rounded-xl p-6 shadow-lg h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
              Smart Pricing Analytics
            </h2>
            
            {/* Search Bar */}
            <motion.div 
              whileHover={{ y: -2 }}
              className={`rounded-xl p-6 border mb-8 shadow-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Dish Name</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Burger, Pizza, Pasta..."
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-primary transition-shadow ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a dish to analyze competitive pricing</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        {currentMenu.location ? (
                          <div>
                            <p className="font-medium">{currentMenu.location.name}</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Coordinates: {currentMenu.location.lat.toFixed(6)}, {currentMenu.location.lon.toFixed(6)}
                            </p>
                          </div>
                        ) : (
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Using default location (Bangalore)</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={searching}
                  className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg disabled:opacity-70 flex items-center transition-transform"
                >
                  {searching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Market Prices...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      Analyze Competitive Prices
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
            
            {/* Search Results - Only continue with results animation and styling where needed */}
            <AnimatePresence>
              {searchResults && searchResults.data && searchResults.data.analytics && Object.keys(searchResults.data.analytics).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <motion.h1 
                    variants={itemVariants}
                    className="text-5xl font-bold text-accent-primary mb-6"
                  >
                    Results for "{searchQuery}"
                  </motion.h1>
                  
                  {/* Top Stats Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Min Price Card */}
                    <div className="bg-theme-primary shadow-theme rounded-xl p-6 border border-theme">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-theme-primary mb-1">Lowest Market Price</h3>
                        <p className="text-3xl font-bold text-accent-primary mb-2">
                          {formatPrice(searchResults.data.analytics.min.price)}
                        </p>
                        <p className="text-theme-secondary text-sm text-center">
                          {searchResults.data.analytics.min.name} • {searchResults.data.analytics.min.locality}
                        </p>
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-theme-primary">{searchResults.data.analytics.min.avgRating}</span>
                          <span className="ml-2 text-theme-secondary">•</span>
                          <span className="ml-2 text-theme-secondary">{searchResults.data.analytics.min.deliveryTime} mins</span>
                        </div>
                        <p className="text-theme-secondary text-xs mt-3">Market floor - potential underpricing risk</p>
                      </div>
                    </div>
                    
                    {/* Average Price Card */}
                    <div className="bg-theme-primary shadow-theme rounded-xl p-6 border border-theme">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-theme-primary mb-1">Market Average</h3>
                        <p className="text-3xl font-bold text-accent-primary mb-2">
                          {formatPrice(searchResults.data.analytics.avgPrice)}
                        </p>
                        <p className="text-theme-secondary text-sm text-center">
                          Competitive pricing benchmark
                        </p>
                        <div className="w-full bg-theme-tertiary rounded-full h-2 mt-3">
                          <div 
                            className="bg-accent-primary h-full rounded-full" 
                            style={{ 
                              width: `${(searchResults.data.analytics.avgPrice / searchResults.data.analytics.max.price) * 100}%` 
                            }}
                          ></div>
                          <p className="text-theme-secondary text-xs text-center mt-1">Relative position in market range</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Max Price Card */}
                    <div className="bg-theme-primary shadow-theme rounded-xl p-6 border border-theme">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-theme-primary mb-1">Premium Price Point</h3>
                        <p className="text-3xl font-bold text-accent-primary mb-2">
                          {formatPrice(searchResults.data.analytics.max.price)}
                        </p>
                        <p className="text-theme-secondary text-sm text-center">
                          {searchResults.data.analytics.max.name} • {searchResults.data.analytics.max.locality}
                        </p>
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-theme-primary">{searchResults.data.analytics.max.avgRating}</span>
                          <span className="ml-2 text-theme-secondary">•</span>
                          <span className="ml-2 text-theme-secondary">{searchResults.data.analytics.max.deliveryTime} mins</span>
                        </div>
                        <p className="text-theme-secondary text-xs mt-3">Market ceiling - premium positioning</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Charts Section */}
                  <div className="flex flex-col space-y-8 mb-12">
                    {/* Price vs Distance Chart - Full Width */}
                    <div className="bg-theme-secondary shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 border border-theme w-full">
                      <h3 className="text-xl font-bold text-theme-primary mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Price vs Distance Analysis
                      </h3>
                      <div className="h-96 bg-theme-primary bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                        {distanceChartData && (
                          <Line
                            data={{
                              ...distanceChartData,
                              datasets: distanceChartData.datasets.map(dataset => ({
                                ...dataset,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                fill: true,
                                borderWidth: 2
                              }))
                            }}
                            options={distanceChartOptions}
                          />
                        )}
                        <p className="text-sm text-theme-secondary text-center mt-6 font-medium">
                          Geographic pricing distribution - optimize based on your location
                        </p>
                      </div>
                    </div>
                    
                    {/* Price vs Rating Chart - Below First Chart */}
                    <div className="bg-theme-secondary shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 border border-theme w-full">
                      <h3 className="text-xl font-bold text-theme-primary mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Price vs Rating Correlation
                      </h3>
                      <div className="h-96 bg-theme-primary bg-opacity-50 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                        {ratingChartData && (
                          <Line
                            data={{
                              ...ratingChartData,
                              datasets: ratingChartData.datasets.map(dataset => ({
                                ...dataset,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)', 
                                borderColor: 'rgba(153, 102, 255, 1)',
                                fill: true,
                                borderWidth: 2
                              }))
                            }}
                            options={ratingChartOptions}
                          />
                        )}
                        <p className="text-sm text-theme-secondary text-center mt-6 font-medium">
                          Perceived value analysis - balance price with quality perception
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Restaurant Cards */}
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary mb-6">Competitor Analysis</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.data.cards && searchResults.data.cards.map((restaurant, index) => (
                        <motion.div
                          key={index}
                          className="bg-theme-secondary shadow-theme rounded-xl overflow-hidden border border-theme"
                          whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleAddItemClick(restaurant)}
                        >
                          <div className="h-48 overflow-hidden relative">
                            <img 
                              src={restaurant.imageId} 
                              alt={restaurant.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189d30f57d1%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189d30f57d1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.5%22%20y%3D%22107.1%22%3ERestaurant%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                                e.target.onerror = null;
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                              <div className="flex items-center">
                                <span className="bg-white text-black px-2 py-1 rounded text-sm font-bold">
                                  {formatPrice(restaurant.price)}
                                </span>
                                {restaurant.ratings && (
                                  <div className="ml-auto bg-green-600 text-white px-2 py-1 rounded flex items-center">
                                    <span className="text-sm font-bold">{restaurant.ratings.rating}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <h4 className="text-white font-bold mt-2">{restaurant.name}</h4>
                              <p className="text-white text-sm opacity-80">{restaurant.locality || ''}</p>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg> */}
                                <span className="text-theme-primary font-medium">{restaurant.avgRating }</span>
                              </div>
                              {restaurant.ratings && restaurant.ratings.ratingCount && (
                                <span className="text-theme-secondary text-sm">
                                  {restaurant.ratings.ratingCount}
                                </span>
                              )}
                            </div>
                            {restaurant.cuisines && (
                              <p className="text-theme-secondary text-sm mt-2 line-clamp-1">
                                {Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(', ') : restaurant.cuisines}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-accent-primary">Click to add with competitive pricing</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Add custom styled scrollbar in <style> tag */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1f2937' : '#f3f4f6'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#6b7280' : '#9ca3af'};
        }
      `}</style>
    </div>
  );
}