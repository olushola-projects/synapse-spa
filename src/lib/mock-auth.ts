// Mock authentication implementation for pure React app
export interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface MockSession {
  user: MockUser | null;
  access_token?: string;
}

// Simple localStorage-based mock authentication
class MockAuth {
  private listeners: ((session: MockSession | null) => void)[] = [];
  private currentSession: MockSession | null = null;

  constructor() {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('mock_session');
    if (savedSession) {
      try {
        this.currentSession = JSON.parse(savedSession);
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('mock_session');
      }
    }
  }

  // Get current session
  getSession(): Promise<{ data: { session: MockSession | null } }> {
    return Promise.resolve({ data: { session: this.currentSession } });
  }

  // Sign in with email/password
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    // Mock authentication - accept any email/password combination
    const user: MockUser = {
      id: `user_${Date.now()}`,
      email,
      user_metadata: {
        full_name: email.split('@')[0]
      }
    };

    const session: MockSession = {
      user,
      access_token: `mock_token_${Date.now()}`
    };

    this.currentSession = session;
    localStorage.setItem('mock_session', JSON.stringify(session));
    this.notifyListeners();

    return { data: { user, session }, error: null };
  }

  // Sign up with email/password
  async signUp({ email, password }: { email: string; password: string }) {
    return this.signInWithPassword({ email, password });
  }

  // Sign out
  async signOut() {
    this.currentSession = null;
    localStorage.removeItem('mock_session');
    this.notifyListeners();
    return { error: null };
  }

  // OAuth sign in (Google, LinkedIn)
  async signInWithOAuth({ provider }: { provider: string }) {
    const email = `${provider.toLowerCase()}user@example.com`;
    return this.signInWithPassword({ email, password: 'mock_password' });
  }

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: MockSession | null) => void) {
    const listener = (session: MockSession | null) => {
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    };
    this.listeners.push(listener);

    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentSession));
  }

  // Reset password (mock)
  async resetPasswordForEmail({ email }: { email: string }) {
    console.log(`Mock: Password reset email sent to ${email}`);
    return { data: {}, error: null };
  }

  // Update password (mock)
  async updateUser({ password }: { password: string }) {
    console.log('Mock: User password updated');
    return { data: { user: this.currentSession?.user }, error: null };
  }
}

// Create and export the mock auth instance
export const mockAuth = new MockAuth();

// Mock Supabase client structure
export const supabase = {
  auth: mockAuth,
  // Add other mock methods as needed
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  })
};
