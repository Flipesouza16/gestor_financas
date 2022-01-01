import { ApplicationRef, Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistrationFormComponent } from 'src/app/components/registration-form/registration-form.component';
import {
  AllPurchaseByMonth,
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
  amountOfCurrentMonthsInstallments = {
    totalAlreadyPaid: 0,
    totalToPay: 0,
  };
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
    const isSomeLateInstallment = await this.checkForLatePurchaseInvoice();
    if (isSomeLateInstallment) {
      this.isAnInvoiceForThePreviousMonth = true;
    }

    this.checkTotalAmountOfCurrentMonthsInstallments();
  }

  checkTotalAmountOfCurrentMonthsInstallments() {
    this.amountOfCurrentMonthsInstallments.totalToPay = 0;
    this.amountOfCurrentMonthsInstallments.totalAlreadyPaid = 0;

    for (const purchase of this.listPurchasesByMonth[this.selectedMonth]) {
      this.amountOfCurrentMonthsInstallments.totalToPay +=
        purchase.installmentAmount;

      if (purchase.isPaid) {
        this.amountOfCurrentMonthsInstallments.totalAlreadyPaid +=
          purchase.installmentAmount;
      }
    }
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

      this.purchases = JSON.parse(
        JSON.stringify(this.listPurchasesByMonth[this.selectedMonth])
      );
    }
    this.checkIfThereIsAnInvoiceForTheNextMonth();
  }

  purchasePaid(isPaid: boolean, purchase: PurchaseModel) {
    if (isPaid) {
      const indexPurchase =
        this.listPurchasesByMonth[this.selectedMonth].indexOf(purchase);

      // set purchase to paid
      this.listPurchasesByMonth[this.selectedMonth][indexPurchase].isPaid =
        true;

      // set the purchase as not delayed
      this.listPurchasesByMonth[this.selectedMonth][indexPurchase].isLate =
        false;

      this.checkIfThereIsAnInvoiceForThePreviousMonth();
      this.checkTotalAmountOfCurrentMonthsInstallments();
      this.savePurchases();
    }
  }

  async checkForLatePurchaseInvoice() {
    let indexPreviousMonth = this.currentMonthIndex;
    let isPreviousPurchase = false;
    let totalOverduePurchases = 0;
    let previousMonthName: string;

    do {
      previousMonthName = monthNames[indexPreviousMonth];

      let isAllInstallmentHaveBeenPaid = true;

      if (
        this.listPurchasesByMonth[previousMonthName]?.length &&
        indexPreviousMonth !== this.currentMonthIndex
      ) {
        for (const previousPurchase of this.listPurchasesByMonth[
          previousMonthName
        ]) {
          if (!previousPurchase.isPaid) {
            previousPurchase.isLate = true;
            totalOverduePurchases++;
            isAllInstallmentHaveBeenPaid = false;
          }
        }
      }

      if (
        this.listPurchasesByMonth[previousMonthName]?.length &&
        indexPreviousMonth === this.currentMonthIndex
      ) {
        let totalInstallmentToBePaid = 0;
        for (const previousPurchase of this.listPurchasesByMonth[
          previousMonthName
        ]) {
          if (!previousPurchase.isPaid) {
            totalInstallmentToBePaid++;
            isAllInstallmentHaveBeenPaid = false;
          }
        }

        if (!isAllInstallmentHaveBeenPaid) {
          await this.utilsCtrl.showAlert(
            `Você possui ${totalInstallmentToBePaid} ${
              totalInstallmentToBePaid > 1
                ? 'faturas pendentes'
                : 'fatura pendente'
            } para pagar nesse mês de ${
              monthTranslatedNames[previousMonthName]
            }`
          );

          // go to current month
          this.loadPreviousInvoices();
        }
      }

      if (isPreviousPurchase && !isAllInstallmentHaveBeenPaid) {
        await this.utilsCtrl.showAlert(
          `Você possui ${totalOverduePurchases} ${
            totalOverduePurchases > 1 ? 'faturas atrasadas' : 'fatura atrasada'
          } de ${monthTranslatedNames[previousMonthName]}`
        );
      }

      // Repeat check with previous month
      indexPreviousMonth = indexPreviousMonth - 1;

      if (indexPreviousMonth < 0) {
        indexPreviousMonth = 11;
      }

      if (this.listPurchasesByMonth[previousMonthName]?.length) {
        isPreviousPurchase = true;
      }
    } while (this.listPurchasesByMonth[previousMonthName]?.length);

    return isPreviousPurchase;
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

      this.backToStart(newPurchase);
      this.purchases.push(newPurchase);

      this.listPurchasesByMonth[this.currentMonth] = this.purchases;
      this.addInstallmentsPerMonth(newPurchase);
      this.checkIfThereIsAnInvoiceForThePreviousMonth();
      this.checkTotalAmountOfCurrentMonthsInstallments();
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

        const currentMonth = monthNames[nextMonths];

        purchaseNextMonth.month = currentMonth;

        this.listPurchasesByMonth[currentMonth].push(purchaseNextMonth);
      }
    }
  }

  async editPurchase(payloadPurchase: PurchaseModel) {
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

      payload.month = monthNames[this.nextMonthIndex];

      const { indexPurchaseList, isPurchaseExist } =
        this.checkIndexPurchaseOfList(payloadPurchase);

      if (isPurchaseExist) {
        this.listPurchasesByMonth[monthNames[this.nextMonthIndex]][
          indexPurchaseList
        ] = payload;
      }

      if (
        payloadPurchase.totalInstallments > 1 ||
        payload.totalInstallments > payloadPurchase.totalInstallments
      ) {
        const isInstallmentsOfUpdatedGreaterThanPreviousOne =
          payload.totalInstallments > payloadPurchase.totalInstallments;

        let totalInstallments = isInstallmentsOfUpdatedGreaterThanPreviousOne
          ? payload.totalInstallments
          : payloadPurchase.totalInstallments;

        let currentInstallment = payload.installments;
        let nextMonths = this.nextMonthIndex;

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

          purchaseNextMonth.month = monthNames[nextMonths];
          const nextMonthInstallment = currentInstallment;
          purchaseNextMonth.installments = nextMonthInstallment;

          if (purchaseNextMonth.installments < 1) {
            this.removerInstallment(
              payloadPurchase.totalInstallments,
              nextMonths,
              purchaseNextMonth
            );
          } else {
            const {
              indexPurchaseList: indexPurchaseListAux,
              isPurchaseExist: isPurchaseExistAux,
            } = this.checkIndexPurchaseOfList(payloadPurchase, nextMonths);

            if (isPurchaseExistAux) {
              this.listPurchasesByMonth[monthNames[nextMonths]][
                indexPurchaseListAux
              ] = purchaseNextMonth;
            } else {
              this.listPurchasesByMonth[monthNames[nextMonths]].push(
                purchaseNextMonth
              );
            }
          }
        }

        this.checkIfThereIsAnInvoiceForThePreviousMonth();
        this.checkTotalAmountOfCurrentMonthsInstallments();
        this.ref.tick();
        await this.savePurchases();
      }
    }
  }

  checkIndexPurchaseOfList(payloadPurchase, nextMonths?) {
    let isPurchaseExist = false;
    let indexPurchaseList;

    const nextMonthIndex = nextMonths ? nextMonths : this.nextMonthIndex;

    for (const purchaseOfList of this.listPurchasesByMonth[
      monthNames[nextMonthIndex]
    ]) {
      if (purchaseOfList.hash === payloadPurchase.hash) {
        isPurchaseExist = true;
        indexPurchaseList =
          this.listPurchasesByMonth[monthNames[nextMonthIndex]].indexOf(
            purchaseOfList
          );
      }
    }

    return {
      isPurchaseExist,
      indexPurchaseList,
    };
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

  async removePurchase(purchaseToRemove: PurchaseModel) {
    this.purchases.splice(this.purchases.indexOf(purchaseToRemove), 1);
    this.listPurchasesByMonth[this.selectedMonth] = this.purchases;

    const allPurchases = Object.values(this.listPurchasesByMonth);

    for (const purchases of allPurchases) {
      if (purchases.length) {
        for (const purchase of purchases) {
          if (purchase.hash === purchaseToRemove.hash) {
            purchases.splice(purchases.indexOf(purchase), 1);
            this.backToStart(purchase);
          }
        }
      }
    }

    this.utilsCtrl.showToast('Compra removida com sucesso!');
    this.checkIfThereIsAnInvoiceForThePreviousMonth();
    this.checkTotalAmountOfCurrentMonthsInstallments();
    await this.savePurchases();
  }

  async alertAboutRemovePurchase(purchaseToRemove: PurchaseModel) {
    const alertToNoticeOneMoreTime = await this.alertCtrl.create({
      header:
        'Essa ação irá remover esta compra de todos os meses, Deseja continuar?',
      mode: 'ios',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: async () => {
            await this.removePurchase(purchaseToRemove);
          },
        },
      ],
    });

    const firstAlert = await this.alertCtrl.create({
      header: 'Quer mesmo remover esta compra?',
      mode: 'ios',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: async () => {
            await alertToNoticeOneMoreTime.present();
          },
        },
      ],
    });

    await firstAlert.present();
  }

  backToStart(purchase: PurchaseModel) {
    this.nextMonthIndex = this.currentMonthIndex + 1;
    this.isAnInvoiceForThePreviousMonth = false;

    if (this.nextMonthIndex > 11) {
      this.nextMonthIndex = 0;
    }
    this.selectedMonth = monthNames[this.nextMonthIndex];

    this.purchases = JSON.parse(
      JSON.stringify(this.listPurchasesByMonth[this.selectedMonth])
    );

    if (purchase.totalInstallments > 1) {
      this.isAnInvoiceForTheNextMonth = true;
    }
  }

  checkIfThereIsAnInvoiceForTheNextMonth() {
    this.isAnInvoiceForTheNextMonth = false;

    let indexNextMonth = this.nextMonthIndex + 1;

    if (indexNextMonth > 11) {
      indexNextMonth = 0;
    }

    const nameNextMonth = monthNames[indexNextMonth];

    for (const purchase of this.listPurchasesByMonth[nameNextMonth]) {
      if (purchase.installments) {
        this.isAnInvoiceForTheNextMonth = true;
        break;
      }
    }
  }

  checkIfThereIsAnInvoiceForThePreviousMonth() {
    this.isAnInvoiceForThePreviousMonth = false;
    for (const purchase of this.listPurchasesByMonth[this.selectedMonth]) {
      this.selectedMonth = monthNames[this.nextMonthIndex];

      let indexPreviousMonth = this.nextMonthIndex - 1;
      if (indexPreviousMonth < 0) {
        indexPreviousMonth = 11;
      }

      const previousMonthName = monthNames[indexPreviousMonth];

      if (
        !(
          this.listPurchasesByMonth[previousMonthName] &&
          this.listPurchasesByMonth[previousMonthName][0]?.installments
        )
      ) {
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
    this.purchases = JSON.parse(
      JSON.stringify(this.listPurchasesByMonth[this.selectedMonth])
    );
    this.checkIfThereIsAnInvoiceForTheNextMonth();
    this.checkTotalAmountOfCurrentMonthsInstallments();
  }

  loadPreviousInvoices() {
    this.isAnInvoiceForTheNextMonth = true;
    this.nextMonthIndex--;
    if (this.nextMonthIndex < 0) {
      this.nextMonthIndex = 11;
    }

    this.selectedMonth = monthNames[this.nextMonthIndex];
    this.purchases = JSON.parse(
      JSON.stringify(this.listPurchasesByMonth[this.selectedMonth])
    );
    this.checkIfThereIsAnInvoiceForThePreviousMonth();
    this.checkTotalAmountOfCurrentMonthsInstallments();
  }
}
