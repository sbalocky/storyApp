import { ProjectSelectionService } from './../../providers/project-selection.service';
import { ProjectService } from './../../providers/project.service';
import { Poi } from './../../model/poi.model';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, LoadingController, Loading } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapOptions, Environment } from '@ionic-native/google-maps';
import { CameraService } from '../../providers/camera.service';
import { PhotoService } from '../../providers/photo.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
  selector: 'page-poi-detail',
  templateUrl: 'poi-detail.html'
})
export class PoiDetailPage implements OnInit {
  async ngOnInit() {
    //  this.pro
    // this.currentPoi = this.params.data.poi;
    this.projectSelectionService.currentPoi$.subscribe(p => {
      this.currentPoi = p;
    });
    await this.platform.ready();
    try {
      const apiKey = 'AIzaSyDdT2k5l2ZiHgQP1so8OtGSagAB-NOf2iE';
      Environment.setEnv({
        API_KEY_FOR_BROWSER_RELEASE: apiKey,
        API_KEY_FOR_BROWSER_DEBUG: apiKey,
        API_KEY_FOR_IOS: apiKey
      });
    } catch (err) {
      console.log('error!');

      console.error(JSON.stringify(err));
    }
    // await this.loadMap();
  }
  // @ViewChild('map')
  // mapElement: ElementRef;
  map: GoogleMap;

  listType = 'desc';
  currentPoi: Poi;
  loading: Loading;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public params: NavParams,
    public cameraService: CameraService,
    public photoService: PhotoService,
    public projectService: ProjectService,
    public launchNavigator: LaunchNavigator,
    public projectSelectionService: ProjectSelectionService,
    public platform: Platform
  ) {}
  selectedItems: any[] = [];
  isEditMode: boolean = false;
  ionViewDidLoad() {}
  ionViewDidEnter() {
    this.selectedItems = [];
    this.isEditMode = false;
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
  hideLoading() {
    this.loading.dismiss();
  }
  presentDeleteConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete selected photos?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deletePhotos();
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
  deletePhotos() {
    this.currentPoi.images = [
      ...this.currentPoi.images.filter(e => {
        return this.selectedItems.indexOf(e);
      })
    ];
    this.updateProject();
    this.isEditMode = false;
    this.selectedItems = [];
  }
  updateProject() {
    console.log('saving: ' + JSON.stringify(this.currentPoi));
    this.projectService.updateProject(this.projectSelectionService.getCurrentProject());
  }
  takePhoto() {
    this.presentLoading();
    this.cameraService
      .takePhoto()
      .pipe(
        switchMap(photo => {
          return this.photoService.uploadPhoto(photo);
        }),
        tap(uri => (this.currentPoi.images = [...this.currentPoi.images, uri])),
        tap(a => this.updateProject())
      )
      .subscribe(
        () => {
          this.hideLoading();
          console.log('saved');
        },
        err => {
          console.error('Error while taking photo !!!');
          console.error(JSON.stringify(err));
          this.hideLoading();
        }
      );
  }
  pressed() {
    this.isEditMode = true;
    console.log('longPressed');
  }
  isInArray(id): boolean {
    let check: boolean = false;
    for (let contactId of this.selectedItems) {
      if (contactId == id) {
        check = true;
      }
    }
    return check;
  }
  clickedImage(id: string) {
    if (!this.isEditMode) {
      return;
    }
    console.log(this.selectedItems);
    if (this.isInArray(id)) {
      let index = this.selectedItems.indexOf(id);

      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
      console.log(this.selectedItems.indexOf(id));
    }
  }
  onCancelClick() {
    this.isEditMode = false;
    this.selectedItems = [];
  }
  onDeleteClick() {
    this.presentDeleteConfirm();
  }
  selectPhoto() {
    this.presentLoading();
    this.cameraService
      .selectPhoto()
      .pipe(
        switchMap(photo => this.photoService.uploadPhoto(photo)),
        tap(uri => {
          console.log('blob URI: ' + uri);
          console.log(JSON.stringify(this.currentPoi));
          if (!this.currentPoi.images) {
            this.currentPoi.images = [];
          }
          this.currentPoi.images = [...this.currentPoi.images, uri];
        }),
        tap(() => {
          console.log('saving project');
          this.updateProject();
        })
      )
      .subscribe(
        () => {
          console.log('saved');
          this.hideLoading();
        },
        err => {
          console.error(JSON.stringify(err));
          this.hideLoading();
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
  navigate() {
    const destination = [Number.parseFloat(this.currentPoi.address.lat), Number.parseFloat(this.currentPoi.address.lon)];
    let options: LaunchNavigatorOptions = {
      transportMode: 'driving',
      startName: 'My Location',
      destinationName: this.currentPoi.title,
      app: this.launchNavigator.APP.USER_SELECT
    };
    this.launchNavigator.navigate(destination, options).then(() => {
      console.log('navigation called');
    });
  }
}
