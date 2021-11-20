import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegistrationFormComponent } from 'src/app/components/registration-form/registration-form.component';
import { PayloadRegistrationForm, PurchaseModel } from 'src/app/utils/types/purchaseType';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  public purchases: PurchaseModel[] = [];

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'purchases' });
    this.purchases = JSON.parse(value);
    console.log('this.purchases: ', this.purchases);
  }

  async addNewPurchase() {
    const modal = await this.modalCtrl.create({
      component: RegistrationFormComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    const payload = data as PayloadRegistrationForm;

    const newPurchase: PurchaseModel = {
      value: payload.purchaseValue,
      installments: payload.purchaseInstallments,
      title: payload.purchaseTitle,
      buyer: payload.personWhoIsBuying,
      isLate: false,
      isPaid: false,
    };

    this.purchases.push(newPurchase);

    await Storage.set({
      key: 'purchases',
      value: JSON.stringify(this.purchases),
    });
  }
}
