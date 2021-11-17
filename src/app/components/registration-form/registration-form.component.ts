import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
