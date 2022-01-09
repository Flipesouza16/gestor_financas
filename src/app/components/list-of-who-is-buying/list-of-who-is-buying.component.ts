import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-of-who-is-buying',
  templateUrl: './list-of-who-is-buying.component.html',
  styleUrls: ['./list-of-who-is-buying.component.scss'],
})
export class ListOfWhoIsBuyingComponent implements OnInit {

  listOfBuyersNames: string[];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

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
