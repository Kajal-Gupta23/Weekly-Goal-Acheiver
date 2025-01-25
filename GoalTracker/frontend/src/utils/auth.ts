// src/utils/auth.ts

// Save JWT tokens to localStorage
export const setTokens = (access: string, refresh: string): void => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
  };
  
  // Retrieve the access token from localStorage
  export const getAccessToken = (): string | null => {
    return localStorage.getItem('access');
  };
  
  // Retrieve the refresh token from localStorage
  export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh');
  };
  
  // Clear JWT tokens from localStorage
  export const clearTokens = (): void => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };
  
  // Check if the user is authenticated (by checking if access token exists)
  export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
  };
  