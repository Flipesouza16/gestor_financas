import { ApplicationRef, Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistrationFormComponent } from 'src/app/components/registration-form/registration-form.component';
import {
  AllPurchaseByMonth,
  PayloadRegistrationForm,
  PurchaseModel,
} from 'src/app/utils/types/purchaseType';
import { Storage } from '@capacitor/storage';
import PurchaseUtils from '../../utils/purchaseUtils';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { monthNames, monthTranslatedNames } from '../../utils/utils';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  monthTranslatedNames = monthTranslatedNames;
  purchaseUtils = PurchaseUtils;
  purchases: PurchaseModel[] = [];
  isAnInvoiceForTheNextMonth = false;
  isAnInvoiceForThePreviousMonth = false;
  nextMonth: string;
  currentMonth: string;
  currentMonthIndex: number;
  selectedMonth: string;
  nextMonthIndex: number;
  listPurchasesByMonth: AllPurchaseByMonth = {
    january: [],
    february: [],
    march: [],
    april: [],
    may: [],
    june: [],
    july: [],
    august: [],
    september: [],
    october: [],
    november: [],
    december: [],
  };

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private utilsCtrl: UtilsService,
    private ref: ApplicationRef
  ) {}

  async ngOnInit() {
    await this.loadSaveData();
    console.log('this.selectedMonth: ', this.selectedMonth);
    console.log('this.listPurchasesByMonth: ', this.listPurchasesByMonth);
    console.log('this.nextMonthIndex: ', this.nextMonthIndex);
    // console.log('The current month is ', this.currentMonthName);
  }

  async loadSaveData() {
    this.currentMonthIndex = new Date().getMonth();
    this.nextMonthIndex = this.currentMonthIndex + 1;
    if (this.nextMonthIndex > 11) {
      this.nextMonthIndex = 0;
    }

    this.currentMonth = monthNames[this.nextMonthIndex];
    this.nextMonth = monthNames[this.nextMonthIndex];
    this.selectedMonth = this.nextMonth;

    const { value } = await Storage.get({ key: 'list-purchases-by-month' });
    if (value) {
      this.listPurchasesByMonth = JSON.parse(value);
      this.purchases = this.listPurchasesByMonth[this.selectedMonth];
      console.log('this.listPurchasesByMonth: ', this.listPurchasesByMonth);
    }
    this.checkIfThereIsAnInvoiceForTheNextMonth();
  }

  async addNewPurchase() {
    const modal = await this.modalCtrl.create({
      component: RegistrationFormComponent,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      const newPurchase = this.purchaseUtils.adapterPurchaseData({
        payloadPurchaseRegistration: data,
      }) as PurchaseModel;

      console.log('newPurchase: ', newPurchase);

      this.purchases.push(newPurchase);
      this.listPurchasesByMonth[this.currentMonth] = this.purchases;

      this.addInstallmentsPerMonth(newPurchase);

      console.log('this.listPurchasesByMonth: ', this.listPurchasesByMonth);

      this.ref.tick();
      await this.savePurchases();
    }
  }

  addInstallmentsPerMonth(newPurchase: PurchaseModel) {
    if (newPurchase.installments > 1) {
      let totalInstallments = newPurchase.installments;
      let nextMonths = this.currentMonthIndex + 1;

      if (nextMonths > 11) {
        nextMonths = 0;
      }

      while (totalInstallments > 1) {
        const purchaseNextMonth = JSON.parse(
          JSON.stringify(newPurchase)
        ) as PurchaseModel;

        totalInstallments--;
        nextMonths++;
        purchaseNextMonth.installments = totalInstallments;

        if (nextMonths > 11) {
          nextMonths = 0;
        }

        this.listPurchasesByMonth[monthNames[nextMonths]].push(
          purchaseNextMonth
        );
      }
    }
  }

  async editPurchase(payloadPurchase: PurchaseModel) {
    const indexPurchase = this.purchases.indexOf(payloadPurchase);

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

      this.backToStart(payloadPurchase);

      this.listPurchasesByMonth[monthNames[this.currentMonthIndex + 1]][
        indexPurchase
      ] = payload;

      if (payloadPurchase.totalInstallments > 1) {
        let totalInstallments = payloadPurchase.totalInstallments;
        let currentInstallment = payload.installments;
        let nextMonths = this.currentMonthIndex + 1;

        while (totalInstallments > 1) {
          const purchaseNextMonth = JSON.parse(
            JSON.stringify(payload)
          ) as PurchaseModel;

          totalInstallments--;
          currentInstallment--;
          nextMonths++;

          if (nextMonths > 11) {
            nextMonths = 0;
          }

          const nextMonthInstallment = currentInstallment;
          purchaseNextMonth.installments = nextMonthInstallment;

          if (purchaseNextMonth.installments < 1) {
            this.removerInstallment(
              payloadPurchase.totalInstallments,
              nextMonths,
              purchaseNextMonth
            );
          } else {
            this.listPurchasesByMonth[monthNames[nextMonths]][indexPurchase] =
              purchaseNextMonth;
          }
        }

        // this.ref.tick();
        // await this.savePurchases();
      }
    }
  }

  removerInstallment(
    totalInstallment: number,
    nextMonths: number,
    purchaseNextMonth: PurchaseModel
  ) {
    for (let i = nextMonths; i <= totalInstallment; i++) {
      for (const purchase of this.listPurchasesByMonth[monthNames[i]]) {
        if (purchase.hash === purchaseNextMonth.hash) {
          const indexPurchase =
            this.listPurchasesByMonth[monthNames[i]].indexOf(purchase);
          this.listPurchasesByMonth[monthNames[i]].splice(indexPurchase, 1);
        }
      }
    }
    this.checkIfThereIsAnInvoiceForTheNextMonth();
  }

  async savePurchases() {
    this.checkIfThereIsAnInvoiceForTheNextMonth();

    await Storage.set({
      key: 'list-purchases-by-month',
      value: JSON.stringify(this.listPurchasesByMonth),
    });
  }

  async removerPurchase(purchaseToRemove: PurchaseModel) {
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
              this.purchases.indexOf(purchaseToRemove)
            );

            this.purchases.splice(this.purchases.indexOf(purchaseToRemove), 1);
            this.listPurchasesByMonth[this.selectedMonth] = this.purchases;

            const allPurchases = Object.values(this.listPurchasesByMonth);

            for (const purchases of allPurchases) {
              if (purchases.length) {
                for (const purchase of purchases) {
                  if (purchase.hash === purchaseToRemove.hash) {
                    console.log('irei excluir este purchase: ', purchase);
                    purchases.splice(purchases.indexOf(purchase), 1);
                    this.backToStart(purchase);
                  }
                }
              }
            }

            this.utilsCtrl.showToast('Compra removida com sucesso!');
            await this.savePurchases();
          },
        },
      ],
    });

    await alert.present();
  }

  backToStart(purchase: PurchaseModel) {
    this.selectedMonth = monthNames[this.currentMonthIndex + 1];
    this.isAnInvoiceForThePreviousMonth = false;
    this.nextMonthIndex = this.currentMonthIndex + 1;

    if (purchase.totalInstallments > 1) {
      this.isAnInvoiceForTheNextMonth = true;
    }
  }

  checkIfThereIsAnInvoiceForTheNextMonth() {
    this.isAnInvoiceForTheNextMonth = false;
    for (const purchase of this.listPurchasesByMonth[this.selectedMonth]) {
      console.log('purchase.installments: ', purchase.installments);
      if (purchase.installments > 1) {
        this.isAnInvoiceForTheNextMonth = true;
        break;
      }
      if (purchase.installments === 1) {
        this.isAnInvoiceForTheNextMonth = false;
      }
    }
  }

  checkIfThereIsAnInvoiceForThePreviousMonth() {
    this.isAnInvoiceForThePreviousMonth = false;
    for (const purchase of this.listPurchasesByMonth[this.selectedMonth]) {
      this.selectedMonth = monthNames[this.nextMonthIndex];

      let aux = this.nextMonthIndex - 1;
      if (aux < 0) {
        aux = 11;
      }

      const monthTest = monthNames[aux];

      if (!this.listPurchasesByMonth[monthTest][0]?.installments) {
        this.isAnInvoiceForThePreviousMonth = false;
        break;
      }

      if (purchase.installments > 1) {
        this.isAnInvoiceForThePreviousMonth = true;
        break;
      }
    }
  }

  loadNextInvoinces() {
    this.isAnInvoiceForThePreviousMonth = true;
    this.nextMonthIndex++;
    if (this.nextMonthIndex > 11) {
      this.nextMonthIndex = 0;
    }

    this.selectedMonth = monthNames[this.nextMonthIndex];
    this.purchases = this.listPurchasesByMonth[this.selectedMonth];
    this.checkIfThereIsAnInvoiceForTheNextMonth();
  }

  loadPreviousInvoices() {
    this.isAnInvoiceForTheNextMonth = true;
    this.nextMonthIndex--;
    if (this.nextMonthIndex < 0) {
      this.nextMonthIndex = 11;
    }

    this.selectedMonth = monthNames[this.nextMonthIndex];
    this.purchases = this.listPurchasesByMonth[this.selectedMonth];
    this.checkIfThereIsAnInvoiceForThePreviousMonth();
  }
}
