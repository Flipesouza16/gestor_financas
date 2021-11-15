import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  public compras = [
    {
      title: 'Monitor',
      value: '261,50',
      isPaid: true,
      isLate: false,
      installments: 3,
    },
    {
      title: 'Celular',
      value: '1.261,50',
      isPaid: false,
      isLate: false,
      installments: 2,
    },
    {
      title: 'Fatura do nubank',
      value: '800,00',
      isPaid: true,
      isLate: false,
      installments: 1,
    },
    {
      title: 'Despesas da casa',
      value: '700,00',
      isPaid: false,
      isLate: true,
      installments: 3,
    },
    {
      title: 'Portão',
      value: '97,86',
      isPaid: false,
      isLate: false,
      installments: 1,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
