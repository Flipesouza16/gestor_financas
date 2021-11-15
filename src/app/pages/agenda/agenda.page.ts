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
    },
    {
      title: 'Celular',
      value: '1.261,50',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
