import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PayloadRegistrationForm } from 'src/app/utils/types/purchaseType';
import { mascaraMoedaReal } from '../../utils/utils';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  mascaraMoedaReal = mascaraMoedaReal;
  purchaseValueFormatted = '';
  payloadRegistrationForm: PayloadRegistrationForm = {
    personWhoIsBuying: '',
    purchaseInstallments: 0,
    purchaseTitle: '',
    purchaseValue: 0,
  };

  constructor(
    private modalCtrl: ModalController,
    private utilsCtrl: UtilsService,
  ) {}

  ngOnInit() {}

  async addNewPurchase() {
    console.log('payloadRegistrationForm: ', this.payloadRegistrationForm);
    const isAllValidFields = await this.isValidField(
      this.payloadRegistrationForm
    );
    if (isAllValidFields) {
      await this.utilsCtrl.showToast('Produto adicionado com sucesso!');
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
    this.payloadRegistrationForm.purchaseInstallments = installment;
  }

  dismiss(value?: PayloadRegistrationForm) {
    this.modalCtrl.dismiss(value);
  }
}
