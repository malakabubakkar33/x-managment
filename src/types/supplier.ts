export interface Supplier {
  id: string;
  pharmacyId: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  notes?: string;
  isActive: boolean;
  totalPurchasesCount?: number;
  totalPurchasesValue?: number;
  outstandingBalance?: number;
  createdAt: string;
  updatedAt: string;
}
