import { dbStore } from '../db/mockStore';
import { UserProfile, Pharmacy, PharmacyMembership } from '../types/pharmacy';

export interface ShopSession {
  user: UserProfile;
  activePharmacy: Pharmacy;
  activeMembership: PharmacyMembership;
  authorizedPharmacies: Pharmacy[];
  token: string;
  expiresAt: number;
}

const SHOP_SESSION_KEY = 'x_management_shop_session';

class PharmacyAuthService {
  public getSession(): ShopSession | null {
    try {
      const raw = sessionStorage.getItem(SHOP_SESSION_KEY);
      if (!raw) return null;
      const session: ShopSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      this.logout();
      return null;
    }
  }

  public async loginWithCredentials(
    email: string,
    _password: string
  ): Promise<{ success: boolean; session?: ShopSession; error?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const state = dbStore.getState();

    // 1. Locate user profile
    const user = state.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials or user account not found for this pharmacy email.',
      };
    }

    // 2. Resolve authorized pharmacy memberships
    const userMemberships = state.memberships.filter(
      (m) => m.userId === user.id && m.status === 'active'
    );

    if (userMemberships.length === 0) {
      return {
        success: false,
        error: 'No active pharmacy memberships found for this account. Please contact your platform administrator.',
      };
    }

    // 3. Resolve pharmacy organizations
    const authorizedPharmacies = state.pharmacies.filter((p) =>
      userMemberships.some((m) => m.pharmacyId === p.id)
    );

    if (authorizedPharmacies.length === 0) {
      return {
        success: false,
        error: 'Associated pharmacy records are suspended or unprovisioned.',
      };
    }

    // Default to the first authorized pharmacy
    const activePharmacy = authorizedPharmacies[0];
    const activeMembership = userMemberships.find((m) => m.pharmacyId === activePharmacy.id)!;

    const session: ShopSession = {
      user,
      activePharmacy,
      activeMembership,
      authorizedPharmacies,
      token: `shop-token-${Date.now()}`,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    };

    try {
      sessionStorage.setItem(SHOP_SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }

    return { success: true, session };
  }

  public switchActivePharmacy(pharmacyId: string): ShopSession | null {
    const session = this.getSession();
    if (!session) return null;

    // Verify authorized membership for the target pharmacy
    const targetPharmacy = session.authorizedPharmacies.find((p) => p.id === pharmacyId);
    if (!targetPharmacy) return null;

    const state = dbStore.getState();
    const membership = state.memberships.find(
      (m) => m.userId === session.user.id && m.pharmacyId === pharmacyId && m.status === 'active'
    );
    if (!membership) return null;

    session.activePharmacy = targetPharmacy;
    session.activeMembership = membership;

    try {
      sessionStorage.setItem(SHOP_SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }

    return session;
  }

  public logout(): void {
    try {
      sessionStorage.removeItem(SHOP_SESSION_KEY);
    } catch {
      // ignore
    }
  }
}

export const pharmacyAuthService = new PharmacyAuthService();
