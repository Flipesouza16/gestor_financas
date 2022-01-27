import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { UserModel } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {
  isRegister: boolean;
  payloadLoginRegister: UserModel = {
    name: '',
    email: '',
    password: '',
  };
  loading;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  async login() {
    await this.presentLoading();
    try {
      await this.authService.login(this.payloadLoginRegister);
      this.dismiss();
    } catch(error) {
      console.error(error);

      let message: string;

      switch(error.code) {
        case 'auth/invalid-email':
          message = 'E-mail inválido';
          break;
        case 'auth/wrong-password':
          message = 'E-mail ou senha incorreto';
          break;
        default:
          message = 'Erro ao tentar entrar';
      }

      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  get isButtonValid() {
    if(!this.payloadLoginRegister.email.length || !this.payloadLoginRegister.password.length) {
      return false;
    } else {
      return true;
    }
  }

  async register() {
    await this.presentLoading();
    try {
      await this.authService.register(this.payloadLoginRegister);
      this.dismiss();
    } catch(error) {
      console.error(error);

      let message: string;

      switch(error.code) {
        case 'auth/invalid-email':
          message = 'E-mail inválido';
          break;
        case 'auth/email-already-in-use':
          message = 'E-mail já está sendo usado por outra conta';
          break;
        case 'auth/weak-password':
          message = 'Senha fraca';
          break;
        default:
          message = 'Erro ao tentar se cadastrar';
      }

      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Por favor, aguarde...',
    });

    return await this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });

    await toast.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
