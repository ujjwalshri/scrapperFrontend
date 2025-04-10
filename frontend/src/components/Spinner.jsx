import { motion } from 'framer-motion';

export default function Spinner() {
  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.5, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="relative w-16 h-16"
      variants={containerVariants}
      animate="animate"
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-accent-primary rounded-full"
          style={{
            top: '50%',
            left: '50%',
            margin: '-6px 0 0 -6px',
            transform: `rotate(${i * 60}deg) translate(0, -16px)`
          }}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          custom={i * 0.1}
        />
      ))}
    </motion.div>
  );
} 