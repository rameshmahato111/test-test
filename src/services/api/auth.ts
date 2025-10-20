import { LoginResponse, RegisterResponse, OTPVerificationResponse, ForgetPasswordResponse } from '@/types/api';
import { getHeaders } from '../headers';
import { API_BASE_URL, handleResponse } from './client';
import { toast } from '@/hooks/use-toast';



export const authApi = {
  async login(email: string, password: string): Promise<string> {
    try {

      const response = await fetch(`${API_BASE_URL}/auth/token/login/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse<LoginResponse>(response);
      return data.auth_token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(email: string, username: string, password: string): Promise<RegisterResponse> {
    try {
      const payload = { email, username, password };
      console.log('Registration payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/auth/users/`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Registration API error:', errorData);
        
        // Create a custom error with the response data
        const error = new Error('Registration failed');
        (error as any).response = errorData;
        (error as any).status = response.status;
        throw error;
      }
      
      const data = await handleResponse<RegisterResponse>(response);
      console.log('Registration successful:', data);
      return data;
    } catch (error: any) {
      // If it's our custom error with response data, rethrow it
      if (error.response) {
        throw error;
      }
      
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  },

  async verifyOTP(otp: string, email: string): Promise<OTPVerificationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/activation/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ otp, email }),
      });
      return handleResponse<OTPVerificationResponse>(response);
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  async forgetPassword(email: string): Promise<ForgetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/reset_password/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email })
      });
      return handleResponse<ForgetPasswordResponse>(response);
    } catch (error) {
      console.error('Forget password error:', error);
      throw error;
    }
  },

  async logout(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/logout/`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  // This will send OTP to the email
  async resetPassword(email: string): Promise<ForgetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/reset_password/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await handleResponse<ForgetPasswordResponse>(response);
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  async resetPasswordConfirm(email: string, otp: string,new_password: string): Promise<ForgetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/reset_password_confirm/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, otp, new_password })
      });
      const data = await handleResponse<ForgetPasswordResponse>(response);
      return data;
    } catch (error) {
      console.error('Reset password confirm error:', error);
      throw error;
    }
  },
 
  async resendOTP(email: string): Promise<ForgetPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/resend_activation/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await handleResponse<ForgetPasswordResponse>(response);
      return data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },
  async deleteAccount(email: string,token: string): Promise<boolean> {
    if(!token){
      toast({
        title: 'Error',
        variant: 'error',
        description: 'Please login to delete your account.',
      })
      return false;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
        method: 'DELETE',
        headers: getHeaders(token),
        // body: JSON.stringify({ email }),
      });
      const data = await handleResponse<boolean>(response);
      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;

    }
  }
}; 