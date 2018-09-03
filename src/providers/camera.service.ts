import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { from, Observable } from 'rxjs';

@Injectable()
export class CameraService {
  constructor(protected camera: Camera) {}
  takePhoto(): Observable<any> {
    return from(
      this.camera.getPicture({
        quality: 75,
        targetWidth: 1024,
        targetHeight: 768,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: false
      })
    );
  }
  selectPhoto() {
    return from(
      this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI
      })
    );
  }
}
