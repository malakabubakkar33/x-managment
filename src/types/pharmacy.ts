export type PharmacyStatus = 'pending' | 'active' | 'suspended';

export interface Pharmacy {
  id: string;
  name: string;
  slug: string;
  licenseNumber?: string;
  ownerEmail: string;
  ownerName: string;
  phone?: string;
  address?: string;
  city?: string;
  status: PharmacyStatus;
  createdAt: string;
  updatedAt: string;
}

export type MembershipRole = 'pharmacy_owner' | 'pharmacy_manager' | 'pharmacy_staff';
export type MembershipStatus = 'active' | 'invited' | 'suspended';

export interface PharmacyMembership {
  id: string;
  pharmacyId: string;
  userId: string;
  role: MembershipRole;
  status: MembershipStatus;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorUserId?: string;
  pharmacyId?: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PharmacyRegistrationInput {
  name: string;
  ownerName: string;
  ownerEmail: string;
  licenseNumber?: string;
  phone?: string;
  address?: string;
  city?: string;
  planId?: string;
}
