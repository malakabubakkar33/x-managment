import { SuperAdminUser } from '../types/admin';

export interface AuthSession {
  user: SuperAdminUser;
  token: string;
  expiresAt: number;
  isDevPreview: boolean;
}

const SESSION_STORAGE_KEY = 'x_management_admin_session';

class AdminAuthService {
  /**
   * Checks whether a live backend (such as Supabase or custom API) is configured
   * via environment variables.
   */
  public isBackendConfigured(): boolean {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return Boolean(supabaseUrl && supabaseAnonKey);
  }

  /**
   * Retrieves the current stored session from sessionStorage (safe against cross-session persistence)
   */
  public getSession(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);

      // Check for expiration (default 8 hours)
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  /**
   * Authenticates against the backend if configured; otherwise reports unconfigured status.
   */
  public async loginWithCredentials(
    _email: string,
    _password: string
  ): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    if (!this.isBackendConfigured()) {
      return {
        success: false,
        error:
          'Backend authentication is not configured in this environment. Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. Use Development Preview Mode for UI review.',
      };
    }

    // Integration Boundary for real Supabase/API Authentication:
    // In Phase 3, this calls supabase.auth.signInWithPassword({ email, password })
    // and verifies that auth.jwt() claims contain role === 'super_admin'.
    return {
      success: false,
      error: 'Backend authentication endpoint unreachable or invalid credentials.',
    };
  }

  /**
   * Starts an explicit Development Preview session strictly for testing and verifying
   * UI components, layout, and dashboard navigation when no backend is configured.
   */
  public startDevPreviewSession(): AuthSession {
    const session: AuthSession = {
      user: {
        id: 'dev-super-admin-01',
        email: 'superadmin.preview@xmanagement.local',
        name: 'Lead System Architect',
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
        isVerifiedSuperAdmin: true,
      },
      token: `dev-preview-token-${Date.now()}`,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      isDevPreview: true,
    };

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // storage unavailable
    }

    return session;
  }

  /**
   * Terminates the current administrator session.
   */
  public logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

export const adminAuthService = new AdminAuthService();
