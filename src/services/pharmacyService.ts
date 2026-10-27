import { dbStore } from '../db/mockStore';
import {
  Pharmacy,
  PharmacyRegistrationInput,
  PharmacyStatus,
  PharmacyMembership,
} from '../types/pharmacy';

export class PharmacyService {
  public async getPharmacies(): Promise<Pharmacy[]> {
    return [...dbStore.getState().pharmacies];
  }

  public async getPharmacyById(id: string): Promise<Pharmacy | null> {
    const found = dbStore.getState().pharmacies.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  public async createPharmacy(input: PharmacyRegistrationInput): Promise<Pharmacy> {
    // 1. Normalize and clean inputs
    const name = input.name.trim();
    const ownerName = input.ownerName.trim();
    const ownerEmail = input.ownerEmail.trim().toLowerCase();

    // 2. Generate slug and ensure uniqueness
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!baseSlug) baseSlug = 'pharmacy';

    let uniqueSlug = baseSlug;
    let counter = 1;
    const existingSlugs = new Set(dbStore.getState().pharmacies.map((p) => p.slug));
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const now = new Date().toISOString();
    const pharmacyId = `pharma-${Date.now().toString().slice(-6)}`;

    const newPharmacy: Pharmacy = {
      id: pharmacyId,
      name,
      slug: uniqueSlug,
      licenseNumber: input.licenseNumber?.trim() || `PHA-PK-${Math.floor(10000 + Math.random() * 90000)}`,
      ownerEmail,
      ownerName,
      phone: input.phone?.trim() || '+92 300 0000000',
      address: input.address?.trim() || 'Commercial Area',
      city: input.city?.trim() || 'Islamabad',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    // 3. Create or resolve user profile
    const existingUser = dbStore.getState().users.find((u) => u.email === ownerEmail);
    const userId = existingUser ? existingUser.id : `usr-${Date.now().toString().slice(-6)}`;

    const membership: PharmacyMembership = {
      id: `mem-${Date.now().toString().slice(-6)}`,
      pharmacyId,
      userId,
      role: 'pharmacy_owner',
      status: 'active',
      createdAt: now,
    };

    dbStore.updateState((draft) => {
      draft.pharmacies.unshift(newPharmacy);

      if (!existingUser) {
        draft.users.push({
          id: userId,
          email: ownerEmail,
          fullName: ownerName,
          phone: input.phone,
          createdAt: now,
          updatedAt: now,
        });
      }

      draft.memberships.push(membership);

      // Auto-assign Standard plan if planId is given or default
      const plan = draft.plans.find((p) => p.id === input.planId) || draft.plans[1];
      if (plan) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        draft.subscriptions.push({
          id: `sub-${pharmacyId}`,
          pharmacyId,
          planId: plan.id,
          status: 'active',
          startAt: now,
          currentPeriodStart: now,
          currentPeriodEnd: nextMonth.toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: now,
          updatedAt: now,
        });
      }

      draft.auditLogs.unshift({
        id: `log-${Date.now()}`,
        pharmacyId,
        action: 'PHARMACY_REGISTERED',
        targetEntity: 'pharmacies',
        targetId: pharmacyId,
        metadata: { name, ownerEmail, slug: uniqueSlug },
        createdAt: now,
      });
    });

    return newPharmacy;
  }

  public async updatePharmacyStatus(id: string, status: PharmacyStatus): Promise<boolean> {
    let success = false;
    dbStore.updateState((draft) => {
      const p = draft.pharmacies.find((item) => item.id === id);
      if (p) {
        p.status = status;
        p.updatedAt = new Date().toISOString();
        success = true;

        draft.auditLogs.unshift({
          id: `log-${Date.now()}`,
          pharmacyId: id,
          action: 'PHARMACY_STATUS_UPDATED',
          targetEntity: 'pharmacies',
          targetId: id,
          metadata: { newStatus: status },
          createdAt: new Date().toISOString(),
        });
      }
    });
    return success;
  }
}

export const pharmacyService = new PharmacyService();
