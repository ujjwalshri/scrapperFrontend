import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';
import FoodIcon from '../components/FoodIcon';
import LocationSelector from '../components/LocationSelector';
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
  const [selectedLocation, setSelectedLocation] = useState(null);
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
  
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('Selected location:', location);
  };
  
  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Menu Creation */}
          <div className="bg-theme-secondary rounded-xl p-6 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Create Your Menu</h2>
              {/* Menu Name Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Menu Name</label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter menu name..."
                />
              </div>
              <LocationSelector onLocationSelect={handleLocationSelect} />

              {/* Menu Items */}
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="bg-theme-primary p-4 rounded-lg shadow-sm"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Item Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300"
                          placeholder="Item name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300"
                          placeholder="Price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cost</label>
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => updateMenuItem(item.id, 'cost', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300"
                          placeholder="Cost"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateMenuItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300"
                          placeholder="Item description"
                          rows="2"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeMenuItem(item.id)}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Item
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                onClick={addMenuItem}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                + Add Menu Item
              </button>

              {/* Generate Menu Button */}
              <button
                onClick={handleGenerateMenu}
                disabled={saving}
                className="mt-6 w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Generating...' : 'Generate Menu'}
              </button>
            </div>
          </div>

          {/* Right Side - Stats and Analysis */}
          <div className="bg-theme-secondary rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Menu Analytics</h2>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-theme-primary p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <div className="bg-theme-primary p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
                <p className="text-2xl font-bold">${stats.averagePrice}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-8">
              {/* Category Distribution */}
              <div className="h-64">
                <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
                <Doughnut data={categoryChartData} options={chartOptions} />
              </div>

              {/* Price History */}
              <div className="h-64">
                <h3 className="text-lg font-medium mb-4">Price Trend</h3>
                <Line data={priceHistoryData} options={chartOptions} />
              </div>

              {/* Menu Metrics */}
              <div className="h-64">
                <h3 className="text-lg font-medium mb-4">Menu Performance Metrics</h3>
                <Radar data={metricsData} options={chartOptions} />
              </div>

              {/* Cost vs Price Analysis */}
              <div className="h-64">
                <h3 className="text-lg font-medium mb-4">Cost vs Price Analysis</h3>
                <Bar data={costPriceData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 