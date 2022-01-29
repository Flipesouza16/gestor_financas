import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { LoginRegisterComponent } from 'src/app/components/LoginRegister/login-register/login-register.component';
import { UserDataService } from 'src/app/services/data/userData.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isRegister = false;

  constructor(private modalCtrl: ModalController, private userDataService: UserDataService) {
    this.userDataService.getUsers().subscribe(async users => {
      if(users) {
        await Storage.set({
          key: 'users',
          value: JSON.stringify(users)
        });
      }
    });
  }

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
