import { Component, Input, OnInit } from '@angular/core';
import { mascaraMoedaReal } from 'src/app/utils/utils';

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

  purchaseValueFormatted: string;
  mascaraMoedaReal = mascaraMoedaReal;

  constructor() {}

  ngOnInit() {
    this.purchaseValueFormatted = String(this.purchaseValue);
  }
}
