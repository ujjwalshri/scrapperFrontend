import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import FoodIcon from '../components/FoodIcon';

export default function Signup() {
  const { isDarkMode } = useTheme();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantType: ''
  });
  const [errors, setErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const maxSteps = 2;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const setRestaurantType = (type) => {
    setFormState(prev => ({
      ...prev,
      restaurantType: type
    }));
    
    if (errors.restaurantType) {
      setErrors(prev => ({
        ...prev,
        restaurantType: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Name validation
    if (!formState.name) {
      newErrors.name = 'Name is required';
    } else if (formState.name.length < 4) {
      newErrors.name = 'Name must be at least 4 characters';
    }
    
    // Email validation
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!formState.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    // Restaurant name validation
    if (!formState.restaurantName) {
      newErrors.restaurantName = 'Restaurant name is required';
    }
    
    // Restaurant type validation
    if (!formState.restaurantType) {
      newErrors.restaurantType = 'Please select a restaurant type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(prev => Math.min(prev + 1, maxSteps));
      }
    } else {
      setCurrentStep(prev => Math.min(prev + 1, maxSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep2()) {
      setIsSigningUp(true);
      
      // Simulate signup
      setTimeout(() => {
        setIsSigningUp(false);
        // Navigate to dashboard or home page after signup
      }, 1500);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -right-20 top-40 w-64 h-64 rounded-full bg-accent-tertiary opacity-20 blur-xl" />
      <div className="absolute left-10 top-20 w-32 h-32 rounded-full bg-accent-primary opacity-10 blur-lg" />
      
      {/* Food icons animated */}
      <div className="hidden md:block absolute bottom-40 right-10 animate-float">
        <FoodIcon type="dessert" className="w-16 h-16" delay={0.5} />
      </div>
      <div className="hidden md:block absolute top-1/3 right-1/4 animate-float">
        <FoodIcon type="pizza" className="w-14 h-14" delay={0.8} />
      </div>
      <div className="hidden md:block absolute top-40 left-20 animate-float">
        <FoodIcon type="fries" className="w-12 h-12" delay={1.1} />
      </div>

      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block mb-4"
            >
              <FoodIcon type="chef" className="w-20 h-20" />
            </motion.div>
            <h1 className="text-4xl font-bold text-accent-primary mb-2">Create Account</h1>
            <p className="text-theme-secondary">Join MenuMaker and optimize your restaurant's menu</p>
          </div>

          <motion.div
            className="bg-theme-secondary p-8 rounded-2xl shadow-theme border border-theme relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-accent-tertiary opacity-10 blur-lg"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-accent-tertiary opacity-10 blur-lg"></div>

            {/* Progress indicator */}
            <div className="mb-8 relative">
              <div className="w-full bg-theme-tertiary h-2 rounded-full">
                <motion.div 
                  className="bg-accent-primary h-2 rounded-full"
                  initial={{ width: `${(1 / maxSteps) * 100}%` }}
                  animate={{ width: `${(currentStep / maxSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-accent-primary font-medium">Account Details</span>
                <span className={`text-xs font-medium ${currentStep >= 2 ? 'text-accent-primary' : 'text-theme-secondary'}`}>Restaurant Details</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-accent-primary mb-2 font-medium">Full Name</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 input-bg text-theme-primary border ${errors.name ? 'border-red-500' : 'border-theme'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-accent-primary mb-2 font-medium">Email</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 input-bg text-theme-primary border ${errors.email ? 'border-red-500' : 'border-theme'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-accent-primary mb-2 font-medium">Password</label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formState.password}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 input-bg text-theme-primary border ${errors.password ? 'border-red-500' : 'border-theme'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary pr-10`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-secondary hover:text-accent-primary"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-accent-primary mb-2 font-medium">Confirm Password</label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formState.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 input-bg text-theme-primary border ${errors.confirmPassword ? 'border-red-500' : 'border-theme'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary pr-10`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-secondary hover:text-accent-primary"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <label htmlFor="restaurantName" className="block text-accent-primary mb-2 font-medium">Restaurant Name</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formState.restaurantName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 input-bg text-theme-primary border ${errors.restaurantName ? 'border-red-500' : 'border-theme'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary`}
                      placeholder="Delicious Eats"
                    />
                    {errors.restaurantName && (
                      <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-accent-primary mb-2 font-medium">Restaurant Type</label>
                    {errors.restaurantType && (
                      <p className="text-red-500 text-sm mb-2">{errors.restaurantType}</p>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      {['Fine Dining', 'Casual', 'Fast Food', 'Café', 'Bistro', 'Food Truck'].map(type => (
                        <motion.button
                          key={type}
                          type="button"
                          className={`px-4 py-2 text-sm rounded-lg border ${formState.restaurantType === type ? 'bg-accent-primary text-white border-accent-primary' : 'border-theme text-theme-secondary hover:bg-accent-primary hover:text-white'}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setRestaurantType(type)}
                        >
                          {type}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <motion.button
                    type="button"
                    className="px-6 py-3 border border-theme rounded-lg text-theme-secondary hover:text-accent-primary"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                ) : (
                  <div></div> // Empty div for spacing
                )}
                
                {currentStep < maxSteps ? (
                  <motion.button
                    type="button"
                    className="px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-lg font-medium disabled:opacity-70"
                    disabled={isSigningUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSigningUp ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : 'Create Account'}
                  </motion.button>
                )}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-theme-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent-primary hover:text-accent-secondary font-medium transition-colors">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 