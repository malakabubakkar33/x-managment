import { dbStore } from '../db/mockStore';
import { Supplier } from '../types/supplier';
import {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  GoodsReceipt,
  GoodsReceiptItem,
  ReceiveGoodsPayload,
} from '../types/purchase';
import { MedicineBatch, InventoryMovement } from '../types/inventory';

export const purchaseService = {
  // ==========================================
  // SUPPLIERS
  // ==========================================
  async getSuppliers(pharmacyId: string): Promise<Supplier[]> {
    const state = dbStore.getState();
    return state.suppliers
      .filter((s) => s.pharmacyId === pharmacyId)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getSupplierById(pharmacyId: string, id: string): Promise<Supplier | null> {
    const state = dbStore.getState();
    const sup = state.suppliers.find((s) => s.id === id && s.pharmacyId === pharmacyId);
    return sup || null;
  },

  async createSupplier(
    pharmacyId: string,
    input: Omit<
      Supplier,
      'id' | 'pharmacyId' | 'createdAt' | 'updatedAt' | 'totalPurchasesCount' | 'totalPurchasesValue' | 'outstandingBalance'
    >
  ): Promise<Supplier> {
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...input,
      id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      pharmacyId,
      totalPurchasesCount: 0,
      totalPurchasesValue: 0,
      outstandingBalance: 0,
      createdAt: now,
      updatedAt: now,
    };

    dbStore.updateState((draft) => {
      draft.suppliers.push(newSupplier);
      draft.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        pharmacyId,
        action: 'SUPPLIER_CREATED',
        targetEntity: 'suppliers',
        targetId: newSupplier.id,
        metadata: { name: newSupplier.name, phone: newSupplier.phone },
        createdAt: now,
      });
    });

    return newSupplier;
  },

  async updateSupplier(
    pharmacyId: string,
    id: string,
    input: Partial<Omit<Supplier, 'id' | 'pharmacyId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Supplier> {
    const now = new Date().toISOString();
    let updated: Supplier | null = null;

    dbStore.updateState((draft) => {
      const idx = draft.suppliers.findIndex((s) => s.id === id && s.pharmacyId === pharmacyId);
      if (idx === -1) {
        throw new Error('Supplier not found or unauthorized');
      }
      draft.suppliers[idx] = {
        ...draft.suppliers[idx],
        ...input,
        updatedAt: now,
      };
      updated = draft.suppliers[idx];
    });

    if (!updated) {
      throw new Error('Failed to update supplier');
    }
    return updated;
  },

  // ==========================================
  // PURCHASE ORDERS
  // ==========================================
  async getPurchaseOrders(pharmacyId: string): Promise<PurchaseOrder[]> {
    const state = dbStore.getState();
    return state.purchaseOrders
      .filter((po) => po.pharmacyId === pharmacyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getPurchaseOrderById(pharmacyId: string, id: string): Promise<PurchaseOrder | null> {
    const state = dbStore.getState();
    const po = state.purchaseOrders.find((p) => p.id === id && p.pharmacyId === pharmacyId);
    return po || null;
  },

  /**
   * CRITICAL BUSINESS RULE:
   * Creating a Purchase Order NEVER modifies medicine stock, batches, or movements.
   * Stock is only updated upon receiving goods (GRN).
   */
  async createPurchaseOrder(
    pharmacyId: string,
    input: {
      supplierId: string;
      notes?: string;
      status?: PurchaseOrderStatus;
      supplierInvoiceNumber?: string;
      items: Array<{
        medicineId: string;
        orderedQuantity: number;
        unitCost: number;
        discountPercent?: number;
      }>;
    },
    createdBy?: string
  ): Promise<PurchaseOrder> {
    const state = dbStore.getState();
    const supplier = state.suppliers.find((s) => s.id === input.supplierId && s.pharmacyId === pharmacyId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (!input.items || input.items.length === 0) {
      throw new Error('Purchase order must contain at least one item');
    }

    const now = new Date().toISOString();
    const poId = `po-${Date.now()}`;
    const year = new Date().getFullYear();
    const existingCount = state.purchaseOrders.filter((p) => p.pharmacyId === pharmacyId).length;
    const poNumber = `PO-${year}-${String(existingCount + 1).padStart(3, '0')}`;

    let totalAmount = 0;
    let totalDiscount = 0;

    const poItems: PurchaseOrderItem[] = input.items.map((item, idx) => {
      const med = state.medicines.find((m) => m.id === item.medicineId && m.pharmacyId === pharmacyId);
      const gross = item.orderedQuantity * item.unitCost;
      const discPercent = item.discountPercent || 0;
      const discount = Math.round((gross * discPercent) / 100);
      const net = gross - discount;

      totalAmount += gross;
      totalDiscount += discount;

      return {
        id: `poi-${Date.now()}-${idx + 1}`,
        pharmacyId,
        purchaseOrderId: poId,
        medicineId: item.medicineId,
        medicineName: med?.name || 'Unknown Medicine',
        dosageForm: med?.dosageForm || 'tablet',
        orderedQuantity: item.orderedQuantity,
        receivedQuantity: 0,
        unitCost: item.unitCost,
        discountPercent: discPercent,
        lineTotal: net,
        createdAt: now,
      };
    });

    const netAmount = totalAmount - totalDiscount;

    const newPO: PurchaseOrder = {
      id: poId,
      pharmacyId,
      supplierId: input.supplierId,
      supplierName: supplier.name,
      poNumber,
      status: input.status || 'ordered',
      totalAmount,
      discountAmount: totalDiscount,
      netAmount,
      notes: input.notes,
      supplierInvoiceNumber: input.supplierInvoiceNumber,
      orderedAt: now,
      items: poItems,
      createdBy: createdBy || 'Shop Admin',
      createdAt: now,
      updatedAt: now,
    };

    dbStore.updateState((draft) => {
      draft.purchaseOrders.unshift(newPO);
      const supIdx = draft.suppliers.findIndex((s) => s.id === input.supplierId && s.pharmacyId === pharmacyId);
      if (supIdx !== -1) {
        draft.suppliers[supIdx].totalPurchasesCount = (draft.suppliers[supIdx].totalPurchasesCount || 0) + 1;
      }
      draft.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        pharmacyId,
        action: 'PURCHASE_ORDER_CREATED',
        targetEntity: 'purchase_orders',
        targetId: poId,
        metadata: { poNumber, supplierName: supplier.name, netAmount },
        createdAt: now,
      });
    });

    return newPO;
  },

  async updatePurchaseOrderStatus(
    pharmacyId: string,
    id: string,
    status: PurchaseOrderStatus
  ): Promise<PurchaseOrder> {
    const now = new Date().toISOString();
    let updated: PurchaseOrder | null = null;

    dbStore.updateState((draft) => {
      const idx = draft.purchaseOrders.findIndex((p) => p.id === id && p.pharmacyId === pharmacyId);
      if (idx === -1) {
        throw new Error('Purchase order not found');
      }
      draft.purchaseOrders[idx].status = status;
      draft.purchaseOrders[idx].updatedAt = now;
      updated = draft.purchaseOrders[idx];
    });

    if (!updated) throw new Error('Failed to update PO');
    return updated;
  },

  // ==========================================
  // GOODS RECEIVING (GRN) & ATOMIC INVENTORY STOCK-IN
  // ==========================================
  async receiveGoods(
    pharmacyId: string,
    payload: ReceiveGoodsPayload,
    receivedBy?: string
  ): Promise<{ grn: GoodsReceipt; po: PurchaseOrder }> {
    const now = new Date().toISOString();
    let createdGrn: GoodsReceipt | null = null;
    let updatedPo: PurchaseOrder | null = null;

    dbStore.updateState((draft) => {
      const poIdx = draft.purchaseOrders.findIndex(
        (p) => p.id === payload.purchaseOrderId && p.pharmacyId === pharmacyId
      );
      if (poIdx === -1) {
        throw new Error('Purchase Order not found');
      }

      const po = draft.purchaseOrders[poIdx];
      if (po.status === 'fully_received' || po.status === 'cancelled') {
        throw new Error(`Cannot receive goods for order with status '${po.status}'`);
      }

      const year = new Date().getFullYear();
      const existingGrnCount = draft.goodsReceipts.filter((g) => g.pharmacyId === pharmacyId).length;
      const grnNumber = `GRN-${year}-${String(existingGrnCount + 1).padStart(3, '0')}`;
      const grnId = `grn-${Date.now()}`;

      const grnItems: GoodsReceiptItem[] = [];
      let totalReceivedValue = 0;

      for (const itemInput of payload.receivedItems) {
        if (itemInput.quantityReceiving <= 0) continue;

        const poItem = po.items.find((i) => i.id === itemInput.purchaseOrderItemId);
        if (!poItem) {
          throw new Error(`Purchase order item ${itemInput.purchaseOrderItemId} not found on this PO`);
        }

        const remaining = poItem.orderedQuantity - poItem.receivedQuantity;
        if (itemInput.quantityReceiving > remaining) {
          throw new Error(
            `Quantity ${itemInput.quantityReceiving} exceeds remaining order quantity (${remaining}) for ${poItem.medicineName}`
          );
        }

        // 1. Update PO item received quantity
        poItem.receivedQuantity += itemInput.quantityReceiving;

        // 2. Add to GRN Items
        const grnItem: GoodsReceiptItem = {
          id: `gri-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          pharmacyId,
          goodsReceiptId: grnId,
          purchaseOrderItemId: poItem.id,
          medicineId: itemInput.medicineId,
          medicineName: poItem.medicineName,
          batchNumber: itemInput.batchNumber.trim().toUpperCase(),
          expiryDate: itemInput.expiryDate,
          quantityReceived: itemInput.quantityReceiving,
          unitCost: itemInput.actualUnitCost || poItem.unitCost,
          createdAt: now,
        };
        grnItems.push(grnItem);

        totalReceivedValue += grnItem.quantityReceived * grnItem.unitCost;

        // 3. ATOMIC INVENTORY UPDATE: Find or create medicine batch
        const med = draft.medicines.find((m) => m.id === itemInput.medicineId && m.pharmacyId === pharmacyId);
        if (!med) {
          throw new Error(`Medicine ${itemInput.medicineId} not found in pharmacy catalog`);
        }

        let batch = draft.batches.find(
          (b) =>
            b.pharmacyId === pharmacyId &&
            b.medicineId === itemInput.medicineId &&
            b.batchNumber.toLowerCase() === itemInput.batchNumber.trim().toLowerCase()
        );

        let previousStock = 0;

        if (batch) {
          previousStock = batch.availableQuantity;
          batch.availableQuantity += itemInput.quantityReceiving;
          batch.quantityReceived += itemInput.quantityReceiving;
          batch.purchasePrice = itemInput.actualUnitCost || batch.purchasePrice;
          batch.expiryDate = itemInput.expiryDate || batch.expiryDate;
          batch.updatedAt = now;
        } else {
          const newBatchId = `batch-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
          const newBatch: MedicineBatch = {
            id: newBatchId,
            pharmacyId,
            medicineId: itemInput.medicineId,
            medicineName: med.name,
            batchNumber: itemInput.batchNumber.trim().toUpperCase(),
            expiryDate: itemInput.expiryDate,
            purchasePrice: itemInput.actualUnitCost || poItem.unitCost,
            sellingPrice: Math.round((itemInput.actualUnitCost || poItem.unitCost) * 1.25),
            quantityReceived: itemInput.quantityReceiving,
            availableQuantity: itemInput.quantityReceiving,
            createdAt: now,
            updatedAt: now,
          };
          draft.batches.push(newBatch);
          batch = newBatch;
        }

        // 4. ATOMIC IMMUTABLE MOVEMENT RECORD
        const movement: InventoryMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          pharmacyId,
          medicineId: itemInput.medicineId,
          medicineName: med.name,
          batchId: batch.id,
          batchNumber: batch.batchNumber,
          movementType: 'purchase_receipt',
          quantityDelta: itemInput.quantityReceiving,
          quantityBefore: previousStock,
          quantityAfter: batch.availableQuantity,
          referenceType: 'goods_receipt',
          referenceId: grnId,
          reason: `GRN: ${grnNumber} (PO: ${po.poNumber}), Batch: ${batch.batchNumber}`,
          createdAt: now,
        };
        draft.movements.unshift(movement);
      }

      if (grnItems.length === 0) {
        throw new Error('No items were received in this transaction');
      }

      // 5. Update PO status
      const allFullyReceived = po.items.every((i) => i.receivedQuantity >= i.orderedQuantity);
      const someReceived = po.items.some((i) => i.receivedQuantity > 0);

      po.status = allFullyReceived ? 'fully_received' : someReceived ? 'partially_received' : 'ordered';
      if (payload.supplierInvoiceNumber) {
        po.supplierInvoiceNumber = payload.supplierInvoiceNumber;
      }
      po.updatedAt = now;
      updatedPo = po;

      // 6. Record Goods Receipt
      createdGrn = {
        id: grnId,
        pharmacyId,
        purchaseOrderId: po.id,
        grnNumber,
        receivedDate: now,
        supplierInvoiceNumber: payload.supplierInvoiceNumber || po.supplierInvoiceNumber,
        notes: payload.notes,
        items: grnItems,
        receivedBy: receivedBy || 'Inventory Officer',
        createdAt: now,
      };
      draft.goodsReceipts.unshift(createdGrn);

      // 7. Update Supplier Payable Balance
      const supIdx = draft.suppliers.findIndex((s) => s.id === po.supplierId && s.pharmacyId === pharmacyId);
      if (supIdx !== -1) {
        draft.suppliers[supIdx].totalPurchasesValue =
          (draft.suppliers[supIdx].totalPurchasesValue || 0) + totalReceivedValue;
        draft.suppliers[supIdx].outstandingBalance =
          (draft.suppliers[supIdx].outstandingBalance || 0) + totalReceivedValue;
      }

      // 8. Audit Log
      draft.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        pharmacyId,
        action: 'GOODS_RECEIVED',
        targetEntity: 'goods_receipts',
        targetId: grnId,
        metadata: {
          grnNumber,
          poNumber: po.poNumber,
          itemsCount: grnItems.length,
          receivedValue: totalReceivedValue,
        },
        createdAt: now,
      });
    });

    if (!createdGrn || !updatedPo) {
      throw new Error('Goods receipt failed to process');
    }

    return { grn: createdGrn, po: updatedPo };
  },

  async getGoodsReceipts(pharmacyId: string, purchaseOrderId?: string): Promise<GoodsReceipt[]> {
    const state = dbStore.getState();
    return state.goodsReceipts
      .filter(
        (g) =>
          g.pharmacyId === pharmacyId &&
          (!purchaseOrderId || g.purchaseOrderId === purchaseOrderId)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
