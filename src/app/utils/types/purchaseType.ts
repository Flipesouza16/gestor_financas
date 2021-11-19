export type PayloadRegistrationForm = {
  purchaseTitle: string;
  purchaseValue: number;
  personWhoIsBuying: string;
  purchaseInstallments: number;
};

export type PurchaseModel = {
  title: string;
  value: number;
  isPaid: boolean;
  isLate: boolean;
  installments: number;
};
