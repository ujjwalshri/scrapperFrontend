import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const FoodIcon = ({ type, className, delay = 0 }) => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.5,
        duration: 0.8,
        delay: delay
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'burger':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#FFB636" d="M8 28h48v8H8z"/>
            <path fill="#ED7161" d="M8 36h48v4H8z"/>
            <path fill="#3E4347" d="M12 20h40v8H12z"/>
            <path fill="#94989B" d="M10 32h44v8H10z"/>
            <path fill="#FFD882" d="M12 20c0-4.4 8.8-8 20-8s20 3.6 20 8H12z"/>
            <path fill="#89664C" d="M12 40h40v4H12z"/>
            <path fill="#FFD882" d="M14 44c0 2.2-1.8 4-4 4s-4-1.8-4-4h8zm44 0c0 2.2-1.8 4-4 4s-4-1.8-4-4h8z"/>
          </svg>
        );
      case 'salad':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#83BF4F" d="M32 8c14.6 0 16 10 16 10H16s1.4-10 16-10z"/>
            <path fill="#75A843" d="M16 18h32v3H16z"/>
            <path fill="#F2F2F2" d="M16 21h32v6H16z"/>
            <path fill="#75A843" d="M32 8c4 0 9.4 2.6 12.4 6.5-2.2-2.7-6-4.5-12.4-4.5-6.4 0-10.2 1.8-12.4 4.5C22.6 10.6 28 8 32 8z"/>
            <path fill="#ED7161" d="M26 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
            <path fill="#75A843" d="M32 33c-14.6 0-16-10-16-10h32s-1.4 10-16 10z"/>
          </svg>
        );
      case 'fries':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#ED7161" d="M18 14h28v16H18z"/>
            <path fill="#FFD882" d="M16 30h32v20H16z"/>
            <path fill="#FFE8B6" d="M22 20v26m6-23v23m6-26v26m6-23v23"/>
            <path fill="#FFB636" d="M20 30h2v20h-2zm8 0h2v20h-2zm8 0h2v20h-2zm8 0h2v20h-2z"/>
          </svg>
        );
      case 'chef':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#F0F0F0" d="M20 38h24v20H20z"/>
            <circle fill="#FFB636" cx="32" cy="20" r="12"/>
            <path fill="#FFFFFF" d="M26 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
            <path fill="#942A32" d="M32 28c-3.3 0-6-2.7-6-6h12c0 3.3-2.7 6-6 6z"/>
            <path fill="#F0F0F0" d="M18 36c0-2 1-4 2-4h24c1 0 2 2 2 4H18z"/>
            <path fill="#3E4347" d="M38 36v-4h4v4h-4z"/>
          </svg>
        );
      case 'pizza':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#FFD882" d="M8 32C8 16 32 8 32 8s24 8 24 24L32 56 8 32z"/>
            <path fill="#ED7161" d="M12 32c0-12 20-18 20-18s20 6 20 18l-20 18-20-18z"/>
            <path fill="#FFB636" d="M16 32c0-8 16-12 16-12s16 4 16 12l-16 12-16-12z"/>
            <circle fill="#83BF4F" cx="24" cy="28" r="2"/>
            <circle fill="#83BF4F" cx="32" cy="20" r="2"/>
            <circle fill="#83BF4F" cx="40" cy="30" r="2"/>
            <circle fill="#ED7161" cx="32" cy="30" r="3"/>
            <path fill="#89664C" d="M26 36a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm16-8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
          </svg>
        );
      case 'drink':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#3E4347" d="M24 8h16v4H24z"/>
            <path fill="#94989B" d="M22 12h20l-2 8H24z"/>
            <path fill="#7FDBDC" d="M24 20h16l-2 32H26z"/>
            <path fill="#C7F4F6" d="M38 24H26l-1 4h14z"/>
            <path fill="#E8E8E8" d="M26 52h12v4H26z"/>
            <path fill="#F0F0F0" d="M28 56h8c1.1 0 2 .9 2 2v2H26v-2c0-1.1.9-2 2-2z"/>
          </svg>
        );
      case 'dessert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <path fill="#D3976E" d="M16 32v12c0 4.4 7.2 8 16 8s16-3.6 16-8V32H16z"/>
            <path fill="#89664C" d="M16 32h32c0 4.4-7.2 8-16 8s-16-3.6-16-8z"/>
            <path fill="#FFD3B6" d="M20 36c0 2.2 5.4 4 12 4s12-1.8 12-4H20z"/>
            <path fill="#ED7161" d="M32 12c-6.6 0-12 1.8-12 4v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8c0-2.2-5.4-4-12-4z"/>
            <path fill="#FF8C66" d="M20 16c0 2.2 5.4 4 12 4s12-1.8 12-4H20z"/>
            <path fill="#F0F0F0" d="M32 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-5 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            <path fill="#E8513D" d="M22 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        );
      case 'plate':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <ellipse fill="#E8E8E8" cx="32" cy="40" rx="20" ry="8"/>
            <ellipse fill="#F2F2F2" cx="32" cy="36" rx="16" ry="12"/>
            <path fill="#D3D3D3" d="M32 48c-9.9 0-18-3.4-18-8v4c0 4.6 8.1 8 18 8s18-3.4 18-8v-4c0 4.6-8.1 8-18 8z"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className || "w-12 h-12"}>
            <circle fill="#FFB636" cx="32" cy="32" r="16"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      variants={iconVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="inline-block"
    >
      {renderIcon()}
    </motion.div>
  );
};

FoodIcon.propTypes = {
  type: PropTypes.oneOf(['plate', 'burger', 'salad', 'fries', 'chef', 'pizza', 'drink', 'dessert']),
  className: PropTypes.string,
  delay: PropTypes.number
};

FoodIcon.defaultProps = {
  type: 'plate',
  className: 'w-6 h-6'
};

export default FoodIcon; 