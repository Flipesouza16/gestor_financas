import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
