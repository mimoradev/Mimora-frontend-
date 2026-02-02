import { API_CONFIG } from '../config/api';
import type { User } from '../types/auth.types';

interface EmailOTPSendRequest {
  username: string;
  email: string;
}

interface EmailOTPVerifyRequest {
  email: string;
  otp: string;
}

class AuthService {

  private async fetchJSON(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  }

  // ===============================
  // EMAIL OTP – SEND OTP
  // ===============================
  async sendEmailOTP(payload: EmailOTPSendRequest): Promise<{ message: string }> {
    return this.fetchJSON('/auth/customer/email', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ===============================
  // EMAIL OTP – VERIFY OTP
  // ===============================
  async verifyEmailOTP(payload: EmailOTPVerifyRequest): Promise<User> {
    return this.fetchJSON('/auth/customer/email/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ===============================
  // OAUTH (Firebase token required)
  // ===============================
  async authenticateWithOAuth(firebaseToken: string): Promise<User> {
    return this.fetchJSON('/auth/customer/oauth', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    });
  }

  // ===============================
  // PHONE OTP (Firebase)
  // ===============================
  async authenticateWithOTP(firebaseToken: string, name: string): Promise<User> {
    return this.fetchJSON(API_CONFIG.ENDPOINTS.OTP_AUTH, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({ name }),
    });
  }
}

export const authService = new AuthService();
