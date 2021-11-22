export type PayloadRegistrationForm = {
  purchaseTitle: string;
  purchaseValue: number;
  installmentAmount: number;
  personWhoIsBuying: string;
  purchaseInstallments: number;
};

export type PurchaseModel = {
  title: string;
  totalValue: number;
  installmentAmount: number;
  isPaid: boolean;
  isLate: boolean;
  installments: number;
  buyer: string;
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
