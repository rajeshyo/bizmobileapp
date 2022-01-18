import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastCtrl: ToastController,
  ) { }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      // showCloseButton: false,
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
