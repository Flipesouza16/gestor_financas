import { Component, Input, OnInit } from '@angular/core';
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

  purchaseUtils = PurchaseUtils;

  purchaseValueFormatted: string;
  mascaraMoedaReal = mascaraMoedaReal;

  constructor() {}

  ngOnInit() {
    this.purchaseValueFormatted =
    this.purchaseUtils.formatvalueAccordingToTheAmountOfZerosAtTheEnd(
      String(this.purchaseValue)
      );
  }
}
