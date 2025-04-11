import { motion } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';

export default function About() {
  const { isDarkMode } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-bold text-accent-primary mb-6"
          >
            About Us
          </motion.h1>

          <motion.div 
            className="bg-theme-secondary rounded-lg shadow-lg p-6 mb-8 border border-theme"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-accent-primary mb-4">Our Mission</h2>
            <p className="text-theme-secondary">
            At SmartPrice, we’re transforming the way restaurants design their menus by bringing real-time market intelligence to the table. Our platform analyzes nearby restaurant pricing to help you make smarter, data-driven decisions. Whether you're launching a new dish or updating your pricing strategy, SmartMenu gives you instant insights into local trends, helping you stay competitive, maximize profitability, and better serve your customers. It’s like having a pricing strategist in your pocket — simple, smart, and always up-to-date.
            </p>
          </motion.div>

          <motion.div 
            className="bg-theme-secondary rounded-lg shadow-lg p-6 border border-theme"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-accent-primary mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TeamMember 
                name="Ujjwal Shrivastava"
                role="Developer"
              />
              <TeamMember 
                name="Tushar Sharma"
                role="Developer"
              />
              <TeamMember 
                name="Akash"
                role="Developer"
              />
              <TeamMember 
                name="Rohan jha"
                role="Developer"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TeamMember({ name, role, image }) {
  return (
    <motion.div 
      className="bg-theme-tertiary p-4 rounded-lg text-center border border-theme"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <img 
        src={image} 
        alt={name} 
        className="rounded-full w-24 h-24 object-cover mx-auto mb-4 border-2 border-accent-primary"
      />
      <h3 className="font-semibold text-lg text-accent-primary">{name}</h3>
      <p className="text-theme-secondary">{role}</p>
    </motion.div>
  );
} 