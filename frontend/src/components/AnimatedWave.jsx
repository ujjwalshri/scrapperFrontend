import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

export default function AnimatedWave({ position = "bottom", height = 100 }) {
  const { isDarkMode } = useTheme();
  
  const waveVariants = {
    initial: { 
      opacity: 0,
      y: position === 'top' ? -20 : 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1
      }
    }
  };
  
  return (
    <div className={`absolute ${position}-0 left-0 w-full overflow-hidden z-0 pointer-events-none`} style={{ height: `${height}px` }}>
      <motion.svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        variants={waveVariants}
        initial="initial"
        animate="animate"
      >
        <motion.path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={isDarkMode ? '#111827' : '#ffffff'}
          initial={{ 
            d: "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
          }}
          animate={{
            d: ["M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
              "M321.39,76.44c58-10.79,114.16-40.13,172-41.86,82.39-2.72,168.19-7.73,250.45,9.61C823.78,61,906.67,92,985.66,102.83c70.05,9.48,146.53,6.09,214.34-7V0H0V27.35A600.21,600.21,0,0,0,321.39,76.44Z",
              "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </div>
  );
} 