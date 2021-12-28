import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private toastCtrl: ToastController) {}

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
}
