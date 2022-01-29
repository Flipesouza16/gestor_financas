import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

  async showToast(
    message: string,
    duration = 1500,
    position: 'top' | 'bottom' | 'middle' = 'top',
    color = 'primary'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      mode: 'ios',
      duration,
      position,
      color,
    });

    await toast.present();
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: message,
      buttons: ['Ok'],
      mode: 'ios'
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Por favor, aguarde...',
    });

    await loading.present();
    return loading;
  }
}
