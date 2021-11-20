import { AdapterPurchase, PayloadRegistrationForm, PurchaseModel } from './types/purchaseType';

const adapterPurchaseData = ({ payloadPurchaseRegistration = null, payloadPurchaseModel = null, }: AdapterPurchase) => {
  if (payloadPurchaseRegistration) {
    const purchaseAdapted: PurchaseModel = {
      totalValue: payloadPurchaseRegistration.purchaseValue,
      installments: payloadPurchaseRegistration.purchaseInstallments,
      title: payloadPurchaseRegistration.purchaseTitle,
      buyer: payloadPurchaseRegistration.personWhoIsBuying,
      installmentAmount: payloadPurchaseRegistration.installmentAmount,
      isLate: false,
      isPaid: false,
    };
    return purchaseAdapted;
  } else if (payloadPurchaseModel) {
    const purchaseAdapted: PayloadRegistrationForm = {
      purchaseValue: payloadPurchaseModel.totalValue,
      purchaseInstallments: payloadPurchaseModel.installments,
      purchaseTitle: payloadPurchaseModel.title,
      personWhoIsBuying: payloadPurchaseModel.buyer,
      installmentAmount: payloadPurchaseModel.installmentAmount
    };
    return purchaseAdapted;
  }
};

const formatvalueAccordingToTheAmountOfZerosAtTheEnd = (
  purchaseValueFormatted: string
) => {
  const numbersSplitByDot = purchaseValueFormatted.split('.');
  const zeros = purchaseValueFormatted.slice(-2);
  const listZeros = zeros.split('');

  if (
    (listZeros[0] === '0' && listZeros[1] === '0') ||
    purchaseValueFormatted
  .length === 3) {
    purchaseValueFormatted = purchaseValueFormatted + '00';
  } else if (
    listZeros[1] === '0' ||
    (purchaseValueFormatted.includes('.') &&
      numbersSplitByDot[0].length === 2 &&
      numbersSplitByDot[1].length === 1)
  ) {
    purchaseValueFormatted = purchaseValueFormatted + '0';
  }
  return purchaseValueFormatted;
};

export default {
  adapterPurchaseData,
  formatvalueAccordingToTheAmountOfZerosAtTheEnd,
};
