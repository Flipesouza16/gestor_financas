export type PayloadRegistrationForm = {
  hash: string;
  purchaseTitle: string;
  purchaseValue: number;
  installmentAmount: number;
  personWhoIsBuying: string;
  purchaseInstallments: number;
  totalInstallments: number;
  dueDate: string;
};

export type PurchaseModel = {
  hash: string;
  title: string;
  totalValue: number;
  installmentAmount: number;
  isPaid: boolean;
  isLate: boolean;
  installments: number;
  buyer: string;
  totalInstallments: number;
  month?: string;
  dueDate: string;
};

export type AllPurchaseByMonth = {
  january: PurchaseModel[];
  february: PurchaseModel[];
  march: PurchaseModel[];
  april: PurchaseModel[];
  may: PurchaseModel[];
  june: PurchaseModel[];
  july: PurchaseModel[];
  august: PurchaseModel[];
  september: PurchaseModel[];
  october: PurchaseModel[];
  november: PurchaseModel[];
  december: PurchaseModel[];
};

export type AdapterPurchase = {
  payloadPurchaseRegistration?: PayloadRegistrationForm;
  payloadPurchaseModel?: PurchaseModel;
};
