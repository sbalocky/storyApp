import { switchMap, catchError, retryWhen, delayWhen, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, Toast } from 'ionic-angular';
import { Observable, timer } from 'rxjs';

@Injectable()
export class HeartBeatService {
  heartBeatUrl = 'https://storyimagesave.azurewebsites.net/api/HeartBeat?code=yC0tddmhzwcxCriuNBlU3kqwTYC8moYdzVHwqASaM1rlewjNyMpNAA==';
  constructor(private http: HttpClient, private toastCtrl: ToastController) {}
  hasToast: boolean = false;
  toast: Toast = this.toastCtrl.create({
    message: 'No Internet connection....',
    showCloseButton: true,
    closeButtonText: 'Ok',
    position: 'top'
  });
  showToast() {
    this.toast = this.toastCtrl.create({
      message: 'No Internet connection....',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'top'
    });
    this.toast.present();
    this.hasToast = true;
    this.toast.onDidDismiss(() => {
      this.hasToast = false;
    });
  }
  heartBeat() {
    timer(5000, 5000)
      .pipe(
        switchMap(() => this.http.get(this.heartBeatUrl)),
        retryWhen(errors =>
          errors.pipe(
            //log error message
            tap(val => {
              if (!this.hasToast) this.showToast();
            }),
            //restart in 5 seconds
            delayWhen(val => {
              console.log(val);
              return timer(5000);
            })
          )
        )
      )

      .subscribe(() => {
        // console.log('internet connection Ok');
      });
  }
}
