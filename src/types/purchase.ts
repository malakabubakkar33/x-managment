export type PurchaseOrderStatus =
  | 'draft'
  | 'ordered'
  | 'partially_received'
  | 'fully_received'
  | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  pharmacyId: string;
  purchaseOrderId: string;
  medicineId: string;
  medicineName?: string;
  dosageForm?: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  discountPercent: number;
  lineTotal: number;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  pharmacyId: string;
  supplierId: string;
  supplierName?: string;
  poNumber: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  notes?: string;
  supplierInvoiceNumber?: string;
  orderedAt?: string;
  items: PurchaseOrderItem[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptItem {
  id: string;
  pharmacyId: string;
  goodsReceiptId: string;
  purchaseOrderItemId: string;
  medicineId: string;
  medicineName?: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  quantityReceived: number;
  unitCost: number;
  createdAt: string;
}

export interface GoodsReceipt {
  id: string;
  pharmacyId: string;
  purchaseOrderId: string;
  grnNumber: string;
  receivedDate: string;
  supplierInvoiceNumber?: string;
  notes?: string;
  items: GoodsReceiptItem[];
  receivedBy?: string;
  createdAt: string;
}

export interface ReceiveItemInput {
  purchaseOrderItemId: string;
  medicineId: string;
  quantityReceiving: number;
  batchNumber: string;
  expiryDate: string;
  actualUnitCost: number;
}

export interface ReceiveGoodsPayload {
  purchaseOrderId: string;
  supplierInvoiceNumber?: string;
  notes?: string;
  receivedItems: ReceiveItemInput[];
}
