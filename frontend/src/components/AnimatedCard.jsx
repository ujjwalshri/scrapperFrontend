import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function AnimatedCard() {
  return (
    <motion.div 
      className="w-full max-w-md bg-theme-secondary rounded-xl shadow-lg overflow-hidden border border-theme"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-6">
        <motion.h2 
          className="text-2xl font-bold text-accent-primary mb-3"
          variants={itemVariants}
        >
          Framer Motion + Tailwind
        </motion.h2>
        
        <motion.div
          className="h-1 w-16 bg-accent-primary mb-4"
          variants={itemVariants}
        />
        
        <motion.p 
          className="text-theme-secondary mb-4"
          variants={itemVariants}
        >
          This component demonstrates how to combine Framer Motion animations with Tailwind CSS styling.
        </motion.p>
        
        <motion.div 
          className="flex space-x-2"
          variants={itemVariants}
        >
          <motion.span 
            className="px-2 py-1 bg-theme-tertiary text-accent-primary rounded-md text-sm"
            whileHover={{ scale: 1.1 }}
          >
            Animation
          </motion.span>
          <motion.span 
            className="px-2 py-1 bg-theme-tertiary text-accent-primary rounded-md text-sm"
            whileHover={{ scale: 1.1 }}
          >
            Tailwind
          </motion.span>
          <motion.span 
            className="px-2 py-1 bg-theme-tertiary text-accent-primary rounded-md text-sm"
            whileHover={{ scale: 1.1 }}
          >
            React
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
} 