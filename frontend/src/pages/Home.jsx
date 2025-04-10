import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Link } from 'react-router-dom';
import AnimatedWave from '../components/AnimatedWave';
import FoodIcon from '../components/FoodIcon';
import PriceAnalysisCard from '../components/PriceAnalysisCard';

export default function Home() {
  const { isDarkMode } = useTheme();
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dishSearch, setDishSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
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

  // Mock API call to get dish pricing suggestions
  const searchDishPricing = (dish) => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Check if the dish matches any of our sample items (case insensitive)
      const matchingDish = sampleMenuItems.find(
        item => item.item.toLowerCase().includes(dish.toLowerCase())
      );
      
      if (matchingDish) {
        setSearchResult(matchingDish);
      } else {
        // Generate a mock result for any search
        setSearchResult({
          item: dish,
          category: ["Main Course", "Appetizer", "Dessert", "Beverage"][Math.floor(Math.random() * 4)],
          price: (Math.random() * 15 + 5).toFixed(2),
          recommendations: {
            competitiveness: Math.floor(Math.random() * 100),
            recommendedPrice: (Math.random() * 18 + 7).toFixed(2),
            profitImpact: Math.floor(Math.random() * 100),
            analysis: `Based on market analysis, this ${dish} could be priced more optimally to increase your profits.`
          }
        });
      }
      
      setIsSearching(false);
    }, 1500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (dishSearch.trim()) {
      searchDishPricing(dishSearch);
    }
  };

  return (
    <div ref={containerRef} className="relative bg-theme-primary text-theme-primary overflow-hidden">
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
        <div className="hidden md:block absolute top-40 left-20 animate-float">
          <FoodIcon type="fries" className="w-14 h-14" delay={1.1} />
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-accent-primary">Fresh</span> from the kitchen to your <span className="text-accent-primary">menu</span> with smart pricing
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
                <Link to="/create-menu">
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
              
              <motion.div
                className="relative max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate Optimized Menu
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dish Search Section */}
      <section className="py-20 px-4 bg-theme-primary relative overflow-hidden">
        <div className="absolute -left-20 top-40 w-40 h-40 rounded-full bg-accent-tertiary opacity-20 blur-xl" />
        <div className="absolute right-10 bottom-20 w-32 h-32 rounded-full bg-accent-primary opacity-10 blur-lg" />
        
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find the <span className="text-accent-primary">Perfect Price</span> for your Dish</h2>
            <p className="text-theme-secondary max-w-2xl mx-auto">
              Enter the name of any dish to get instant price optimization suggestions based on market data and customer preferences.
            </p>
          </motion.div>
          
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <FoodIcon type="pizza" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-accent-primary" />
                <input
                  type="text"
                  placeholder="Enter a dish name (e.g., 'Margherita Pizza')"
                  className="w-full pl-14 pr-5 py-4 rounded-lg bg-theme-secondary border border-theme focus:outline-none focus:ring-2 focus:ring-accent-primary text-theme-primary shadow-lg"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-4 rounded-lg font-medium shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Get Price Suggestion
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
          
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-theme-secondary p-6 md:p-8 rounded-xl shadow-theme border border-theme relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-accent-tertiary opacity-10 blur-lg"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-accent-tertiary opacity-10 blur-lg"></div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 border-b border-theme pb-6">
                  <div className="rounded-xl bg-accent-primary bg-opacity-20 p-4">
                    <FoodIcon 
                      type={
                        searchResult.category === "Dessert" ? "dessert" : 
                        searchResult.category === "Appetizer" ? "salad" : 
                        searchResult.category === "Beverage" ? "drink" : "burger"
                      } 
                      className="w-16 h-16"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary">{searchResult.item}</h3>
                    <div className="flex items-center mt-1">
                      <span className="bg-accent-primary bg-opacity-20 text-accent-primary px-3 py-1 rounded-full text-sm font-medium">
                        {searchResult.category}
                      </span>
                      <span className="ml-4 text-theme-secondary">Current Price: <span className="text-accent-primary font-semibold">${searchResult.price}</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-accent-primary mb-4">Price Analysis</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-theme-secondary">Market Competitiveness</span>
                          <span className="font-medium">{searchResult.recommendations.competitiveness}%</span>
                        </div>
                        <div className="w-full bg-theme-tertiary rounded-full h-2">
                          <motion.div
                            className="bg-accent-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${searchResult.recommendations.competitiveness}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-theme-secondary">Profit Impact</span>
                          <span className="font-medium">{searchResult.recommendations.profitImpact}%</span>
                        </div>
                        <div className="w-full bg-theme-tertiary rounded-full h-2">
                          <motion.div
                            className="bg-accent-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${searchResult.recommendations.profitImpact}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-accent-primary mb-4">Recommendation</h4>
                    <div className="bg-theme-tertiary p-4 rounded-lg mb-4">
                      <div className="mb-2">
                        <span className="text-theme-secondary">Recommended Price:</span>
                        <div className="text-3xl font-bold text-accent-primary mt-1">${searchResult.recommendations.recommendedPrice}</div>
                      </div>
                      
                      <div>
                        <span className="text-theme-secondary">Potential Increase:</span>
                        <motion.div 
                          className="text-xl font-medium text-accent-primary mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          +${(searchResult.recommendations.recommendedPrice - searchResult.price).toFixed(2)}
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-theme-secondary text-sm">{searchResult.recommendations.analysis}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Apply to My Menu
                  </motion.button>
                  <motion.button
                    className="border border-theme text-theme-primary hover:text-accent-primary px-6 py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Detailed Analysis
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-theme-secondary relative">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Price <span className="text-accent-primary">Analysis</span></h2>
            <p className="text-theme-secondary max-w-2xl mx-auto">
              Our intelligent price optimization engine analyzes market data to suggest the perfect price point for each menu item, maximizing your profits while staying competitive.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {sampleMenuItems.map((item, index) => (
              <PriceAnalysisCard 
                key={item.item}
                item={item.item}
                category={item.category}
                price={item.price}
                recommendations={item.recommendations}
                delay={0.2 * index}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link to="/create-menu">
              <motion.button
                className="bg-accent-primary hover:bg-accent-secondary text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your Menu Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      
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