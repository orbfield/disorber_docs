// Logarithmic scale helper functions
export const logScale = (value) => {
  // Convert linear 0-100 to logarithmic 0-20
  if (value === 0) return 0;
  return Math.pow(20, value / 100);
};

export const inverseLogScale = (value) => {
  // Convert logarithmic 0-20 to linear 0-100
  if (value === 0) return 0;
  return (Math.log(value) / Math.log(20)) * 100;
};
