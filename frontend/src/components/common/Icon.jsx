import React from 'react';

const sizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 32,
};

function Icon({ icon: IconComponent, size = 'md', className = '', strokeWidth = 1.8, ...props }) {
  return (
    <IconComponent
      size={sizes[size] || sizes.md}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`}
      {...props}
    />
  );
}

export default Icon;
