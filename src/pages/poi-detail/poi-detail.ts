import { ProjectService } from './../../providers/project.service';
import { Poi } from './../../model/poi.model';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GeocoderResult,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';
import { CameraService } from '../../providers/camera.service';
import { PhotoService } from '../../providers/photo.service';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjectSelectionService } from '../../providers/project-selection.service';
// declare var google;

@Component({
  selector: 'page-poi-detail',
  templateUrl: 'poi-detail.html'
})
export class PoiDetailPage implements OnInit {
  async ngOnInit() {
    this.currentPoi = this.params.data.poi;

    await this.platform.ready();

    // await this.loadMap();
  }
  // @ViewChild('map')
  // mapElement: ElementRef;
  map: GoogleMap;

  listType = 'desc';
  currentPoi: Poi;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public params: NavParams,
    public cameraService: CameraService,
    public photoService: PhotoService,
    public projectService: ProjectService,
    public projectSelectionService: ProjectSelectionService,
    public platform: Platform
  ) {}
  ionViewDidLoad() {}
  takePhoto() {
    this.cameraService
      .takePhoto()
      .pipe(
        switchMap(photo => {
          return this.photoService.uploadPhoto(photo);
        }),
        map(uri => (this.currentPoi.images = [...this.currentPoi.images, uri]))
      )
      .subscribe(() => {
        console.log('saved');
      });
  }
  selectPhoto() {
    this.cameraService
      .selectPhoto()
      .pipe(
        switchMap(photo => this.photoService.uploadPhoto(photo)),
        map(uri => {
          console.log('blob URI: ' + uri);
          console.log(JSON.stringify(this.currentPoi));
          if (!this.currentPoi.images) {
            this.currentPoi.images = [];
          }
          this.currentPoi.images = [...this.currentPoi.images, uri];
          return this.currentPoi;
        }),
        map(data => {
          console.log('saving project');
          this.projectService.updateProject(this.projectSelectionService.getCurrentProject());
        })
      )
      .subscribe(
        () => {
          console.log('saved');
        },
        err => {
          console.error(JSON.stringify(err));
        }
      );
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'How do you want to upload your photo?',
      buttons: [
        {
          text: 'Gallery',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
            this.selectPhoto();
          }
        },
        {
          text: 'Take a picture',
          handler: () => {
            // console.log('Buy clicked');
            this.takePhoto();
          }
        }
      ]
    });
    alert.present();
  }
  loadMap() {
    try {
      Environment.setEnv({
        API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyDdT2k5l2ZiHgQP1so8OtGSagAB-NOf2iE',
        API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyDdT2k5l2ZiHgQP1so8OtGSagAB-NOf2iE'
      });
    } catch (err) {
      console.log(err);
    }

    const address = this.currentPoi.address;
    if (address) {
      //      const latLng = new google.maps.LatLng(address.lat, address.lon);

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: Number.parseFloat(address.lat),
            lng: Number.parseFloat(address.lon)
          },
          zoom: 18,
          tilt: 30
        }
      };
      this.map = GoogleMaps.create('map_canvas', mapOptions);
      //  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let marker = this.map.addMarkerSync({
        title: address.address,
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: Number.parseFloat(address.lat),
          lng: Number.parseFloat(address.lon)
        }
      });
      marker.showInfoWindow();
    }
  }
}
