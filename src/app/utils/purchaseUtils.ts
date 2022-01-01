import { AdapterPurchase, PayloadRegistrationForm, PurchaseModel } from './types/purchaseType';
import { mascaraMoedaReal } from './utils';

const adapterPurchaseData = ({ payloadPurchaseRegistration = null, payloadPurchaseModel = null, }: AdapterPurchase) => {
  if (payloadPurchaseRegistration) {
    const purchaseAdapted: PurchaseModel = {
      hash: payloadPurchaseRegistration.hash,
      totalValue: payloadPurchaseRegistration.purchaseValue,
      installments: payloadPurchaseRegistration.purchaseInstallments,
      title: payloadPurchaseRegistration.purchaseTitle,
      buyer: payloadPurchaseRegistration.personWhoIsBuying,
      installmentAmount: payloadPurchaseRegistration.installmentAmount,
      totalInstallments: payloadPurchaseRegistration.totalInstallments,
      isLate: false,
      isPaid: false,
    };
    return purchaseAdapted;
  } else if (payloadPurchaseModel) {
    const purchaseAdapted: PayloadRegistrationForm = {
      hash: payloadPurchaseModel.hash,
      purchaseValue: payloadPurchaseModel.totalValue,
      purchaseInstallments: payloadPurchaseModel.totalInstallments,
      purchaseTitle: payloadPurchaseModel.title,
      personWhoIsBuying: payloadPurchaseModel.buyer,
      installmentAmount: payloadPurchaseModel.installmentAmount,
      totalInstallments: payloadPurchaseModel.totalInstallments,
    };
    return purchaseAdapted;
  }
};

const formatvalueAccordingToTheAmountOfZerosAtTheEnd = (
  purchaseValueFormatted: string
) => {
  const currentValue = purchaseValueFormatted.replace('.', ',');
  const valueWithMask = mascaraMoedaReal(purchaseValueFormatted);

  let newPurchaseValue = purchaseValueFormatted;
  let isValueCorrect = false;

  if (currentValue === valueWithMask) {
    isValueCorrect = true;
  } else {
    isValueCorrect = false;
  }

  let valueTemp = mascaraMoedaReal(purchaseValueFormatted).replace(',', '.');
  let valueToCompare;

  while (!isValueCorrect) {
    valueTemp = valueTemp + '0';
    newPurchaseValue = newPurchaseValue + '0';
    valueToCompare = Number(mascaraMoedaReal(valueTemp).replace(',', '.'));
    const currentValueWithMask = mascaraMoedaReal(valueTemp);

    let [valueFormatted] = currentValueWithMask.replace('.', '').split(',');
    valueFormatted = Number(valueFormatted);

    if (valueFormatted === Number(purchaseValueFormatted)) {
      valueToCompare = valueFormatted;
    }

    if (valueToCompare === Number(purchaseValueFormatted)) {
      isValueCorrect = true;
    } else {
      isValueCorrect = false;
    }
  }

  if (isValueCorrect) {
    purchaseValueFormatted = newPurchaseValue;
  }
  return purchaseValueFormatted;
};

export default {
  adapterPurchaseData,
  formatvalueAccordingToTheAmountOfZerosAtTheEnd,
};
