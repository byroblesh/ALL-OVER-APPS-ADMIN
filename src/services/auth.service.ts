import axios from "@/utils/axios";
import { User } from "@/@types/user";

// ============================================================================
// Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface ProfileResponse {
  user: User;
}

// ============================================================================
// Auth Service
// ============================================================================

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await axios.get<ProfileResponse>("/auth/profile");
    return response.data.user;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // Call logout endpoint if your API has one
    // await axios.post("/auth/logout");

    // Clear local storage
    localStorage.removeItem("authToken");
  }

  /**
   * Refresh token (if your API supports it)
   */
  async refreshToken(): Promise<string> {
    const response = await axios.post<{ token: string }>("/auth/refresh");
    return response.data.token;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
