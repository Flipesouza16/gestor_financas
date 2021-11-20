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

export type AdapterPurchase = {
  payloadPurchaseRegistration?: PayloadRegistrationForm;
  payloadPurchaseModel?: PurchaseModel;
};
