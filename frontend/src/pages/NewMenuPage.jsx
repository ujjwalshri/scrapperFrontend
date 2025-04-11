import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { menuService } from '../services/menu.service';
import LocationSelector from '../components/LocationSelector';

export default function NewMenuPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuType, setMenuType] = useState('regular');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const menuTypes = [
    { id: 'regular', name: 'Regular' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snack', name: 'Snack' },
    { id: 'special', name: 'Special' },
    { id: 'dessert', name: 'Dessert' },
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleCreateMenu = async () => {
    try {
      setError(null);
      setIsCreating(true);
      
      if (!menuName || !menuDescription || !menuType) {
        setError('Please fill in all required fields');
        setIsCreating(false);
        return;
      }
      
      if (!selectedLocation) {
        setError('Please select a location for your menu');
        setIsCreating(false);
        return;
      }
      
      const menuData = {
        name: menuName,
        description: menuDescription,
        type: menuType,
        location: {
          name: selectedLocation.name,
          lat: selectedLocation.lat,
          lon: selectedLocation.lon
        }
      };
      console.log(menuData);
      const response = await menuService.createMenu(menuData);
      // Redirect to the menu detail page with the ID
      navigate(`/menu/${response.data._id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu');
      console.error('Error creating menu:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-2xl mx-auto bg-theme-secondary rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Create Your Menu</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Menu Name *</label>
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-primary"
                placeholder="Enter menu name..."
              />
            </div>
            
            {/* Menu Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Menu Type *</label>
              <select
                value={menuType}
                onChange={(e) => setMenuType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-primary"
              >
                {menuTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Location Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <LocationSelector onLocationSelect={handleLocationSelect} />
              {selectedLocation && (
                <div className="mt-2 p-2 bg-accent-primary bg-opacity-10 rounded-lg text-sm">
                  <span className="font-medium">Selected location:</span> {selectedLocation.name}
                </div>
              )}
            </div>
            
            {/* Menu Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Menu Description *</label>
              <textarea
                value={menuDescription}
                onChange={(e) => setMenuDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-theme-primary"
                placeholder="Enter menu description..."
                rows="4"
              />
            </div>
          </div>
          
          <motion.button
            onClick={handleCreateMenu}
            disabled={isCreating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full bg-accent-primary hover:bg-accent-secondary text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Menu...
              </>
            ) : 'Create Menu'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 