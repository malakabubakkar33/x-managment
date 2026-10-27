import {
  Pharmacy,
  PharmacyMembership,
  UserProfile,
  AuditLogEntry,
} from '../types/pharmacy';
import {
  SubscriptionPlan,
  PharmacySubscription,
  SubscriptionInvoice,
  PaymentRecord,
} from '../types/subscription';
import {
  Medicine,
  MedicineBatch,
  InventoryMovement,
  MedicineCategory,
} from '../types/inventory';
import { Supplier } from '../types/supplier';
import {
  PurchaseOrder,
  GoodsReceipt,
} from '../types/purchase';

// Key for sessionStorage persistence during active testing
const STORAGE_KEY = 'x_management_relational_store_v1';

export interface DatabaseState {
  users: UserProfile[];
  pharmacies: Pharmacy[];
  memberships: PharmacyMembership[];
  auditLogs: AuditLogEntry[];
  plans: SubscriptionPlan[];
  subscriptions: PharmacySubscription[];
  invoices: SubscriptionInvoice[];
  payments: PaymentRecord[];
  categories: MedicineCategory[];
  medicines: Medicine[];
  batches: MedicineBatch[];
  movements: InventoryMovement[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];
}

const initialSeedState: DatabaseState = {
  users: [
    {
      id: 'usr-owner-101',
      email: 'owner@apexpharma.com',
      fullName: 'Dr. Tariq Mahmood, RPh',
      phone: '+92 300 1234567',
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'usr-owner-102',
      email: 'owner@metropharma.com',
      fullName: 'Dr. Linda Vance, PharmD',
      phone: '+92 321 9876543',
      createdAt: '2026-08-10T10:00:00Z',
      updatedAt: '2026-08-10T10:00:00Z',
    },
  ],
  pharmacies: [
    {
      id: 'pharma-101',
      name: 'Apex Central Care Pharmacy',
      slug: 'apex-central-care',
      licenseNumber: 'PHA-PK-84920',
      ownerEmail: 'owner@apexpharma.com',
      ownerName: 'Dr. Tariq Mahmood, RPh',
      phone: '+92 300 1234567',
      address: 'Main Commercial Plaza, Blue Area',
      city: 'Islamabad',
      status: 'active',
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'pharma-102',
      name: 'Metropolitan Community Dispensary',
      slug: 'metro-community-dispensary',
      licenseNumber: 'PHA-PK-33901',
      ownerEmail: 'owner@metropharma.com',
      ownerName: 'Dr. Linda Vance, PharmD',
      phone: '+92 321 9876543',
      address: 'Plot 45-B, Phase 5 DHA',
      city: 'Lahore',
      status: 'active',
      createdAt: '2026-08-10T10:00:00Z',
      updatedAt: '2026-08-10T10:00:00Z',
    },
  ],
  memberships: [
    {
      id: 'mem-101',
      pharmacyId: 'pharma-101',
      userId: 'usr-owner-101',
      role: 'pharmacy_owner',
      status: 'active',
      createdAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'mem-102',
      pharmacyId: 'pharma-102',
      userId: 'usr-owner-102',
      role: 'pharmacy_owner',
      status: 'active',
      createdAt: '2026-08-10T10:00:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'log-01',
      action: 'SYSTEM_BOOT',
      targetEntity: 'platform',
      metadata: { message: 'Database initialized with Phase 3-7 schema' },
      createdAt: new Date().toISOString(),
    },
  ],
  plans: [
    {
      id: 'plan-basic',
      code: 'basic',
      name: 'Basic Single Counter',
      description: 'Ideal for independent community dispensaries getting started with digital stock and billing.',
      billingInterval: 'monthly',
      price: 4500, // PKR
      currency: 'PKR',
      features: [
        'Single store location & 1 active cashier terminal',
        'Barcode POS billing & thermal receipt printing',
        'Standard medicine inventory management',
        'Batch number & expiration date tracking',
      ],
      limits: { maxRegisters: 1, maxStaffAccounts: 2, allowMultiBranch: false, fefoAlerts: false },
      isActive: true,
      subscriberCount: 1,
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    },
    {
      id: 'plan-standard',
      code: 'standard',
      name: 'Standard Retail Pharmacy',
      description: 'Engineered for busy community pharmacies requiring automated FEFO batch alerts and supplier procurement.',
      billingInterval: 'monthly',
      price: 8500, // PKR
      currency: 'PKR',
      features: [
        'Up to 3 simultaneous cashier registers',
        'FEFO automated expiry alerts (First-Expire, First-Out)',
        'Supplier purchase orders & goods receiving (GRN)',
        'Customer credit khata & supplier payable ledger',
        'Daily profit & margin calculation reports',
      ],
      limits: { maxRegisters: 3, maxStaffAccounts: 5, allowMultiBranch: false, fefoAlerts: true },
      isActive: true,
      subscriberCount: 1,
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    },
    {
      id: 'plan-premium',
      code: 'premium',
      name: 'Premium Enterprise Chain',
      description: 'For high-volume retail chains with centralized multi-counter administrative management.',
      billingInterval: 'monthly',
      price: 15000, // PKR
      currency: 'PKR',
      features: [
        'Unlimited registers & staff accounts',
        'Multi-shop consolidated analytics',
        'Advanced procurement & purchase order tracking',
        'Full financial audit logging and priority support',
      ],
      limits: { maxRegisters: 99, maxStaffAccounts: 99, allowMultiBranch: true, fefoAlerts: true },
      isActive: true,
      subscriberCount: 0,
      createdAt: '2026-07-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    },
  ],
  subscriptions: [
    {
      id: 'sub-pharma-101',
      pharmacyId: 'pharma-101',
      planId: 'plan-standard',
      status: 'active',
      startAt: '2026-08-01T00:00:00Z',
      currentPeriodStart: '2026-10-01T00:00:00Z',
      currentPeriodEnd: '2026-11-01T00:00:00Z',
      cancelAtPeriodEnd: false,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'sub-pharma-102',
      pharmacyId: 'pharma-102',
      planId: 'plan-basic',
      status: 'active',
      startAt: '2026-08-10T00:00:00Z',
      currentPeriodStart: '2026-10-10T00:00:00Z',
      currentPeriodEnd: '2026-11-10T00:00:00Z',
      cancelAtPeriodEnd: false,
      createdAt: '2026-08-10T00:00:00Z',
      updatedAt: '2026-10-10T00:00:00Z',
    },
  ],
  invoices: [
    {
      id: 'inv-101-oct',
      pharmacyId: 'pharma-101',
      subscriptionId: 'sub-pharma-101',
      invoiceNumber: 'INV-2026-1001',
      billingPeriodStart: '2026-10-01T00:00:00Z',
      billingPeriodEnd: '2026-11-01T00:00:00Z',
      subtotal: 8500,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 8500,
      currency: 'PKR',
      status: 'paid',
      issuedAt: '2026-10-01T00:00:00Z',
      dueAt: '2026-10-08T00:00:00Z',
      paidAt: '2026-10-02T11:00:00Z',
      createdAt: '2026-10-01T00:00:00Z',
    },
  ],
  payments: [
    {
      id: 'pay-101-oct',
      pharmacyId: 'pharma-101',
      invoiceId: 'inv-101-oct',
      amount: 8500,
      currency: 'PKR',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      transactionReference: 'TRX-PK-98124',
      receivedAt: '2026-10-02T11:00:00Z',
      notes: 'Monthly standard subscription payment',
      createdAt: '2026-10-02T11:00:00Z',
    },
  ],
  categories: [
    { id: 'cat-1', pharmacyId: 'pharma-101', name: 'Antibiotics & Anti-infectives', createdAt: '2026-08-01T00:00:00Z' },
    { id: 'cat-2', pharmacyId: 'pharma-101', name: 'Analgesics & Antipyretics', createdAt: '2026-08-01T00:00:00Z' },
    { id: 'cat-3', pharmacyId: 'pharma-101', name: 'Cardiovascular & Anti-hypertensives', createdAt: '2026-08-01T00:00:00Z' },
    { id: 'cat-4', pharmacyId: 'pharma-101', name: 'Gastrointestinal & Antacids', createdAt: '2026-08-01T00:00:00Z' },
  ],
  medicines: [
    {
      id: 'med-101',
      pharmacyId: 'pharma-101',
      name: 'Augmentin 625mg',
      genericName: 'Amoxicillin + Clavulanic Acid',
      strength: '500mg/125mg',
      dosageForm: 'tablet',
      manufacturer: 'GSK Pakistan',
      barcode: '896400012345',
      categoryId: 'cat-1',
      categoryName: 'Antibiotics & Anti-infectives',
      unitOfMeasure: 'box',
      reorderLevel: 15,
      description: 'Film-coated oral tablets (Strip of 10x1)',
      isActive: true,
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
    },
    {
      id: 'med-102',
      pharmacyId: 'pharma-101',
      name: 'Panadol Extra 500mg',
      genericName: 'Paracetamol + Caffeine',
      strength: '500mg/65mg',
      dosageForm: 'tablet',
      manufacturer: 'Haleon Pakistan',
      barcode: '896400098765',
      categoryId: 'cat-2',
      categoryName: 'Analgesics & Antipyretics',
      unitOfMeasure: 'box',
      reorderLevel: 30,
      description: 'Pain relief and fever reduction tablets',
      isActive: true,
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
    },
    {
      id: 'med-103',
      pharmacyId: 'pharma-101',
      name: 'Lipiget 20mg',
      genericName: 'Atorvastatin Calcium',
      strength: '20mg',
      dosageForm: 'tablet',
      manufacturer: 'Getz Pharma',
      barcode: '896400055443',
      categoryId: 'cat-3',
      categoryName: 'Cardiovascular & Anti-hypertensives',
      unitOfMeasure: 'box',
      reorderLevel: 20,
      description: 'Lipid lowering agent',
      isActive: true,
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
    },
  ],
  batches: [
    {
      id: 'batch-aug-01',
      pharmacyId: 'pharma-101',
      medicineId: 'med-101',
      medicineName: 'Augmentin 625mg',
      batchNumber: 'AUG-2026-88',
      expiryDate: '2027-04-30',
      purchasePrice: 280,
      sellingPrice: 340,
      quantityReceived: 50,
      availableQuantity: 42,
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
    },
    {
      id: 'batch-pnd-01',
      pharmacyId: 'pharma-101',
      medicineId: 'med-102',
      medicineName: 'Panadol Extra 500mg',
      batchNumber: 'PND-2026-14',
      expiryDate: '2026-12-15', // Near expiry
      purchasePrice: 75,
      sellingPrice: 95,
      quantityReceived: 100,
      availableQuantity: 18,
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
    },
    {
      id: 'batch-lip-01',
      pharmacyId: 'pharma-101',
      medicineId: 'med-103',
      medicineName: 'Lipiget 20mg',
      batchNumber: 'LIP-2025-09',
      expiryDate: '2027-08-20',
      purchasePrice: 320,
      sellingPrice: 390,
      quantityReceived: 40,
      availableQuantity: 5, // Below reorder level 20
      createdAt: '2026-08-02T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
    },
  ],
  movements: [
    {
      id: 'mov-01',
      pharmacyId: 'pharma-101',
      medicineId: 'med-101',
      medicineName: 'Augmentin 625mg',
      batchId: 'batch-aug-01',
      batchNumber: 'AUG-2026-88',
      movementType: 'opening_stock',
      quantityDelta: 50,
      quantityBefore: 0,
      quantityAfter: 50,
      reason: 'Initial opening stock intake',
      createdAt: '2026-08-02T00:00:00Z',
    },
    {
      id: 'mov-02',
      pharmacyId: 'pharma-101',
      medicineId: 'med-102',
      medicineName: 'Panadol Extra 500mg',
      batchId: 'batch-pnd-01',
      batchNumber: 'PND-2026-14',
      movementType: 'opening_stock',
      quantityDelta: 100,
      quantityBefore: 0,
      quantityAfter: 100,
      reason: 'Initial opening stock intake',
      createdAt: '2026-08-02T00:00:00Z',
    },
  ],
  suppliers: [
    {
      id: 'sup-101',
      pharmacyId: 'pharma-101',
      name: 'Premier Pharmaceuticals Distributors',
      contactPerson: 'Khurram Shahzad',
      phone: '+92 333 4455667',
      email: 'orders@premierpharma.pk',
      address: 'Industrial Area, I-9, Islamabad',
      taxNumber: 'NTN-8829104-1',
      notes: 'Authorized distributor for GSK, Abbott, and Getz',
      isActive: true,
      totalPurchasesCount: 2,
      totalPurchasesValue: 42500,
      outstandingBalance: 14000,
      createdAt: '2026-08-05T00:00:00Z',
      updatedAt: '2026-08-05T00:00:00Z',
    },
    {
      id: 'sup-102',
      pharmacyId: 'pharma-101',
      name: 'Allied Medical Supplies Co.',
      contactPerson: 'Zubair Qureshi',
      phone: '+92 345 5566778',
      email: 'sales@alliedmedical.pk',
      address: 'Saddar Medicine Market, Rawalpindi',
      taxNumber: 'NTN-1102934-2',
      notes: 'Generics and OTC consumer health products',
      isActive: true,
      totalPurchasesCount: 1,
      totalPurchasesValue: 18000,
      outstandingBalance: 0,
      createdAt: '2026-08-10T00:00:00Z',
      updatedAt: '2026-08-10T00:00:00Z',
    },
  ],
  purchaseOrders: [
    {
      id: 'po-101',
      pharmacyId: 'pharma-101',
      supplierId: 'sup-101',
      supplierName: 'Premier Pharmaceuticals Distributors',
      poNumber: 'PO-2026-001',
      status: 'partially_received',
      totalAmount: 28000,
      discountAmount: 1400,
      netAmount: 26600,
      supplierInvoiceNumber: 'INV-SUP-9941',
      orderedAt: '2026-10-20T10:00:00Z',
      notes: 'Urgent seasonal restock for antibiotics and analgesics',
      items: [
        {
          id: 'poi-1',
          pharmacyId: 'pharma-101',
          purchaseOrderId: 'po-101',
          medicineId: 'med-101',
          medicineName: 'Augmentin 625mg',
          dosageForm: 'tablet',
          orderedQuantity: 50,
          receivedQuantity: 30,
          unitCost: 280,
          discountPercent: 5,
          lineTotal: 13300,
          createdAt: '2026-10-20T10:00:00Z',
        },
        {
          id: 'poi-2',
          pharmacyId: 'pharma-101',
          purchaseOrderId: 'po-101',
          medicineId: 'med-102',
          medicineName: 'Panadol Extra 500mg',
          dosageForm: 'tablet',
          orderedQuantity: 200,
          receivedQuantity: 100,
          unitCost: 75,
          discountPercent: 5,
          lineTotal: 14250,
          createdAt: '2026-10-20T10:00:00Z',
        },
      ],
      createdAt: '2026-10-20T10:00:00Z',
      updatedAt: '2026-10-22T14:00:00Z',
    },
  ],
  goodsReceipts: [
    {
      id: 'grn-101',
      pharmacyId: 'pharma-101',
      purchaseOrderId: 'po-101',
      grnNumber: 'GRN-2026-001',
      receivedDate: '2026-10-22T14:00:00Z',
      supplierInvoiceNumber: 'INV-SUP-9941',
      notes: 'First delivery batch received in good condition',
      items: [
        {
          id: 'gri-1',
          pharmacyId: 'pharma-101',
          goodsReceiptId: 'grn-101',
          purchaseOrderItemId: 'poi-1',
          medicineId: 'med-101',
          medicineName: 'Augmentin 625mg',
          batchNumber: 'AUG-2026-88',
          expiryDate: '2027-04-30',
          quantityReceived: 30,
          unitCost: 280,
          createdAt: '2026-10-22T14:00:00Z',
        },
      ],
      createdAt: '2026-10-22T14:00:00Z',
    },
  ],
};

class MockDatabaseStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return JSON.parse(JSON.stringify(initialSeedState));
  }

  private saveState(): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public updateState(updater: (draft: DatabaseState) => void): void {
    updater(this.state);
    this.saveState();
  }

  public resetToSeed(): void {
    this.state = JSON.parse(JSON.stringify(initialSeedState));
    this.saveState();
  }
}

export const dbStore = new MockDatabaseStore();
