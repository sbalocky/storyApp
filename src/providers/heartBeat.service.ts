import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class HeartBeatService {
  heartBeatUrl = 'https://storyimagesave.azurewebsites.net/api/HeartBeat?code=yC0tddmhzwcxCriuNBlU3kqwTYC8moYdzVHwqASaM1rlewjNyMpNAA==';
  constructor(private http: HttpClient, private toastCtrl: ToastController) {}
  heartBeat() {
    this.http.get(this.heartBeatUrl).subscribe(
      () => {
        console.log('internet connection Ok');
      },
      err => {
        let toast = this.toastCtrl.create({
          message: 'No Internet connection....',
          showCloseButton: true,
          closeButtonText: 'Ok',
          position: 'top'
        });
        toast.present();
      }
    );
  }
}
