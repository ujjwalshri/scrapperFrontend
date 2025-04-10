import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch, FaSpinner } from 'react-icons/fa';

const LocationSelector = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      console.log(data);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location.display_name);
    setShowSuggestions(false);
    onLocationSelect({
      name: location.display_name,
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon)
    });
  };

  return (
    <div className="relative w-full max-w-[280px]">
      <div className="flex items-center bg-theme-primary rounded-lg shadow-sm border border-theme p-1.5">
        <FaMapMarkerAlt className="text-accent-primary text-sm ml-1" />
        <div className="relative flex-1 ml-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search location..."
            className="w-full px-2 py-1 text-sm outline-none bg-transparent text-theme-primary placeholder-theme-secondary"
          />
          {isLoading && (
            <FaSpinner className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent-primary text-sm animate-spin" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 w-full mt-1 bg-theme-primary rounded-lg shadow-lg overflow-hidden border border-theme"
          >
            {suggestions.map((location, index) => (
              <motion.div
                key={location.place_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-2 hover:bg-theme-tertiary cursor-pointer border-b border-theme last:border-b-0"
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-accent-primary text-xs mr-2" />
                  <div>
                    <p className="text-xs font-medium text-theme-primary line-clamp-1">
                      {location.display_name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 p-1.5 bg-theme-tertiary rounded-lg text-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-accent-primary text-xs mr-1.5" />
              <span className="text-theme-primary line-clamp-1">
                {selectedLocation.display_name.split(',')[0]}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedLocation(null);
                setSearchQuery('');
                onLocationSelect(null);
              }}
              className="text-[10px] text-red-500 hover:text-red-700 ml-2"
            >
              Change
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LocationSelector; 