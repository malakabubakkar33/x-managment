export type DosageForm =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'cream'
  | 'drops'
  | 'inhaler'
  | 'suspension'
  | 'other';

export interface MedicineCategory {
  id: string;
  pharmacyId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  pharmacyId: string;
  name: string;
  genericName?: string;
  strength?: string;
  dosageForm: DosageForm;
  manufacturer?: string;
  barcode?: string;
  categoryId?: string;
  categoryName?: string;
  unitOfMeasure: string;
  reorderLevel: number;
  description?: string;
  isActive: boolean;
  totalAvailableStock?: number;
  nearestExpiry?: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineBatch {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName?: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice: number;
  sellingPrice: number;
  quantityReceived: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export type InventoryMovementType =
  | 'opening_stock'
  | 'stock_received'
  | 'purchase_receipt'
  | 'stock_adjustment_in'
  | 'stock_adjustment_out'
  | 'damaged_stock'
  | 'expired_stock'
  | 'stock_correction'
  | 'pos_sale'
  | 'sales_return';

export interface InventoryMovement {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName?: string;
  batchId?: string;
  batchNumber?: string;
  movementType: InventoryMovementType;
  quantityDelta: number;
  quantityBefore?: number;
  quantityAfter?: number;
  referenceType?: string;
  referenceId?: string;
  reason: string;
  actorUserId?: string;
  actorName?: string;
  createdAt: string;
}

export interface StockAdjustmentPayload {
  medicineId: string;
  batchId: string;
  adjustmentType: 'increase' | 'decrease';
  quantityDelta: number;
  reason: 'physical_count_correction' | 'damaged_stock' | 'expired_stock' | 'data_entry_correction';
  notes?: string;
}

export interface InventoryAlerts {
  lowStock: Medicine[];
  outOfStock: Medicine[];
  nearExpiry: MedicineBatch[];
  expired: MedicineBatch[];
}

