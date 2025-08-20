import { test, expect } from '@playwright/test';
import { createTestHelper, TestData, Selectors } from './utils/test-helpers';
/**
 * Authentication Flow End-to-End Tests
 * Comprehensive testing of user authentication and authorization
 */
test.describe('Authentication Flow', () => {
  let helper;
  test.beforeEach(async ({ page }) => {
    helper = createTestHelper(page);
  });
  test.describe('User Registration', () => {
    test('should complete user registration successfully', async ({ page }) => {
      await helper.navigateTo('/register');
      // Verify registration form elements
      await helper.expectText('Create Account');
      await helper.expectVisible('[data-testid="email-input"]');
      await helper.expectVisible('[data-testid="password-input"]');
      await helper.expectVisible('[data-testid="confirm-password-input"]');
      await helper.expectVisible('[data-testid="register-button"]');
      // Fill registration form
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.fillField('[data-testid="confirm-password-input"]', TestData.user.password);
      // Submit registration
      await helper.clickButton('[data-testid="register-button"]');
      // Verify success
      await helper.expectText(/Account created successfully/);
      await helper.expectVisible(Selectors.successAlert);
      // Verify redirect to dashboard
      await helper.waitForUrl(/\/dashboard/);
    });
    test('should validate registration form fields', async ({ page }) => {
      await helper.navigateTo('/register');
      // Test invalid email
      await helper.fillField('[data-testid="email-input"]', TestData.user.invalidEmail);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.fillField('[data-testid="confirm-password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="register-button"]');
      await helper.expectText(/Please enter a valid email address/);
      // Test weak password
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.weakPassword);
      await helper.fillField('[data-testid="confirm-password-input"]', TestData.user.weakPassword);
      await helper.clickButton('[data-testid="register-button"]');
      await helper.expectText(/Password must be at least 8 characters/);
      // Test password mismatch
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.fillField('[data-testid="confirm-password-input"]', 'DifferentPassword123!');
      await helper.clickButton('[data-testid="register-button"]');
      await helper.expectText(/Passwords do not match/);
    });
    test('should handle duplicate email registration', async ({ page }) => {
      // Mock API response for duplicate email
      await helper.mockApiError('/api/auth/register', 409);
      await helper.navigateTo('/register');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.fillField('[data-testid="confirm-password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="register-button"]');
      await helper.expectText(/Email already exists/);
      await helper.expectVisible(Selectors.errorAlert);
    });
  });
  test.describe('User Login', () => {
    test('should complete user login successfully', async ({ page }) => {
      await helper.navigateTo('/login');
      // Verify login form elements
      await helper.expectText('Sign In');
      await helper.expectVisible('[data-testid="email-input"]');
      await helper.expectVisible('[data-testid="password-input"]');
      await helper.expectVisible('[data-testid="login-button"]');
      // Fill login form
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      // Submit login
      await helper.clickButton('[data-testid="login-button"]');
      // Verify success and redirect
      await helper.waitForUrl(/\/dashboard/);
      await helper.expectText(/Welcome back/);
    });
    test('should validate login form fields', async ({ page }) => {
      await helper.navigateTo('/login');
      // Test empty fields
      await helper.clickButton('[data-testid="login-button"]');
      await helper.expectText(/Email is required/);
      await helper.expectText(/Password is required/);
      // Test invalid email format
      await helper.fillField('[data-testid="email-input"]', TestData.user.invalidEmail);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      await helper.expectText(/Please enter a valid email address/);
    });
    test('should handle invalid credentials', async ({ page }) => {
      // Mock API response for invalid credentials
      await helper.mockApiError('/api/auth/login', 401);
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', 'WrongPassword123!');
      await helper.clickButton('[data-testid="login-button"]');
      await helper.expectText(/Invalid email or password/);
      await helper.expectVisible(Selectors.errorAlert);
    });
    test('should handle account lockout after multiple failed attempts', async ({ page }) => {
      await helper.navigateTo('/login');
      // Attempt multiple failed logins
      for (let i = 0; i < 5; i++) {
        await helper.mockApiError('/api/auth/login', 401);
        await helper.fillField('[data-testid="email-input"]', TestData.user.email);
        await helper.fillField('[data-testid="password-input"]', 'WrongPassword123!');
        await helper.clickButton('[data-testid="login-button"]');
        await helper.expectText(/Invalid email or password/);
      }
      // Verify account lockout
      await helper.expectText(/Account temporarily locked/);
      await helper.expectVisible('[data-testid="unlock-account-button"]');
    });
  });
  test.describe('Password Reset', () => {
    test('should initiate password reset successfully', async ({ page }) => {
      await helper.navigateTo('/forgot-password');
      // Verify forgot password form
      await helper.expectText('Reset Password');
      await helper.expectVisible('[data-testid="email-input"]');
      await helper.expectVisible('[data-testid="reset-button"]');
      // Submit email
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.clickButton('[data-testid="reset-button"]');
      // Verify success message
      await helper.expectText(/Password reset email sent/);
      await helper.expectVisible(Selectors.successAlert);
    });
    test('should handle password reset with invalid email', async ({ page }) => {
      // Mock API response for non-existent email
      await helper.mockApiError('/api/auth/forgot-password', 404);
      await helper.navigateTo('/forgot-password');
      await helper.fillField('[data-testid="email-input"]', 'nonexistent@example.com');
      await helper.clickButton('[data-testid="reset-button"]');
      await helper.expectText(/Email not found/);
    });
    test('should complete password reset with valid token', async ({ page }) => {
      await helper.navigateTo('/reset-password?token=valid-token');
      // Verify reset password form
      await helper.expectText('Set New Password');
      await helper.expectVisible('[data-testid="new-password-input"]');
      await helper.expectVisible('[data-testid="confirm-password-input"]');
      await helper.expectVisible('[data-testid="reset-button"]');
      // Set new password
      const newPassword = 'NewPassword123!';
      await helper.fillField('[data-testid="new-password-input"]', newPassword);
      await helper.fillField('[data-testid="confirm-password-input"]', newPassword);
      await helper.clickButton('[data-testid="reset-button"]');
      // Verify success
      await helper.expectText(/Password updated successfully/);
      await helper.waitForUrl(/\/login/);
    });
  });
  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Login first
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Verify logged in state
      await helper.waitForUrl(/\/dashboard/);
      await helper.expectText(/Welcome back/);
      // Refresh page
      await page.reload();
      await helper.waitForPageLoad();
      // Verify still logged in
      await helper.expectText(/Welcome back/);
      await helper.expectNotVisible('[data-testid="login-button"]');
    });
    test('should handle session expiration', async ({ page }) => {
      // Mock expired session
      await helper.mockApiError('/api/auth/verify', 401);
      await helper.navigateTo('/dashboard');
      await helper.expectText(/Session expired/);
      await helper.waitForUrl(/\/login/);
    });
    test('should allow user logout', async ({ page }) => {
      // Login first
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Navigate to dashboard
      await helper.waitForUrl(/\/dashboard/);
      // Click logout
      await helper.clickButton('[data-testid="logout-button"]');
      // Verify logout
      await helper.waitForUrl(/\/login/);
      await helper.expectText(/You have been logged out/);
    });
  });
  test.describe('Authorization', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access protected route
      await helper.navigateTo('/dashboard');
      await helper.waitForUrl(/\/login/);
      await helper.expectText(/Please log in to continue/);
    });
    test('should allow access to protected routes for authenticated users', async ({ page }) => {
      // Login first
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Access protected routes
      const protectedRoutes = ['/dashboard', '/profile', '/settings'];
      for (const route of protectedRoutes) {
        await helper.navigateTo(route);
        await helper.expectNotText(/Please log in to continue/);
      }
    });
    test('should handle role-based access control', async ({ page }) => {
      // Mock user with specific role
      await helper.mockApiResponse('/api/auth/me', {
        user: {
          id: 1,
          email: TestData.user.email,
          role: 'user'
        }
      });
      // Login
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Try to access admin route
      await helper.navigateTo('/admin');
      await helper.expectText(/Access denied/);
      await helper.expectText(/You do not have permission to access this page/);
    });
  });
  test.describe('Security Features', () => {
    test('should prevent XSS attacks in login form', async ({ page }) => {
      await helper.navigateTo('/login');
      // Test XSS payload
      const xssPayload = '<script>alert("xss")</script>';
      await helper.fillField('[data-testid="email-input"]', xssPayload);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Verify no script execution
      const alerts = page.on('dialog', dialog => dialog.dismiss());
      expect(alerts).toBeUndefined();
    });
    test('should enforce password complexity requirements', async ({ page }) => {
      await helper.navigateTo('/register');
      const weakPasswords = ['123', 'password', 'abc123', 'qwerty'];
      for (const weakPassword of weakPasswords) {
        await helper.fillField('[data-testid="email-input"]', TestData.user.email);
        await helper.fillField('[data-testid="password-input"]', weakPassword);
        await helper.fillField('[data-testid="confirm-password-input"]', weakPassword);
        await helper.clickButton('[data-testid="register-button"]');
        await helper.expectText(/Password must meet complexity requirements/);
      }
    });
    test('should implement rate limiting on login attempts', async ({ page }) => {
      await helper.navigateTo('/login');
      // Attempt multiple rapid logins
      for (let i = 0; i < 10; i++) {
        await helper.mockApiError('/api/auth/login', 429);
        await helper.fillField('[data-testid="email-input"]', TestData.user.email);
        await helper.fillField('[data-testid="password-input"]', 'WrongPassword123!');
        await helper.clickButton('[data-testid="login-button"]');
      }
      // Verify rate limiting
      await helper.expectText(/Too many login attempts/);
      await helper.expectText(/Please try again later/);
    });
    test('should use secure cookies for session management', async ({ page }) => {
      // Login to set cookies
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Check cookie attributes
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find(cookie => cookie.name === 'session');
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie?.httpOnly).toBe(true);
      expect(sessionCookie?.secure).toBe(true);
    });
  });
  test.describe('Multi-Factor Authentication', () => {
    test('should prompt for MFA when enabled', async ({ page }) => {
      // Mock MFA requirement
      await helper.mockApiResponse('/api/auth/login', {
        success: true,
        requiresMFA: true,
        tempToken: 'temp-token'
      });
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Verify MFA prompt
      await helper.expectText(/Two-Factor Authentication/);
      await helper.expectVisible('[data-testid="mfa-code-input"]');
      await helper.expectVisible('[data-testid="verify-mfa-button"]');
    });
    test('should complete MFA verification successfully', async ({ page }) => {
      // Mock MFA requirement and verification
      await helper.mockApiResponse('/api/auth/login', {
        success: true,
        requiresMFA: true,
        tempToken: 'temp-token'
      });
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Enter MFA code
      await helper.fillField('[data-testid="mfa-code-input"]', '123456');
      await helper.clickButton('[data-testid="verify-mfa-button"]');
      // Verify successful login
      await helper.waitForUrl(/\/dashboard/);
      await helper.expectText(/Welcome back/);
    });
    test('should handle invalid MFA code', async ({ page }) => {
      // Mock MFA requirement
      await helper.mockApiResponse('/api/auth/login', {
        success: true,
        requiresMFA: true,
        tempToken: 'temp-token'
      });
      await helper.navigateTo('/login');
      await helper.fillField('[data-testid="email-input"]', TestData.user.email);
      await helper.fillField('[data-testid="password-input"]', TestData.user.password);
      await helper.clickButton('[data-testid="login-button"]');
      // Mock invalid MFA code
      await helper.mockApiError('/api/auth/verify-mfa', 400);
      await helper.fillField('[data-testid="mfa-code-input"]', '000000');
      await helper.clickButton('[data-testid="verify-mfa-button"]');
      await helper.expectText(/Invalid verification code/);
    });
  });
});
