// User type matching the backend UserResponse schema
export interface User {
  id: number;
  email: string;
  name: string | null;
  provider: string;
  created_at: string; // ISO date string
}

// Request/Response types
export interface EmailOTPSendRequest {
  username: string;
  email: string;
}

export interface EmailOTPVerifyRequest {
  email: string;
  otp: string;
}

export interface OTPResponse {
  message: string;
}

export interface AuthError {
  detail: string;
}