import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { LoginRegisterComponent } from 'src/app/components/LoginRegister/login-register/login-register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isRegister = false;

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    await Storage.clear();
  }

  async openModalLoginRegister(isRegister: boolean) {
    const modal = await this.modalCtrl.create({
      component: LoginRegisterComponent,
      componentProps: {
        isRegister
      }
    });

    modal.present();
  }
}
