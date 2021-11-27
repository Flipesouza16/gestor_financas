import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import {
  PayloadRegistrationForm,
  PurchaseModel,
} from 'src/app/utils/types/purchaseType';
import { mascaraMoedaReal } from '../../utils/utils';
import PurchaseUtils from 'src/app/utils/purchaseUtils';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  mascaraMoedaReal = mascaraMoedaReal;
  purchaseUtils = PurchaseUtils;
  isEditing = false;
  payloadPurchase: PurchaseModel;
  purchaseValueFormatted = '';
  payloadRegistrationForm: PayloadRegistrationForm = {
    hash: '',
    personWhoIsBuying: '',
    purchaseInstallments: 0,
    purchaseTitle: '',
    purchaseValue: 0,
    installmentAmount: 0,
    totalInstallments: 0,
  };

  constructor(
    private modalCtrl: ModalController,
    private utilsCtrl: UtilsService
  ) {}

  ngOnInit() {
    if (this.isEditing) {
      this.payloadRegistrationForm = this.purchaseUtils.adapterPurchaseData({
        payloadPurchaseModel: this.payloadPurchase,
      }) as PayloadRegistrationForm;

      this.purchaseValueFormatted =
        this.purchaseUtils.formatvalueAccordingToTheAmountOfZerosAtTheEnd(
          String(this.payloadRegistrationForm.purchaseValue)
        );

      console.log(
        'this.payloadRegistrationForm: ',
        this.payloadRegistrationForm
      );
    }
  }

  async addNewOrEditPurchase() {
    console.log('payloadRegistrationForm: ', this.payloadRegistrationForm);
    const isAllValidFields = await this.isValidField(
      this.payloadRegistrationForm
    );
    if (isAllValidFields) {
      if (this.isEditing) {
        await this.utilsCtrl.showToast('Produto atualizado com sucesso!');
      } else {
        await this.utilsCtrl.showToast('Produto adicionado com sucesso!');
      }

      // value of installments
      this.payloadRegistrationForm.installmentAmount =
        this.payloadRegistrationForm.purchaseValue /
        this.payloadRegistrationForm.purchaseInstallments;

      this.payloadRegistrationForm.installmentAmount = Number(
        this.payloadRegistrationForm.installmentAmount.toFixed(2)
      );

      //total installments
      this.payloadRegistrationForm.totalInstallments =
        this.payloadRegistrationForm.purchaseInstallments;

      setTimeout(() => {
        this.dismiss(this.payloadRegistrationForm);
      }, 1500);
    }
  }

  formatValue(event) {
    const purchaseValue = event.target.value;
    this.purchaseValueFormatted = purchaseValue;
    this.payloadRegistrationForm.purchaseValue = parseFloat(
      this.mascaraMoedaReal(purchaseValue).replace('.', '').replace(',', '.')
    );
  }

  async isValidField(payloadPurchase: PayloadRegistrationForm) {
    if (!payloadPurchase.purchaseTitle) {
      return await this.utilsCtrl.showToast('Qual o título da compra?');
    }
    if (!payloadPurchase.purchaseValue) {
      return await this.utilsCtrl.showToast('Qual o valor da compra?');
    }
    if (!payloadPurchase.personWhoIsBuying) {
      return await this.utilsCtrl.showToast('Quem está comprando?');
    }
    if (!payloadPurchase.purchaseInstallments) {
      return await this.utilsCtrl.showToast('São quantas parcelas?');
    }
    return true;
  }

  getInstallments(event) {
    const installment = event.target.value;
    this.payloadRegistrationForm.purchaseInstallments = Number(installment);
  }

  dismiss(value?: PayloadRegistrationForm) {
    this.modalCtrl.dismiss(value);
  }
}
