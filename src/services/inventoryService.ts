import { dbStore } from '../db/mockStore';
import {
  Medicine,
  MedicineBatch,
  InventoryMovement,
  MedicineCategory,
  StockAdjustmentPayload,
  DosageForm,
} from '../types/inventory';

export class InventoryService {
  public async getCategories(pharmacyId: string): Promise<MedicineCategory[]> {
    return dbStore.getState().categories.filter((c) => c.pharmacyId === pharmacyId);
  }

  public async getMedicines(
    pharmacyId: string,
    options?: {
      search?: string;
      categoryId?: string;
      stockStatus?: 'all' | 'low' | 'out' | 'normal';
    }
  ): Promise<Medicine[]> {
    const state = dbStore.getState();
    const batches = state.batches.filter((b) => b.pharmacyId === pharmacyId);

    let list = state.medicines
      .filter((m) => m.pharmacyId === pharmacyId)
      .map((m) => {
        const medBatches = batches.filter((b) => b.medicineId === m.id);
        const totalStock = medBatches.reduce((acc, b) => acc + b.availableQuantity, 0);

        // FEFO: Find nearest expiry date
        const validBatches = medBatches
          .filter((b) => b.availableQuantity > 0)
          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

        const nearestExpiry = validBatches.length > 0 ? validBatches[0].expiryDate : null;

        return {
          ...m,
          totalAvailableStock: totalStock,
          nearestExpiry,
        };
      });

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.genericName?.toLowerCase().includes(q) ||
          m.barcode?.includes(q) ||
          m.manufacturer?.toLowerCase().includes(q)
      );
    }

    if (options?.categoryId && options.categoryId !== 'all') {
      list = list.filter((m) => m.categoryId === options.categoryId);
    }

    if (options?.stockStatus && options.stockStatus !== 'all') {
      if (options.stockStatus === 'out') {
        list = list.filter((m) => (m.totalAvailableStock || 0) === 0);
      } else if (options.stockStatus === 'low') {
        list = list.filter((m) => (m.totalAvailableStock || 0) > 0 && (m.totalAvailableStock || 0) <= m.reorderLevel);
      } else if (options.stockStatus === 'normal') {
        list = list.filter((m) => (m.totalAvailableStock || 0) > m.reorderLevel);
      }
    }

    return list;
  }

  public async getMedicineById(pharmacyId: string, id: string): Promise<Medicine | null> {
    const list = await this.getMedicines(pharmacyId);
    const found = list.find((m) => m.id === id);
    return found || null;
  }

  public async createMedicine(
    pharmacyId: string,
    input: {
      name: string;
      genericName?: string;
      strength?: string;
      dosageForm: DosageForm;
      manufacturer?: string;
      barcode?: string;
      categoryId?: string;
      unitOfMeasure: string;
      reorderLevel: number;
      description?: string;
    }
  ): Promise<Medicine> {
    const now = new Date().toISOString();
    const id = `med-${Date.now().toString().slice(-6)}`;

    const state = dbStore.getState();
    const category = state.categories.find((c) => c.id === input.categoryId);

    const newMed: Medicine = {
      id,
      pharmacyId,
      name: input.name.trim(),
      genericName: input.genericName?.trim(),
      strength: input.strength?.trim(),
      dosageForm: input.dosageForm,
      manufacturer: input.manufacturer?.trim(),
      barcode: input.barcode?.trim(),
      categoryId: input.categoryId,
      categoryName: category?.name,
      unitOfMeasure: input.unitOfMeasure.trim() || 'box',
      reorderLevel: input.reorderLevel >= 0 ? input.reorderLevel : 10,
      description: input.description?.trim(),
      isActive: true,
      totalAvailableStock: 0,
      createdAt: now,
      updatedAt: now,
    };

    dbStore.updateState((draft) => {
      draft.medicines.unshift(newMed);
      draft.auditLogs.unshift({
        id: `log-${Date.now()}`,
        pharmacyId,
        action: 'MEDICINE_CREATED',
        targetEntity: 'medicines',
        targetId: id,
        metadata: { name: newMed.name, barcode: newMed.barcode },
        createdAt: now,
      });
    });

    return newMed;
  }

  public async getBatches(pharmacyId: string, medicineId?: string): Promise<MedicineBatch[]> {
    const state = dbStore.getState();
    let batches = state.batches.filter((b) => b.pharmacyId === pharmacyId);
    if (medicineId) {
      batches = batches.filter((b) => b.medicineId === medicineId);
    }
    // Sort FEFO (First-Expire, First-Out)
    return batches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }

  public async adjustStock(pharmacyId: string, payload: StockAdjustmentPayload): Promise<boolean> {
    const state = dbStore.getState();
    const batch = state.batches.find((b) => b.id === payload.batchId && b.pharmacyId === pharmacyId);
    if (!batch) throw new Error('Target batch not found for this pharmacy.');

    const medicine = state.medicines.find((m) => m.id === payload.medicineId && m.pharmacyId === pharmacyId);
    if (!medicine) throw new Error('Target medicine not found.');

    const quantityDelta = payload.adjustmentType === 'increase' ? payload.quantityDelta : -payload.quantityDelta;
    const newQty = batch.availableQuantity + quantityDelta;

    if (newQty < 0) {
      throw new Error(`Cannot deduct ${payload.quantityDelta} units. Current available stock is only ${batch.availableQuantity}.`);
    }

    const now = new Date().toISOString();
    const movementType = payload.adjustmentType === 'increase' ? 'stock_adjustment_in' : (
      payload.reason === 'damaged_stock' ? 'damaged_stock' : payload.reason === 'expired_stock' ? 'expired_stock' : 'stock_adjustment_out'
    );

    dbStore.updateState((draft) => {
      const b = draft.batches.find((item) => item.id === payload.batchId);
      if (b) {
        const before = b.availableQuantity;
        b.availableQuantity = newQty;
        b.updatedAt = now;

        // Append to immutable movements ledger
        draft.movements.unshift({
          id: `mov-${Date.now()}`,
          pharmacyId,
          medicineId: payload.medicineId,
          medicineName: medicine.name,
          batchId: payload.batchId,
          batchNumber: b.batchNumber,
          movementType,
          quantityDelta,
          quantityBefore: before,
          quantityAfter: newQty,
          reason: payload.notes || `Stock adjustment: ${payload.reason}`,
          createdAt: now,
        });

        draft.auditLogs.unshift({
          id: `log-${Date.now()}`,
          pharmacyId,
          action: 'STOCK_ADJUSTED',
          targetEntity: 'medicine_batches',
          targetId: b.id,
          metadata: { medicineId: medicine.id, delta: quantityDelta, reason: payload.reason },
          createdAt: now,
        });
      }
    });

    return true;
  }

  public async getAlerts(pharmacyId: string, nearExpiryDays = 90): Promise<{
    lowStock: Medicine[];
    outOfStock: Medicine[];
    nearExpiry: MedicineBatch[];
    expired: MedicineBatch[];
  }> {
    const medicines = await this.getMedicines(pharmacyId);
    const batches = await this.getBatches(pharmacyId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + nearExpiryDays);

    const lowStock = medicines.filter((m) => (m.totalAvailableStock || 0) > 0 && (m.totalAvailableStock || 0) <= m.reorderLevel);
    const outOfStock = medicines.filter((m) => (m.totalAvailableStock || 0) === 0);

    const expired: MedicineBatch[] = [];
    const nearExpiry: MedicineBatch[] = [];

    batches.forEach((b) => {
      if (b.availableQuantity <= 0) return;
      const exp = new Date(b.expiryDate);
      if (exp < today) {
        expired.push(b);
      } else if (exp <= thresholdDate) {
        nearExpiry.push(b);
      }
    });

    return { lowStock, outOfStock, nearExpiry, expired };
  }

  public async getInventoryAlerts(pharmacyId: string, nearExpiryDays = 90) {
    return this.getAlerts(pharmacyId, nearExpiryDays);
  }

  public async getMovements(pharmacyId: string, limit = 50): Promise<InventoryMovement[]> {
    return dbStore
      .getState()
      .movements.filter((m) => m.pharmacyId === pharmacyId)
      .slice(0, limit);
  }
}

export const inventoryService = new InventoryService();
