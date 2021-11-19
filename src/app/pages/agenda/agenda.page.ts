import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegistrationFormComponent } from 'src/app/components/registration-form/registration-form.component';
import { PayloadRegistrationForm, PurchaseModel } from 'src/app/utils/types/purchaseType';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  public compras: PurchaseModel[] = [
    {
      title: 'Monitor',
      value: 26150,
      isPaid: true,
      isLate: false,
      installments: 3,
    },
    {
      title: 'Celular',
      value: 126150,
      isPaid: false,
      isLate: false,
      installments: 2,
    },
    {
      title: 'Fatura do nubank',
      value: 80000,
      isPaid: true,
      isLate: false,
      installments: 1,
    },
    {
      title: 'Despesas da casa',
      value: 70000,
      isPaid: false,
      isLate: true,
      installments: 3,
    },
    {
      title: 'Portão',
      value: 9786,
      isPaid: false,
      isLate: false,
      installments: 1,
    },
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

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
      isLate: false,
      isPaid: false,
    };

    this.compras.push(newPurchase);
  }
}
