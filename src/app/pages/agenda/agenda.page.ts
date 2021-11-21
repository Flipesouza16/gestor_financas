import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistrationFormComponent } from 'src/app/components/registration-form/registration-form.component';
import {
  PayloadRegistrationForm,
  PurchaseModel,
} from 'src/app/utils/types/purchaseType';
import { Storage } from '@capacitor/storage';
import PurchaseUtils from '../../utils/purchaseUtils';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  purchaseUtils = PurchaseUtils;
  purchases: PurchaseModel[] = [];

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private utilsCtrl: UtilsService) {}

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'purchases' });
    if (value) {
      this.purchases = JSON.parse(value);
      console.log('this.purchases: ', this.purchases);
    }
  }

  async addNewPurchase() {
    const modal = await this.modalCtrl.create({
      component: RegistrationFormComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('data: ', data);

    if (data) {
      const newPurchase = this.purchaseUtils.adapterPurchaseData({
        payloadPurchaseRegistration: data,
      }) as PurchaseModel;

      console.log('newPurchase: ', newPurchase);

      this.purchases.push(newPurchase);

      await this.savePurchases();
    }
  }

  async editPurchase(payloadPurchase: PurchaseModel) {
    console.log('payloadPurchase: ', payloadPurchase);

    const indexPurchase = this.purchases.indexOf(payloadPurchase);
    console.log('indexPurchase: ', indexPurchase);

    const modal = await this.modalCtrl.create({
      component: RegistrationFormComponent,
      componentProps: {
        isEditing: true,
        payloadPurchase,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      const payload = this.purchaseUtils.adapterPurchaseData({
        payloadPurchaseRegistration: data,
      }) as PurchaseModel;

      console.log('payload: ', payload);
      this.purchases[indexPurchase] = payload;

      await this.savePurchases();
    }
  }

  async savePurchases() {
    await Storage.set({
      key: 'purchases',
      value: JSON.stringify(this.purchases),
    });
  }

  async removerPurchase(purchase: PurchaseModel) {
    const alert = await this.alertCtrl.create({
      header: 'Quer mesmo remover esta compra?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: async () => {
            console.log(
              'this.purchases.indexOf(purchase): ',
              this.purchases.indexOf(purchase)
            );

            this.purchases.splice(this.purchases.indexOf(purchase), 1);
            this.utilsCtrl.showToast('Compra removida com sucesso!');
            await this.savePurchases();
          },
        },
      ],
    });

  await alert.present();
  }
}
