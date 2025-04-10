import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from './ThemeContext';

export default function PriceAnalysisCard({ item, category, price, recommendations, delay = 0 }) {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay,
        duration: 0.5
      }
    },
    hover: {
      y: -5,
      boxShadow: isDarkMode 
        ? "0 10px 25px -5px rgba(249, 115, 22, 0.3)" 
        : "0 10px 25px -5px rgba(249, 115, 22, 0.2)",
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    closed: { 
      height: 0, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const getGaugeColor = (value) => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const recommendedPrice = recommendations?.recommendedPrice || (parseFloat(price) + 2).toFixed(2);
  const priceDifference = recommendedPrice - price;
  const profitImpact = recommendations?.profitImpact || 85;

  return (
    <motion.div
      className="bg-theme-secondary rounded-lg shadow-theme overflow-hidden border border-theme"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-theme-primary">{item}</h3>
          <span className="bg-accent-primary text-white px-2 py-1 rounded text-sm">
            ${price}
          </span>
        </div>
        
        <div className="text-theme-secondary text-sm mb-3">
          {category}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-theme-secondary mb-1">
            <span>Current price competitiveness</span>
            <span>{recommendations?.competitiveness || 68}%</span>
          </div>
          <div className="w-full bg-theme-tertiary rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-full ${getGaugeColor(recommendations?.competitiveness || 68)}`}
              initial={{ width: 0 }}
              animate={{ width: `${recommendations?.competitiveness || 68}%` }}
              transition={{ duration: 0.8, delay: delay + 0.3 }}
            />
          </div>
        </div>
        
        <motion.button
          className="w-full flex items-center justify-between text-accent-primary text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.98 }}
        >
          <span>Price analysis</span>
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </motion.svg>
        </motion.button>
        
        <motion.div
          className="overflow-hidden"
          variants={contentVariants}
          initial="closed"
          animate={isExpanded ? "open" : "closed"}
        >
          <div className="pt-4 space-y-4">
            <motion.div variants={itemVariants} className="flex justify-between items-center">
              <span className="text-theme-secondary text-sm">Recommended price:</span>
              <span className="font-medium text-accent-primary">${recommendedPrice}</span>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-between items-center">
              <span className="text-theme-secondary text-sm">Potential profit increase:</span>
              <span className={priceDifference > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {priceDifference > 0 ? '+' : ''}{priceDifference.toFixed(2)}
              </span>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex justify-between text-xs text-theme-secondary mb-1">
                <span>Profit impact</span>
                <span>{profitImpact}%</span>
              </div>
              <div className="w-full bg-theme-tertiary rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${profitImpact}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-sm text-theme-secondary">
              <p className="mb-2">Analysis:</p>
              <p>{recommendations?.analysis || "This item's price could be optimized to increase profit margins while staying competitive in the market."}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 