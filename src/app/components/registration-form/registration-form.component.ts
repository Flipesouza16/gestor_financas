import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import {
  PayloadRegistrationForm,
  PurchaseModel,
} from 'src/app/utils/types/purchaseType';
import { mascaraMoedaReal, capitalizeFirstLetter } from '../../utils/utils';
import PurchaseUtils from 'src/app/utils/purchaseUtils';
import { generateHash } from '../../utils/utils';
import { ListOfWhoIsBuyingComponent } from '../list-of-who-is-buying/list-of-who-is-buying.component';
import { Storage } from '@capacitor/storage';
import * as moment from 'moment';
import { UserModel } from 'src/app/interfaces/user';
import { UserDataService } from 'src/app/services/data/userData.service';
import { fecharTeclado } from '../../utils/utils';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  @ViewChild('inputNameWhoIsBuying') inputNameWhoIsBuying: any;

  fecharTeclado = fecharTeclado;
  mascaraMoedaReal = mascaraMoedaReal;
  capitalizeFirstLetter = capitalizeFirstLetter;
  userLogged: UserModel;
  purchaseUtils = PurchaseUtils;
  isCurrentPurchase = true;
  isEditing = false;
  listOfBuyersNames: string[] = [];
  payloadPurchase: PurchaseModel;
  purchaseValueFormatted = '';
  isAnotherPersonWhoIsBuying = false;
  payloadRegistrationForm: PayloadRegistrationForm = {
    hash: generateHash(),
    personWhoIsBuying: '',
    purchaseInstallments: 0,
    purchaseTitle: '',
    purchaseValue: 0,
    installmentAmount: 0,
    totalInstallments: 0,
    dueDate: '',
  };

  constructor(
    private modalCtrl: ModalController,
    private utilsCtrl: UtilsService,
    private userDataService: UserDataService,
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
    }

    this.loadListOfBuyersNamesIfExists();
  }

  getDate(date) {
    const formattedDate = moment(date).format('DD');
    this.payloadRegistrationForm.dueDate = formattedDate;
  }

  async loadListOfBuyersNamesIfExists() {
    if (this.userLogged?.listOfBuyers) {
      this.listOfBuyersNames = JSON.parse(this.userLogged.listOfBuyers);
    }
  }

  async addNewOrEditPurchase() {
    // is an old purchase
    if (!this.isCurrentPurchase) {
      this.payloadRegistrationForm.purchaseValue =
        this.payloadRegistrationForm.installmentAmount *
        this.payloadRegistrationForm.purchaseInstallments;
    }

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

      //  First letter of all words to uppercase
      this.payloadRegistrationForm.personWhoIsBuying = capitalizeFirstLetter(
        this.payloadRegistrationForm.personWhoIsBuying
      );

      this.saveListOfBuyersNames(
        this.payloadRegistrationForm.personWhoIsBuying
      );

      setTimeout(() => {
        this.dismiss(this.payloadRegistrationForm);
      }, 1500);
    }
  }

  formatValue(event, isValueOfInstallment = false) {
    if (isValueOfInstallment) {
      const purchaseValue = event.target.value;
      this.purchaseValueFormatted = purchaseValue;
      this.payloadRegistrationForm.installmentAmount = parseFloat(
        this.mascaraMoedaReal(purchaseValue).replace('.', '').replace(',', '.')
      );
    } else {
      // By default, the amount is the total purchase amount
      const purchaseValue = event.target.value;
      this.purchaseValueFormatted = purchaseValue;
      this.payloadRegistrationForm.purchaseValue = parseFloat(
        this.mascaraMoedaReal(purchaseValue).replace('.', '').replace(',', '.')
      );
    }
  }

  async openAlertAboutWhoIsBuying() {
    const modal = await this.modalCtrl.create({
      component: ListOfWhoIsBuyingComponent,
      cssClass: 'small-modal',
      backdropDismiss: true,
      componentProps: {
        listOfBuyersNames: this.listOfBuyersNames,
      },
    });

    await modal.present();

    const { data: nameOfWhoIsBuying } = await modal.onDidDismiss();

    if (nameOfWhoIsBuying && nameOfWhoIsBuying !== 'another') {
      this.payloadRegistrationForm.personWhoIsBuying = nameOfWhoIsBuying;
    } else if (nameOfWhoIsBuying) {
      this.isAnotherPersonWhoIsBuying = true;
      this.payloadRegistrationForm.personWhoIsBuying = '';
      this.inputNameWhoIsBuying.setFocus();
    }
  }

  async saveListOfBuyersNames(personWhoIsBuying: string) {
    if (!this.listOfBuyersNames?.includes(personWhoIsBuying)) {
      this.listOfBuyersNames.push(personWhoIsBuying);

      if(!this.userLogged?.listOfBuyers) {
        this.userLogged = {
          ...this.userLogged,
          listOfBuyers: ''
        };
      }

      this.userLogged.listOfBuyers = JSON.stringify(this.listOfBuyersNames);

      console.log('userLogged: ',this.userLogged);
      await Storage.set({
        key: 'user-logged',
        value: JSON.stringify(this.userLogged)
      });

     this.userDataService.updateUser(this.userLogged);
    }
  }

  async isValidField(payloadPurchase: PayloadRegistrationForm) {
    if (!payloadPurchase.purchaseTitle) {
      return await this.utilsCtrl.showToast('Qual o título da compra?');
    }

    if (!payloadPurchase.personWhoIsBuying) {
      return await this.utilsCtrl.showToast('Quem está comprando?');
    }

    if (this.isCurrentPurchase && !payloadPurchase.purchaseValue) {
      return await this.utilsCtrl.showToast('Qual o valor da compra?');
    } else if (!this.isCurrentPurchase && !payloadPurchase.installmentAmount) {
      return await this.utilsCtrl.showToast('Qual o valor das parcelas?');
    }

    if (!payloadPurchase.purchaseInstallments) {
      return await this.utilsCtrl.showToast('São quantas parcelas?');
    }

    return true;
  }

  dismiss(value?: PayloadRegistrationForm) {
    this.modalCtrl.dismiss(value);
  }
}
