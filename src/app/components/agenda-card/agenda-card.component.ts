import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda-card',
  templateUrl: './agenda-card.component.html',
  styleUrls: ['./agenda-card.component.scss'],
})
export class AgendaCardComponent implements OnInit {
  @Input() purchaseTitle: string;
  @Input() purchaseValue: string;

  constructor() {}

  ngOnInit() {}
}
