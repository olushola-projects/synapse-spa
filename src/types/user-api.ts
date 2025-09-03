// Types matching the ai-chat-backend user management system

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  role: UserRole;
  emailVerified: boolean;
  lastLoginAt?: Date;
  metadata?: Record<string, any>;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {}

// DTOs matching backend
export interface CreateUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
  metadata?: Record<string, any>;
  preferences?: Record<string, any>;
}

export interface UpdateUserDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  metadata?: Record<string, any>;
  preferences?: Record<string, any>;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// API Response types
export interface AuthResult {
  user: UserProfile;
  session: UserSession;
  token: string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  error?: string;
  statusCode?: number;
}


