import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';
import FoodIcon from '../components/FoodIcon';
import LocationSelector from '../components/LocationSelector';
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
import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

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

export default function CreateMenu() {
  const { isDarkMode } = useTheme();
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuType, setMenuType] = useState('regular');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [created, setCreated] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
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

  const handleCreateMenu = async () => {
    try {
      setError(null);
      
      if (!menuName || !menuDescription || !menuType) {
        setError('Please fill in all required fields');
        return;
      }
      
      const menuData = {
        name: menuName,
        description: menuDescription,
        type: menuType,
      };
      
      const response = await menuService.createMenu(menuData);
      setCurrentMenu(response.data);
      setCreated(true);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu');
      console.error('Error creating menu:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      if (selectedLocation) {
        const result = await scrapperService.searchRestaurants({
          dishName: searchQuery.trim(),
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lon
        });
        setSearchResults(result.data);
      } else {
        // Use default location if none selected
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
      price: dish?.price ? parseFloat(dish.price) : '',
    });
    setShowAddItemModal(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
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

  // Format currency for display
  const formatPrice = (price) => {
    return (price / 100).toLocaleString('en-IN', {
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
          boxWidth: 10,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Price: ₹${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (₹)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          callback: (value) => `₹${value}`,
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
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
            size: 12,
            weight: 'bold'
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
            size: 12,
            weight: 'bold'
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

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      <div className="container mx-auto px-4 py-8">
        {!created ? (
          // Menu Creation Form
          <div className="max-w-2xl mx-auto bg-theme-secondary rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Create Your Menu</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Menu Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Menu Name *</label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter menu name..."
                />
              </div>
              
              {/* Menu Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Menu Type *</label>
                <select
                  value={menuType}
                  onChange={(e) => setMenuType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {menuTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Menu Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Menu Description *</label>
                <textarea
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter menu description..."
                  rows="3"
                />
              </div>
            </div>
            
            <button
              onClick={handleCreateMenu}
              className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Menu
            </button>
          </div>
        ) : (
          // Menu Details and Search
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Menu Details */}
            <div className="lg:col-span-1 bg-theme-secondary rounded-xl p-6 shadow-lg h-[calc(100vh-120px)] overflow-hidden flex flex-col">
              <div className="mb-6">
                <div className="bg-accent-primary bg-opacity-10 p-4 rounded-lg border-l-4 border-accent-primary mb-4">
                  <h2 className="text-2xl font-bold mb-2">{currentMenu.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{currentMenu.description}</p>
                  <div className="inline-block bg-accent-primary text-white text-xs px-2 py-1 rounded-full">
                    {menuTypes.find(t => t.id === currentMenu.type)?.name || currentMenu.type}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Menu Items</h3>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {currentMenu.items?.length || 0} items
                  </span>
                </div>
                
                {/* Menu Items List */}
                {currentMenu.items && currentMenu.items.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {currentMenu.items.map((item) => (
                      <div key={item._id} className="bg-theme-primary p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                              <h4 className="font-medium">{item.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-accent-primary font-medium">{formatPrice(item.price)}</span>
                              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add Menu Item Form - Always visible */}
                <div className="bg-theme-primary rounded-lg p-6 shadow-sm border border-gray-100 mb-4">
                  <h4 className="font-medium text-center mb-4 border-b pb-2">Add Menu Item</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Item Name *</label>
                      <input
                        type="text"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300"
                        placeholder="Item name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Price *</label>
                      <input
                        type="number"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300"
                        placeholder="Price"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category *</label>
                      <select
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300"
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
                          className="mr-2"
                        />
                        <span>Vegetarian</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300"
                        placeholder="Item description"
                        rows="2"
                      />
                    </div>
                    
                    <button
                      onClick={handleAddMenuItem}
                      className="w-full py-2 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium transition-colors"
                    >
                      Add to Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Search */}
            <div className="lg:col-span-2 bg-theme-secondary rounded-xl p-6 shadow-lg h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Add Items to Menu</h2>
              
              {/* Search Bar */}
              <div className="bg-theme-primary shadow-theme rounded-xl p-6 border border-theme mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dish Name</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Burger, Pizza, Pasta..."
                      className="w-full px-4 py-3 rounded-lg bg-theme-primary text-theme-primary border border-theme focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <LocationSelector onLocationSelect={handleLocationSelect} className="w-full" />
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg disabled:opacity-70 flex items-center"
                  >
                    {searching ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </>
                    ) : (
                      'Search Restaurants'
                    )}
                  </button>
                </div>
              </div>
              
              {/* Search Results */}
              {searchResults && searchResults.data && searchResults.data.analytics && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4">Results for "{searchQuery}"</h3>
                  
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
                        <h3 className="text-xl font-bold text-theme-primary mb-1">Lowest Price</h3>
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
                        <h3 className="text-xl font-bold text-theme-primary mb-1">Average Price</h3>
                        <p className="text-3xl font-bold text-accent-primary mb-2">
                          {formatPrice(searchResults.data.analytics.avgPrice)}
                        </p>
                        <p className="text-theme-secondary text-sm text-center">
                          Based on nearby restaurants
                        </p>
                        <div className="w-full bg-theme-tertiary rounded-full h-2 mt-3">
                          <div 
                            className="bg-accent-primary h-full rounded-full" 
                            style={{ 
                              width: `${(searchResults.data.analytics.avgPrice / searchResults.data.analytics.max.price) * 100}%` 
                            }}
                          ></div>
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
                        <h3 className="text-xl font-bold text-theme-primary mb-1">Highest Price</h3>
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
                      </div>
                    </div>
                  </div>
                  
                  {/* Charts Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Price vs Distance Chart */}
                    <div className="bg-theme-secondary shadow-theme rounded-xl py-18 px-2 border border-theme">
                      <h3 className="text-xl font-bold text-theme-primary mb-4">Price vs Distance</h3>
                      <div className="h-80">
                        {distanceChartData && (
                          <Line
                            data={distanceChartData}
                            options={distanceChartOptions}
                          />
                        )}
                        <p className="text-sm text-theme-secondary text-center mt-2">
                          Shows how prices vary with distance from your location
                        </p>
                      </div>
                    </div>
                    
                    {/* Price vs Rating Chart */}
                    <div className="bg-theme-secondary shadow-theme rounded-xl p-6 border border-theme">
                      <h3 className="text-xl font-bold text-theme-primary mb-4">Price vs Rating</h3>
                      <div className="h-80">
                        {ratingChartData && (
                          <Line
                            data={ratingChartData}
                            options={ratingChartOptions}
                          />
                        )}
                        <p className="text-sm text-theme-secondary text-center mt-2">
                          Shows average prices for each rating level
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Restaurant Cards */}
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary mb-6">Top Restaurants</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.data.cards && searchResults.data.cards.map((restaurant, index) => (
                        <motion.div
                          key={index}
                          className="bg-theme-secondary shadow-theme rounded-xl overflow-hidden border border-theme"
                          whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="h-48 overflow-hidden relative">
                            <img 
                              src={restaurant.imageId} 
                              alt={restaurant.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Prevent continuous requests by setting a data URI instead of an external URL
                                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189d30f57d1%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189d30f57d1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.5%22%20y%3D%22107.1%22%3ERestaurant%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                                e.target.onerror = null; // Remove the handler to prevent potential loop
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-theme-primary font-medium">{restaurant.avgRating || '—'}</span>
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
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}