import React, { createContext, useContext, useState, useEffect } from 'react';
import { SuperAdminUser } from '../types/admin';
import { adminAuthService, AuthSession } from '../services/adminAuthService';

interface AdminAuthContextType {
  user: SuperAdminUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isBackendConfigured: boolean;
  isDevPreview: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDevPreview: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isBackendConfigured = adminAuthService.isBackendConfigured();

  useEffect(() => {
    // Check for existing valid session
    const currentSession = adminAuthService.getSession();
    if (currentSession) {
      setSession(currentSession);
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const result = await adminAuthService.loginWithCredentials(email, password);
    if (result.success && result.session) {
      setSession(result.session);
    }
    setIsLoading(false);
    return { success: result.success, error: result.error };
  };

  const loginDevPreview = () => {
    const devSession = adminAuthService.startDevPreviewSession();
    setSession(devSession);
  };

  const logout = () => {
    adminAuthService.logout();
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isAuthenticated: Boolean(session?.user && session?.user.isVerifiedSuperAdmin),
        isBackendConfigured,
        isDevPreview: Boolean(session?.isDevPreview),
        isLoading,
        login,
        loginDevPreview,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
