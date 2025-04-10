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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet justo ut quam 
              faucibus fermentum vel nec nibh. Sed venenatis justo a nisi efficitur bibendum. 
              Vestibulum sodales nunc vitae lorem lobortis, vel eleifend justo finibus. 
              Cras sodales, nisl a sodales sollicitudin, tellus risus rhoncus tortor, ac faucibus 
              felis nibh nec justo.
            </p>
          </motion.div>

          <motion.div 
            className="bg-theme-secondary rounded-lg shadow-lg p-6 border border-theme"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-accent-primary mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TeamMember 
                name="John Doe"
                role="CEO"
                image="https://via.placeholder.com/150"
              />
              <TeamMember 
                name="Jane Smith"
                role="CTO"
                image="https://via.placeholder.com/150"
              />
              <TeamMember 
                name="Alex Johnson"
                role="Designer"
                image="https://via.placeholder.com/150"
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