import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Link } from 'react-router-dom';
import AnimatedWave from '../components/AnimatedWave';
import FoodIcon from '../components/FoodIcon';
import PriceAnalysisCard from '../components/PriceAnalysisCard';

export default function Home() {
  const { isDarkMode } = useTheme();
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for menu items..."
                    className="w-full px-5 py-3 pr-12 rounded-full bg-theme-secondary border border-theme focus:outline-none focus:ring-2 focus:ring-accent-primary text-theme-primary shadow-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-primary" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      animate={{ 
                        rotate: isTyping ? [0, 15, -15, 0] : 0,
                        scale: isTyping ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </motion.svg>
                  </div>
                </div>
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