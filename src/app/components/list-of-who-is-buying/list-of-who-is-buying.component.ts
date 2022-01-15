import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-of-who-is-buying',
  templateUrl: './list-of-who-is-buying.component.html',
  styleUrls: ['./list-of-who-is-buying.component.scss'],
})
export class ListOfWhoIsBuyingComponent implements OnInit {

  listOfBuyersNames: string[];
  titlePage: string;
  isFilter = false;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if(this.isFilter) {
      if(!this.listOfBuyersNames.includes('Todos')) {
        this.listOfBuyersNames.unshift('Todos');
      }
      this.titlePage = 'Fitrar compras por pessoa';
    } else {
      this.titlePage = 'Quem está comprando?';
    }
  }

  whoIsBuyingIsMe() {
    this.dismiss('Eu');
  }

  whoIsBuyingIsAnother() {
    this.dismiss('another');
  }

  selectWhoIsBuying(name: string) {
    this.dismiss(name);
  }

  dismiss(value?: any) {
    this.modalCtrl.dismiss(value);
  }
}
