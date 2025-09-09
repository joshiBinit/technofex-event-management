export const VALIDATION_CONSTANTS = {
  // Form field length constraints
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  MAX_USERNAME_LENGTH: 30,
  MAX_PASSWORD_LENGTH: 30,
  MAX_TITLE_LENGTH: 30,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_LOCATION_LENGTH: 50,
  
  // Numeric constraints
  MIN_TICKETS: 1,
  MIN_PRICE: 0,
};

// Regular expression patterns for validation
export const VALIDATION_PATTERNS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};