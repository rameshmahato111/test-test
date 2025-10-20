import { getHeaders } from '../headers';
import {  API_BASE_URL, handleResponse } from './client';

interface GoogleAuthResponse {
  token: string;
}

// const API_BASE_URL = 'http://exploreden.eu-north-1.elasticbeanstalk.com';

export const googleAuthApi = {
  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/o/google-oauth2/?redirect_uri=${window.location.origin}/oauth/google/callback`
      );
      const data = await handleResponse<{ authorization_url: string }>(response);
      return data.authorization_url;
    } catch (error) {
      console.error('Get Google auth URL error:', error);
      throw error;
    }
  },

  async activateUser(code: string): Promise<string> {
  
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/google/activation/`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          
        },
        body: JSON.stringify({ code }),
      });
      const data = await handleResponse<GoogleAuthResponse>(response);
      return data.token;
    } catch (error) {
      console.error('Google activation error:', error);
      throw error;
    }
  }
}; 