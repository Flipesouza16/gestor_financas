import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

type PayloadRegistrationForm = {
  purchaseTitle: string;
  purchaseValue: string;
  personWhoIsBuying: string;
  purchaseInstallments: number;
};

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  payloadRegistrationForm: PayloadRegistrationForm = {
    personWhoIsBuying: '',
    purchaseInstallments: 1,
    purchaseTitle: '',
    purchaseValue: '',
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  addNewPurchase() {
    console.log('payloadRegistrationForm: ', this.payloadRegistrationForm);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
