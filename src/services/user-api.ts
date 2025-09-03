import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import type {
  User,
  UserProfile,
  UserSession,
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResult,
  UserStatus
} from '@/types/user-api';

export class UserApiService {
  // Authentication endpoints
  async register(userData: CreateUserDto): Promise<UserProfile> {
    return apiClient.post<UserProfile>(API_CONFIG.ENDPOINTS.USERS.REGISTER, userData);
  }

  async login(credentials: LoginDto): Promise<AuthResult> {
    return apiClient.post<AuthResult>(API_CONFIG.ENDPOINTS.USERS.LOGIN, credentials);
  }

  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.USERS.LOGOUT);
  }

  async logoutAll(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.USERS.LOGOUT_ALL);
  }

  // Password management
  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD, data);
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.USERS.FORGOT_PASSWORD, data);
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.USERS.RESET_PASSWORD, data);
  }

  // User profile management
  async getCurrentUser(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(API_CONFIG.ENDPOINTS.USERS.ME);
  }

  async updateProfile(data: UpdateUserDto): Promise<UserProfile> {
    return apiClient.put<UserProfile>(API_CONFIG.ENDPOINTS.USERS.ME, data);
  }

  async getUserSessions(): Promise<UserSession[]> {
    return apiClient.get<UserSession[]>(API_CONFIG.ENDPOINTS.USERS.SESSIONS);
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.USERS.RESEND_VERIFICATION);
  }

  // Email verification
  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.USERS.VERIFY_EMAIL}/${token}`
    );
  }

  // Admin endpoints (require admin role)
  async getUsers(
    status?: UserStatus,
    limit?: number,
    cursor?: string
  ): Promise<{
    users: UserProfile[];
    nextCursor?: string;
    hasMore: boolean;
  }> {
    const params: any = {};
    if (status) params.status = status;
    if (limit) params.limit = limit;
    if (cursor) params.cursor = cursor;

    return apiClient.get<{
      users: UserProfile[];
      nextCursor?: string;
      hasMore: boolean;
    }>('/users', params);
  }

  async getUserById(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/users/${userId}`);
  }

  async updateUserById(userId: string, data: UpdateUserDto): Promise<UserProfile> {
    return apiClient.put<UserProfile>(`/users/${userId}`, data);
  }

  async deleteUserById(userId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/users/${userId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiClient.get<{ status: string; timestamp: string }>('/users/health');
  }
}

// Export singleton instance
export const userApiService = new UserApiService();
