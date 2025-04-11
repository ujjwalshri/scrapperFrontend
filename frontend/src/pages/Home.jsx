import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedWave from '../components/AnimatedWave';
import FoodIcon from '../components/FoodIcon';
import PriceAnalysisCard from '../components/PriceAnalysisCard';
import LocationSelector from '../components/LocationSelector';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { scrapperService } from '../services/scrapper.service';
import toast, { Toaster } from 'react-hot-toast';
// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dishSearch, setDishSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Add state for chart data
  const [distanceChartData, setDistanceChartData] = useState(null);
  const [ratingChartData, setRatingChartData] = useState(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Restaurant search mutation using TanStack Query
  const restaurantSearchMutation = useMutation({
    mutationFn: (searchParams) => scrapperService.searchRestaurants(searchParams),
    onSuccess: (data) => {
      console.log('Search successful:', data);
      setSearchResult(data.data);
      console.log('Search result:', data.data);
      toast.success(`Found restaurant data for ${dishSearch}`);
    },
    onError: (error) => {
      console.error('Search error:', error);
      toast.error(error.response?.data?.description || error.message || 'Error searching for restaurants');
      setSearchResult(null);
    }
  });
  
  // Effect to prepare chart data when search results change
  useEffect(() => {
    if (searchResult?.data?.analytics) {
      const analytics = searchResult.data.analytics;
      
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
      }
    }
  }, [searchResult]);

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
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          callback: (value) => `₹${value}`
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
        title: {
          display: true,
          text: 'Distance (km)',
          font: {
            size: 14,
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
        title: {
          display: true,
          text: 'Rating (out of 5)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };

  // Sample menu items with price analysis
  const sampleMenuItems = [
    {
      item: "Classic Burger",
      category: "Main Course",
      price: 12.99,
      recommendations: {
        competitiveness: 75,
        recommendedPrice: 14.99,
        profitImpact: 90,
        analysis: "This item is priced competitively but could be increased by $2 without affecting demand, enhancing your profit margins."
      }
    },
    {
      item: "Caesar Salad",
      category: "Appetizer",
      price: 8.99,
      recommendations: {
        competitiveness: 45,
        recommendedPrice: 10.49,
        profitImpact: 65,
        analysis: "This salad is priced below market average. A $1.50 increase would align with competitors while boosting your margins."
      }
    },
    {
      item: "Chocolate Cake",
      category: "Dessert",
      price: 7.49,
      recommendations: {
        competitiveness: 88,
        recommendedPrice: 7.99,
        profitImpact: 78,
        analysis: "This dessert is priced well for the market. A slight increase is possible but would have minimal impact on overall profit."
      }
    }
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('Selected location:', location);
    // You can use the location data here for your application logic
    // location will have: name, lat, lon, type, country, city, state, postcode
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!dishSearch.trim()) {
      toast.error('Please enter a dish name');
      return;
    }
    
    if (!selectedLocation || !selectedLocation.lat || !selectedLocation.lon) {
      toast.error('Please select a location');
      return;
    }
    
    // Call the mutation with search parameters
    // Ensure values are properly formatted for URL query parameters
    restaurantSearchMutation.mutate({
      dishName: dishSearch.trim(),
      latitude: parseFloat(selectedLocation.lat),
      longitude: parseFloat(selectedLocation.lon)
    });
  };

  // Use the fallback data if the API is not ready
  const useBackupData = (result) => {
    if (result) return result;
    
    if (!dishSearch) return null;
    
    // Check if the dish matches any of our sample items (case insensitive)
    const matchingDish = sampleMenuItems.find(
      item => item.item.toLowerCase().includes(dishSearch.toLowerCase())
    );
    
    if (matchingDish) {
      return {
        restaurants: [{
          name: 'Sample Restaurant',
          menuItems: [{ 
            name: matchingDish.item,
            price: matchingDish.price
          }]
        }],
        stats: matchingDish.recommendations
      };
    }
    
    return null;
  };

  // Compute the display result (either API result or fallback)
  const displayResult = useBackupData(searchResult);

  const features = [
    {
      icon: '🎨',
      title: 'Beautiful Templates',
      description: 'Choose from dozens of professionally designed templates',
    },
    {
      icon: '📱',
      title: 'Fully Responsive',
      description: 'Menus look great on any device, from phones to desktops',
    },
    {
      icon: '🔄',
      title: 'Easy Updates',
      description: 'Change prices, add items, or update descriptions with ease',
    },
  ];

  return (
    <div ref={containerRef} className="relative bg-theme-primary text-theme-primary overflow-hidden">
      <Toaster />
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Background decorations */}
        <AnimatedWave position="bottom" height={200} />
        
        <div className="absolute -right-20 top-40 w-64 h-64 rounded-full bg-accent-tertiary opacity-20 blur-xl" />
        <div className="absolute left-10 top-20 w-32 h-32 rounded-full bg-accent-primary opacity-10 blur-lg" />
        
        {/* Food icons animated */}
        <div className="hidden md:block absolute bottom-40 right-10 animate-float">
          <FoodIcon type="burger" className="w-20 h-20" delay={0.5} />
        </div>
        <div className="hidden md:block absolute top-1/3 right-1/4 animate-float">
          <FoodIcon type="salad" className="w-16 h-16" delay={0.8} />
        </div>
        <div className="hidden md:block absolute top-10 left-20 animate-float">
          <FoodIcon type="fries" className="w-14 h-14" delay={1.1} />
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-accent-primary">Your Menu,</span> Optimized. <span className="text-accent-primary">Fresh </span>Smart Prices
              </motion.h1>
              
              <motion.p 
                className="text-theme-secondary text-lg mb-8 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Create beautifully designed menus with smart price optimization that boosts your restaurant's profits while staying competitive in the market.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link to="/new-menu">
                  <motion.button
                    className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Menu
                  </motion.button>
                </Link>
                
                <motion.button
                  className="border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
                  onClick={() => window.location.href = '/about'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
              
             
            </div>
            
            <div className="order-1 md:order-2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-accent-tertiary rounded-full blur-lg opacity-70"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-accent-tertiary rounded-full blur-lg opacity-70"></div>
                
                <div className="relative bg-theme-secondary shadow-theme rounded-xl overflow-hidden border border-theme p-4 w-full max-w-md">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white text-xl mr-3">
                      <FoodIcon type="chef" className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-theme-primary">Smart Menu Maker</h3>
                      <p className="text-theme-secondary text-sm">Price optimization engine</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {['Burger', 'Salad', 'Fries', 'Dessert'].map((item, index) => (
                      <motion.div 
                        key={item} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                      >
                        <div className="w-6 h-6 rounded-full bg-accent-primary bg-opacity-20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-theme-primary">{item} price optimized</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="bg-theme-tertiary rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-theme-secondary text-sm">Price Improvement</span>
                      <span className="text-accent-primary font-medium">+24%</span>
                    </div>
                    <div className="w-full bg-theme-secondary rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-accent-primary h-full"
                        initial={{ width: 0 }}
                        animate={{ width: '72%' }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-accent-primary hover:bg-accent-secondary text-white rounded-lg py-3 font-medium shadow-md"
                  >
                    Generate Optimized Menu
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-primary mb-4">Search for Dish Pricing</h2>
            <p className="text-theme-secondary max-w-3xl mx-auto">
              Enter a dish name and your location to find competitive pricing information from restaurants in your area.
            </p>
          </div>
          
          <div className="bg-theme-secondary shadow-theme rounded-xl p-6 border border-theme">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="dish-search" className="block text-theme-primary font-medium mb-2">Dish Name</label>
                <input
                  type="text"
                  id="dish-search"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="e.g. Burger, Pizza, Pasta..."
                  className="w-full px-4 py-3 rounded-lg bg-theme-primary text-theme-primary border border-theme focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              
              <div>
                <label className="block text-theme-primary font-medium mb-2">Location</label>
                <LocationSelector onLocationSelect={handleLocationSelect} className="w-full" />
              </div>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                onClick={handleSearch}
                disabled={restaurantSearchMutation.isPending}
                className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg disabled:opacity-70 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {restaurantSearchMutation.isPending ? (
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
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Search results - Only displayed after fetch */}
      {searchResult && searchResult.data && searchResult.data.analytics && (
        <section className="py-16 px-4 bg-theme-tertiary bg-opacity-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-accent-primary mb-4">Results for "{dishSearch}"</h2>
              <p className="text-theme-secondary max-w-3xl mx-auto">
                Here's what we found about pricing for this dish in your area.
              </p>
            </div>
            
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Min Price Card */}
              <div className="bg-theme-secondary shadow-theme rounded-xl p-6 border border-theme">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-theme-primary mb-1">Lowest Price</h3>
                  <p className="text-3xl font-bold text-accent-primary mb-2">
                    {formatPrice(searchResult.data.analytics.min.price)}
                  </p>
                  <p className="text-theme-secondary text-sm text-center">
                    {searchResult.data.analytics.min.name} • {searchResult.data.analytics.min.locality}
                  </p>
                  <div className="flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-theme-primary">{searchResult.data.analytics.min.avgRating}</span>
                    <span className="ml-2 text-theme-secondary">•</span>
                    <span className="ml-2 text-theme-secondary">{searchResult.data.analytics.min.deliveryTime} mins</span>
                  </div>
                </div>
              </div>
              
              {/* Average Price Card */}
              <div className="bg-theme-secondary shadow-theme rounded-xl p-6 border border-theme">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-theme-primary mb-1">Average Price</h3>
                  <p className="text-3xl font-bold text-accent-primary mb-2">
                    {formatPrice(searchResult.data.analytics.avgPrice)}
                  </p>
                  <p className="text-theme-secondary text-sm text-center">
                    Based on nearby restaurants
                  </p>
                  <div className="w-full bg-theme-tertiary rounded-full h-2 mt-3">
                    <div 
                      className="bg-accent-primary h-full rounded-full" 
                      style={{ 
                        width: `${(searchResult.data.analytics.avgPrice / searchResult.data.analytics.max.price) * 100}%` 
                      }}
                    ></div>
                    <p className="text-theme-secondary text-sm text-center">average price compared to the highest price</p>
                  </div>
                </div>
              </div>
              
              {/* Max Price Card */}
              <div className="bg-theme-secondary shadow-theme rounded-xl p-6 border border-theme">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-theme-primary mb-1">Highest Price</h3>
                  <p className="text-3xl font-bold text-accent-primary mb-2">
                    {formatPrice(searchResult.data.analytics.max.price)}
                  </p>
                  <p className="text-theme-secondary text-sm text-center">
                    {searchResult.data.analytics.max.name} • {searchResult.data.analytics.max.locality}
                  </p>
                  <div className="flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-theme-primary">{searchResult.data.analytics.max.avgRating}</span>
                    <span className="ml-2 text-theme-secondary">•</span>
                    <span className="ml-2 text-theme-secondary">{searchResult.data.analytics.max.deliveryTime} mins</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price vs Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Price vs Distance Chart */}
              <div className="bg-theme-secondary shadow-theme rounded-xl p-6 border border-theme">
                <h3 className="text-xl font-bold text-theme-primary mb-4">Price vs Distance</h3>
                <div className="h-80 pb-4">
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
                <div className="h-80 pb-4">
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
                {searchResult.data.cards && searchResult.data.cards.map((restaurant, index) => (
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
                          e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant+Image';
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
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-theme-primary text-lg truncate">{restaurant.name}</h4>
                      
                      {restaurant.ratings && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-theme-secondary text-sm">Total Ratings</span>
                            <span className="text-theme-primary font-medium">{restaurant.ratings.ratingCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

  
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-theme-primary">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-accent-primary">Customers</span> Say</h2>
            <p className="text-theme-secondary max-w-2xl mx-auto">
              Restaurant owners across the country are boosting profits with our menu price optimization.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "John Smith",
                role: "Restaurant Owner",
                content: "MenuMaker's price analysis helped me increase my restaurant's profit by 22% in just two months without losing any customers.",
                avatar: "JS"
              },
              {
                name: "Sarah Johnson",
                role: "Café Manager",
                content: "The price optimization suggestions were spot-on! We adjusted our menu prices and saw immediate improvements in our bottom line.",
                avatar: "SJ"
              },
              {
                name: "Michael Chen",
                role: "Fine Dining Owner",
                content: "I was skeptical at first, but the data-driven approach to menu pricing has completely transformed how we position our offerings.",
                avatar: "MC"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-theme-secondary p-6 rounded-lg shadow-theme border border-theme"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent-primary text-white flex items-center justify-center font-bold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-theme-primary">{testimonial.name}</h3>
                    <p className="text-theme-secondary text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-theme-secondary">"{testimonial.content}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 