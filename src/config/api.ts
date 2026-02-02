export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    OTP_AUTH: '/auth/customer/otp',
    EMAIL_LOGIN: '/auth/customer/login',
  }
};
