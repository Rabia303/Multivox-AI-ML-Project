import React from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  loading = 'lazy',
  width,
  height,
  ...props 
}) => {
 
  const getOptimizedSrc = () => {
    if (src.startsWith('http')) return src;
    return new URL(`/src/assets/images/1.avif`, import.meta.url).href;
  };

  return (
    <img
      src={getOptimizedSrc()}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      {...props}
    />
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  width: PropTypes.number,
  height: PropTypes.number
};

export default OptimizedImage;