import { dbStore } from '../db/mockStore';
import {
  SubscriptionPlan,
  PharmacySubscription,
  SubscriptionInvoice,
  PaymentRecord,
  BillingInterval,
  PaymentMethod,
} from '../types/subscription';

export class SubscriptionService {
  /**
   * Calendar-month arithmetic handling month-ends (e.g. Jan 31 -> Feb 28/29)
   */
  public calculateNextPeriodEnd(startDate: Date, interval: BillingInterval): Date {
    const d = new Date(startDate);
    const monthsToAdd = interval === 'annual' ? 12 : 1;
    const targetMonth = d.getUTCMonth() + monthsToAdd;
    const originalDay = d.getUTCDate();

    d.setUTCMonth(targetMonth);
    // If month overflowed (e.g. Jan 31 -> March 2/3), snap to last day of target month
    if (d.getUTCDate() !== originalDay) {
      d.setUTCDate(0); // 0 sets to the last day of previous month
    }
    return d;
  }

  public async getPlans(): Promise<SubscriptionPlan[]> {
    const plans = dbStore.getState().plans;
    const subs = dbStore.getState().subscriptions;

    return plans.map((p) => ({
      ...p,
      subscriberCount: subs.filter((s) => s.planId === p.id && s.status === 'active').length,
    }));
  }

  public async createPlan(input: {
    name: string;
    description: string;
    price: number;
    billingInterval: BillingInterval;
    features: string[];
    limits?: SubscriptionPlan['limits'];
  }): Promise<SubscriptionPlan> {
    const now = new Date().toISOString();
    const id = `plan-${Date.now().toString().slice(-6)}`;
    const code = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newPlan: SubscriptionPlan = {
      id,
      code,
      name: input.name,
      description: input.description,
      billingInterval: input.billingInterval,
      price: input.price,
      currency: 'PKR',
      features: input.features,
      limits: input.limits || { maxRegisters: 1 },
      isActive: true,
      subscriberCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    dbStore.updateState((draft) => {
      draft.plans.push(newPlan);
      draft.auditLogs.unshift({
        id: `log-${Date.now()}`,
        action: 'SUBSCRIPTION_PLAN_CREATED',
        targetEntity: 'subscription_plans',
        targetId: id,
        metadata: { name: newPlan.name, price: newPlan.price },
        createdAt: now,
      });
    });

    return newPlan;
  }

  public async getSubscriptions(): Promise<PharmacySubscription[]> {
    const state = dbStore.getState();
    return state.subscriptions.map((s) => ({
      ...s,
      plan: state.plans.find((p) => p.id === s.planId),
    }));
  }

  public async getSubscriptionByPharmacyId(pharmacyId: string): Promise<PharmacySubscription | null> {
    const state = dbStore.getState();
    const sub = state.subscriptions.find((s) => s.pharmacyId === pharmacyId);
    if (!sub) return null;
    return {
      ...sub,
      plan: state.plans.find((p) => p.id === sub.planId),
    };
  }

  public async assignPlan(
    pharmacyId: string,
    planId: string,
    billingInterval: BillingInterval = 'monthly',
    startDate: string = new Date().toISOString()
  ): Promise<PharmacySubscription> {
    const plan = dbStore.getState().plans.find((p) => p.id === planId);
    if (!plan) throw new Error('Target subscription plan not found.');

    const start = new Date(startDate);
    const end = this.calculateNextPeriodEnd(start, billingInterval);
    const now = new Date().toISOString();

    const existingSubIndex = dbStore.getState().subscriptions.findIndex((s) => s.pharmacyId === pharmacyId);
    const subId = existingSubIndex >= 0 ? dbStore.getState().subscriptions[existingSubIndex].id : `sub-${pharmacyId}`;

    const newSub: PharmacySubscription = {
      id: subId,
      pharmacyId,
      planId,
      plan,
      status: 'active',
      startAt: start.toISOString(),
      currentPeriodStart: start.toISOString(),
      currentPeriodEnd: end.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now,
      updatedAt: now,
    };

    // Generate invoice
    const invNumber = `INV-${Date.now().toString().slice(-4)}`;
    const newInvoice: SubscriptionInvoice = {
      id: `inv-${Date.now()}`,
      pharmacyId,
      subscriptionId: subId,
      invoiceNumber: invNumber,
      billingPeriodStart: start.toISOString(),
      billingPeriodEnd: end.toISOString(),
      subtotal: plan.price,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: plan.price,
      currency: 'PKR',
      status: 'issued',
      issuedAt: now,
      dueAt: new Date(start.getTime() + 7 * 24 * 3600 * 1000).toISOString(),
      createdAt: now,
    };

    dbStore.updateState((draft) => {
      if (existingSubIndex >= 0) {
        draft.subscriptions[existingSubIndex] = newSub;
      } else {
        draft.subscriptions.push(newSub);
      }
      draft.invoices.unshift(newInvoice);

      draft.auditLogs.unshift({
        id: `log-${Date.now()}`,
        pharmacyId,
        action: 'SUBSCRIPTION_ASSIGNED',
        targetEntity: 'pharmacy_subscriptions',
        targetId: subId,
        metadata: { planId, planName: plan.name, currentPeriodEnd: end.toISOString() },
        createdAt: now,
      });
    });

    return newSub;
  }

  public async getInvoices(pharmacyId?: string): Promise<SubscriptionInvoice[]> {
    const invoices = dbStore.getState().invoices;
    if (pharmacyId) {
      return invoices.filter((i) => i.pharmacyId === pharmacyId);
    }
    return [...invoices];
  }

  public async getPayments(pharmacyId?: string): Promise<PaymentRecord[]> {
    const payments = dbStore.getState().payments;
    if (pharmacyId) {
      return payments.filter((p) => p.pharmacyId === pharmacyId);
    }
    return [...payments];
  }

  public async recordManualPayment(
    invoiceId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    transactionReference?: string,
    notes?: string
  ): Promise<PaymentRecord> {
    const state = dbStore.getState();
    const invoice = state.invoices.find((i) => i.id === invoiceId);
    if (!invoice) throw new Error('Target invoice not found.');

    const now = new Date().toISOString();
    const paymentId = `pay-${Date.now()}`;

    const newPayment: PaymentRecord = {
      id: paymentId,
      pharmacyId: invoice.pharmacyId,
      invoiceId,
      amount,
      currency: invoice.currency,
      paymentMethod,
      status: 'completed',
      transactionReference: transactionReference || `TRX-${Date.now().toString().slice(-6)}`,
      receivedAt: now,
      notes: notes || 'Admin recorded payment',
      createdAt: now,
    };

    dbStore.updateState((draft) => {
      draft.payments.unshift(newPayment);

      // Check if invoice is fully paid
      const inv = draft.invoices.find((i) => i.id === invoiceId);
      if (inv) {
        inv.status = 'paid';
        inv.paidAt = now;
      }

      // Ensure subscription is marked active
      const sub = draft.subscriptions.find((s) => s.id === invoice.subscriptionId);
      if (sub && (sub.status === 'past_due' || sub.status === 'pending')) {
        sub.status = 'active';
      }

      draft.auditLogs.unshift({
        id: `log-${Date.now()}`,
        pharmacyId: invoice.pharmacyId,
        action: 'PAYMENT_RECORDED',
        targetEntity: 'payment_records',
        targetId: paymentId,
        metadata: { amount, method: paymentMethod, invoiceId },
        createdAt: now,
      });
    });

    return newPayment;
  }
}

export const subscriptionService = new SubscriptionService();
