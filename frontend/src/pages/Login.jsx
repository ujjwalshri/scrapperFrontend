import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import FoodIcon from '../components/FoodIcon';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formState, setFormState] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to home page if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const loginMutation = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      login(data.token); // Call the login function from AuthContext
      toast.success('Successfully logged in!');
      navigate('/'); // Redirect to home page instead of dashboard
    },
    onError: (error) => {
      // Extract the description from the error response
      const errorMessage = error.response?.data?.description || error.message || 'An error occurred during login';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
        },
      });
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    }
  });

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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;
    
    // Email validation
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formState.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      loginMutation.mutate(formState);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Toaster />
      {/* Background decorations */}
      <div className="absolute -right-20 top-40 w-64 h-64 rounded-full bg-accent-tertiary opacity-20 blur-xl" />
      <div className="absolute left-10 top-20 w-32 h-32 rounded-full bg-accent-primary opacity-10 blur-lg" />
      
      {/* Food icons animated */}
      <div className="hidden md:block absolute bottom-40 right-10 animate-float">
        <FoodIcon type="burger" className="w-16 h-16" delay={0.5} />
      </div>
      <div className="hidden md:block absolute top-1/3 right-1/4 animate-float">
        <FoodIcon type="pizza" className="w-14 h-14" delay={0.8} />
      </div>
      <div className="hidden md:block absolute top-40 left-20 animate-float">
        <FoodIcon type="drink" className="w-12 h-12" delay={1.1} />
      </div>

      <div className="max-w-md w-full">
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
            <h1 className="text-4xl font-bold text-accent-primary mb-2">Welcome Back!</h1>
            <p className="text-theme-secondary">Log in to your MenuMaker account</p>
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

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
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
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-accent-primary font-medium">Password</label>
                  <Link to="/forgot-password" className="text-sm text-accent-primary hover:text-accent-secondary transition-colors">
                    Forgot password?
                  </Link>
                </div>
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

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.submit}
                </div>
              )}
              
              <motion.button
                type="submit"
                className="w-full bg-accent-primary hover:bg-accent-secondary text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70"
                disabled={loginMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : 'Log In'}
              </motion.button>
              
              <div className="mt-8 text-center">
                <p className="text-theme-secondary">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-accent-primary hover:text-accent-secondary font-medium transition-colors">
                    Sign up
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