import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { mascaraMoedaReal } from 'src/app/utils/utils';
import PurchaseUtils from '../../utils/purchaseUtils';

@Component({
  selector: 'app-agenda-card',
  templateUrl: './agenda-card.component.html',
  styleUrls: ['./agenda-card.component.scss'],
})
export class AgendaCardComponent implements OnInit {
  @Input() purchaseTitle: string;
  @Input() purchaseValue: number;
  @Input() isPurchasePaid: boolean;
  @Input() isLatePurchasePayment: boolean;
  @Input() purchaseInstallments: number;
  @Input() buyer: string;

  @Output() paid = new EventEmitter();

  purchaseUtils = PurchaseUtils;

  purchaseValueFormatted: string;
  mascaraMoedaReal = mascaraMoedaReal;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.purchaseValueFormatted =
      this.purchaseUtils.formatvalueAccordingToTheAmountOfZerosAtTheEnd(
        String(this.purchaseValue)
      );
  }

  async pay() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Já pagou essa parcela?',
      mode: 'ios',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: () => {
            this.paid.emit(true);
          },
        },
      ],
    });

    await alert.present();
  }
}
