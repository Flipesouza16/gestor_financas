import { AdapterPurchase, PayloadRegistrationForm, PurchaseModel } from './types/purchaseType';

const adapterPurchaseData = ({ payloadPurchaseRegistration = null, payloadPurchaseModel = null, }: AdapterPurchase) => {
  if (payloadPurchaseRegistration) {
    const purchaseAdapted: PurchaseModel = {
      value: payloadPurchaseRegistration.purchaseValue,
      installments: payloadPurchaseRegistration.purchaseInstallments,
      title: payloadPurchaseRegistration.purchaseTitle,
      buyer: payloadPurchaseRegistration.personWhoIsBuying,
      isLate: false,
      isPaid: false,
    };
    return purchaseAdapted;
  } else if (payloadPurchaseModel) {
    const purchaseAdapted: PayloadRegistrationForm = {
      purchaseValue: payloadPurchaseModel.value,
      purchaseInstallments: payloadPurchaseModel.installments,
      purchaseTitle: payloadPurchaseModel.title,
      personWhoIsBuying: payloadPurchaseModel.buyer,
    };
    return purchaseAdapted;
  }
};

const formatvalueAccordingToTheAmountOfZerosAtTheEnd = (
  purchaseValueFormatted: string
) => {
  const zeros = purchaseValueFormatted.slice(-2);
  const listZeros = zeros.split('');

  if (listZeros[0] === '0' && listZeros[1] === '0') {
    purchaseValueFormatted = purchaseValueFormatted + '00';
  } else if (listZeros[1] === '0') {
    purchaseValueFormatted = purchaseValueFormatted + '0';
  }
  return purchaseValueFormatted;
};

export default {
  adapterPurchaseData,
  formatvalueAccordingToTheAmountOfZerosAtTheEnd,
};
