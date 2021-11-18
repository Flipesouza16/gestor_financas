import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { mascaraMoedaReal } from '../../utils/utils';

type PayloadRegistrationForm = {
  purchaseTitle: string;
  purchaseValue: number;
  personWhoIsBuying: string;
  purchaseInstallments: number;
};

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
    purchaseInstallments: 1,
    purchaseTitle: '',
    purchaseValue: 0,
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  addNewPurchase() {
    console.log('payloadRegistrationForm: ', this.payloadRegistrationForm);
  }

  formatValue(event) {
    const purchaseValue = event.target.value;
    this.purchaseValueFormatted = purchaseValue;
    this.payloadRegistrationForm.purchaseValue = parseFloat(
      this.mascaraMoedaReal(purchaseValue).replace('.', '').replace(',', '.')
    );
  }

  getInstallments(event) {
    const installment = event.target.value;
    this.payloadRegistrationForm.purchaseInstallments = installment;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
