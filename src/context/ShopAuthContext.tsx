import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Pharmacy, PharmacyMembership } from '../types/pharmacy';
import { pharmacyAuthService } from '../services/pharmacyAuthService';

export interface ShopAuthContextType {
  user: UserProfile | null;
  activePharmacy: Pharmacy | null;
  activeMembership: PharmacyMembership | null;
  authorizedPharmacies: Pharmacy[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchPharmacy: (pharmacyId: string) => boolean;
  refreshSession: () => void;
}

const ShopAuthContext = createContext<ShopAuthContextType | undefined>(undefined);

export const ShopAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activePharmacy, setActivePharmacy] = useState<Pharmacy | null>(null);
  const [activeMembership, setActiveMembership] = useState<PharmacyMembership | null>(null);
  const [authorizedPharmacies, setAuthorizedPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(() => {
    const session = pharmacyAuthService.getSession();
    if (session) {
      setUser(session.user);
      setActivePharmacy(session.activePharmacy);
      setActiveMembership(session.activeMembership);
      setAuthorizedPharmacies(session.authorizedPharmacies);
    } else {
      setUser(null);
      setActivePharmacy(null);
      setActiveMembership(null);
      setAuthorizedPharmacies([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    const res = await pharmacyAuthService.loginWithCredentials(email, password);
    if (res.success && res.session) {
      setUser(res.session.user);
      setActivePharmacy(res.session.activePharmacy);
      setActiveMembership(res.session.activeMembership);
      setAuthorizedPharmacies(res.session.authorizedPharmacies);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = () => {
    pharmacyAuthService.logout();
    setUser(null);
    setActivePharmacy(null);
    setActiveMembership(null);
    setAuthorizedPharmacies([]);
  };

  const switchPharmacy = (pharmacyId: string): boolean => {
    const session = pharmacyAuthService.switchActivePharmacy(pharmacyId);
    if (session) {
      setActivePharmacy(session.activePharmacy);
      setActiveMembership(session.activeMembership);
      return true;
    }
    return false;
  };

  return (
    <ShopAuthContext.Provider
      value={{
        user,
        activePharmacy,
        activeMembership,
        authorizedPharmacies,
        isAuthenticated: !!user && !!activePharmacy,
        isLoading,
        login,
        logout,
        switchPharmacy,
        refreshSession,
      }}
    >
      {children}
    </ShopAuthContext.Provider>
  );
};

export const useShopAuth = (): ShopAuthContextType => {
  const context = useContext(ShopAuthContext);
  if (!context) {
    throw new Error('useShopAuth must be used within a ShopAuthProvider');
  }
  return context;
};
