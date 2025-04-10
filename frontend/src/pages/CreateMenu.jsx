import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';
import FoodIcon from '../components/FoodIcon';
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

// Chart options and styling
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12
        },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        family: "'Inter', sans-serif"
      },
      bodyFont: {
        size: 13,
        family: "'Inter', sans-serif"
      },
      cornerRadius: 8,
      displayColors: true
    }
  }
};

export default function CreateMenu() {
  const { isDarkMode } = useTheme();
  const [menuName, setMenuName] = useState('');
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: '', category: 'Main Course', price: '', cost: '', description: '' }
  ]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    averagePrice: 0,
    totalRevenue: 0,
    categoryDistribution: {},
    priceHistory: Array(7).fill(0).map(() => faker.number.float({ min: 10, max: 50 })),
    metrics: {
      variety: faker.number.float({ min: 0, max: 100 }),
      pricing: faker.number.float({ min: 0, max: 100 }),
      popularity: faker.number.float({ min: 0, max: 100 }),
      profitMargin: faker.number.float({ min: 0, max: 100 }),
      seasonality: faker.number.float({ min: 0, max: 100 })
    }
  });
  
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'main', name: 'Main Course' },
    { id: 'appetizer', name: 'Appetizer' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'beverage', name: 'Beverage' },
    { id: 'sides', name: 'Sides' },
  ];
  
  useEffect(() => {
    updateStats();
  }, [menuItems]);
  
  const updateStats = () => {
    const totalItems = menuItems.length;
    const totalPrice = menuItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const averagePrice = totalItems ? (totalPrice / totalItems).toFixed(2) : 0;
    const totalRevenue = totalPrice;

    const distribution = menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    // Generate new metrics based on current menu items
    const newMetrics = {
      variety: faker.number.float({ min: 0, max: 100 }),
      pricing: faker.number.float({ min: 0, max: 100 }),
      popularity: faker.number.float({ min: 0, max: 100 }),
      profitMargin: faker.number.float({ min: 0, max: 100 }),
      seasonality: faker.number.float({ min: 0, max: 100 })
    };

    setStats(prevStats => ({
      ...prevStats,
      totalItems,
      averagePrice,
      totalRevenue,
      categoryDistribution: distribution,
      metrics: newMetrics,
      priceHistory: Array(7).fill(0).map(() => faker.number.float({ min: 10, max: 50 }))
    }));
  };
  
  const addMenuItem = () => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    setMenuItems([...menuItems, { 
      id: newId, 
      name: '', 
      category: 'Main Course', 
      price: '', 
      cost: '', 
      description: '' 
    }]);
  };
  
  const removeMenuItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };
  
  const updateMenuItem = (id, field, value) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const handleGenerateMenu = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerated(true);
    setSaving(false);
  };
  
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
  
  // Chart data configurations
  const categoryChartData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [{
      data: Object.values(stats.categoryDistribution),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2
    }]
  };

  const priceHistoryData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Average Price Trend',
      data: stats.priceHistory,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.4,
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
    }]
  };

  const metricsData = {
    labels: ['Variety', 'Pricing', 'Popularity', 'Profit Margin', 'Seasonality'],
    datasets: [{
      label: 'Menu Metrics',
      data: [
        stats.metrics.variety,
        stats.metrics.pricing,
        stats.metrics.popularity,
        stats.metrics.profitMargin,
        stats.metrics.seasonality
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
    }]
  };

  const costPriceData = {
    labels: menuItems.map(item => item.name || 'Unnamed Item'),
    datasets: [
      {
        label: 'Cost',
        data: menuItems.map(item => item.cost || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Price',
        data: menuItems.map(item => item.price || 0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      {/* Header Section */}
      <div className="bg-theme-secondary py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-accent-primary">Create</span> Your Menu
          </motion.h1>
          
          <motion.div 
            className="bg-theme-tertiary p-6 rounded-lg shadow-theme border border-theme"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4">
              <label className="block text-theme-secondary text-sm font-medium mb-2" htmlFor="menuName">
                Menu Name
              </label>
              <input
                type="text"
                id="menuName"
                className="w-full px-4 py-2 rounded-md bg-theme-primary border border-theme focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., Summer Special Menu"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-theme-secondary text-sm font-medium">Restaurant Type:</span>
              {['Fine Dining', 'Casual', 'Fast Casual', 'Café', 'Bistro'].map(type => (
                <motion.button
                  key={type}
                  className="px-4 py-1 text-sm rounded-full border border-theme text-theme-secondary hover:bg-accent-primary hover:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Menu Builder Section */}
      <div className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Menu Items</h2>
            <motion.button
              className="flex items-center gap-2 bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addMenuItem}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Item
            </motion.button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeCategory === category.id 
                    ? 'bg-accent-primary text-white' 
                    : 'bg-theme-tertiary text-theme-secondary hover:bg-accent-tertiary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
          
          {/* Menu Items List */}
          <div className="space-y-4 mb-8">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 bg-theme-tertiary rounded-lg border border-theme">
                <FoodIcon type="plate" className="w-16 h-16 mx-auto mb-4 text-theme-secondary opacity-50" />
                <p className="text-theme-secondary">No items in this category. Add some!</p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-theme-secondary p-4 rounded-lg border border-theme shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-theme-secondary text-sm font-medium mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md bg-theme-tertiary border border-theme focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g., Margherita Pizza"
                        value={item.name}
                        onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-theme-secondary text-sm font-medium mb-1">
                        Category
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded-md bg-theme-tertiary border border-theme focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        value={item.category}
                        onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                      >
                        {categories.filter(cat => cat.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-theme-secondary text-sm font-medium mb-1">
                        Cost ($)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-md bg-theme-tertiary border border-theme focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="5.99"
                        value={item.cost}
                        onChange={(e) => updateMenuItem(item.id, 'cost', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-theme-secondary text-sm font-medium mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 rounded-md bg-theme-tertiary border border-theme focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="12.99"
                        value={item.price}
                        onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-theme-secondary text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md bg-theme-tertiary border border-theme focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      rows="2"
                      placeholder="Brief description of the dish..."
                      value={item.description}
                      onChange={(e) => updateMenuItem(item.id, 'description', e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <motion.button
                      className="text-accent-primary hover:text-accent-secondary"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeMenuItem(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {/* Generate Button */}
          <div className="flex justify-center my-8">
            <motion.button
              className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium shadow-lg
                ${saving ? 'bg-accent-tertiary' : 'bg-accent-primary hover:bg-accent-secondary'}`}
              whileHover={!saving ? { scale: 1.05 } : {}}
              whileTap={!saving ? { scale: 0.95 } : {}}
              onClick={handleGenerateMenu}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                  Generate Optimized Menu
                </>
              )}
            </motion.button>
          </div>
          
          {/* Results Preview (shown after generation) */}
          {generated && (
            <motion.div
              className="bg-theme-secondary p-6 rounded-lg border border-theme shadow-theme mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-accent-primary mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Price Optimization Results
              </h3>
              
              <div className="bg-theme-tertiary p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-theme-secondary">Overall Profit Increase</span>
                  <span className="text-accent-primary font-bold">+18.5%</span>
                </div>
                <div className="w-full bg-theme-primary rounded-full h-2">
                  <motion.div 
                    className="bg-accent-primary h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-theme-tertiary p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Price Adjustments</h4>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary text-sm">Items Adjusted</span>
                    <span className="font-medium">{menuItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary text-sm">Average Change</span>
                    <span className="text-accent-primary font-medium">+$2.15</span>
                  </div>
                </div>
                
                <div className="bg-theme-tertiary p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Market Analysis</h4>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary text-sm">Competitiveness</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary text-sm">Market Position</span>
                    <span className="text-accent-primary font-medium">Premium</span>
                  </div>
                </div>
                
                <div className="bg-theme-tertiary p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Customer Impact</h4>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary text-sm">Predicted Retention</span>
                    <span className="font-medium">97%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary text-sm">Value Perception</span>
                    <span className="text-accent-primary font-medium">Excellent</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <motion.button
                  className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-2 rounded-md font-medium shadow-md mr-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Recommendations
                </motion.button>
                
                <motion.button
                  className="border border-theme text-theme-primary px-6 py-2 rounded-md font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Export Menu PDF
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 