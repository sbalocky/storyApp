import { ProjectService } from './../../providers/project.service';
import { ProjectSelectionService } from './../../providers/project-selection.service';
import { Poi } from './../../model/poi.model';
import { Story } from './../../model/story.model';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { PoiDetailPage } from '../poi-detail/poi-detail';
import { AddPOIPage } from '../add-poi/add-poi';
import { POIType } from '../../model/poi-type.model';
import { PhotoService } from '../../providers/photo.service';
import { CameraService } from '../../providers/camera.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'page-story-detail',
  templateUrl: 'story-detail.html'
})
export class StoryDetailPage implements OnInit {
  listType = 'list';
  currentStory: Story;
  images: string[] = [];
  loading: Loading;
  constructor(
    public navCtrl: NavController,
    public photoService: PhotoService,
    public projectSelectionService: ProjectSelectionService,
    public projectService: ProjectService,
    public cameraService: CameraService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public photoViewer: PhotoViewer,
    public params: NavParams
  ) {}
  // ionViewWillEnter() {
  //   this.images = [];
  //   this.currentStory = this.params.data.story;
  //   this.currentStory.pois.forEach(val => {
  //     this.images = [...this.images, ...val.images];
  //   });
  // }
  ngOnInit(): void {
    this.projectSelectionService.currentStory$.subscribe(s => {
      this.currentStory = s;
      this.images = [];
      this.currentStory.pois.forEach(val => {
        this.images = [...this.images, ...val.images];
      });
    });
  }
  goToPoiDetail(params) {
    if (!params) params = {};
    this.projectSelectionService.setCurrentPoi(params);
    this.navCtrl.push(PoiDetailPage, { poi: params });
  }
  onAddClick() {
    this.projectSelectionService.setCurrentStory(this.currentStory);
    this.navCtrl.push(AddPOIPage, { story: this.currentStory });
  }
  getIcon(poi: Poi) {
    switch (poi.type) {
      case POIType.BAR:
        return 'beer';
      case POIType.RESTAURANT:
        return 'restaurant';
      case POIType.NATURE:
        return 'leaf';
      case POIType.SHOP:
        return 'cart';
      case POIType.OTHER:
        return 'bug';
    }
  }
  onImageClick(img: string) {
    this.photoViewer.show(img);
  }
  takePhoto() {
    this.presentLoading();
    this.cameraService
      .selectPhoto()
      .pipe(
        switchMap(photo => this.photoService.uploadPhoto(photo)),
        tap(uri => {
          console.log('blob URI: ' + uri);
          this.currentStory.imgURL = uri;
        }),
        tap(() => {
          console.log('saving project');
          const proj = this.projectSelectionService.getCurrentProject();
          this.projectService.updateProject(proj);
          this.projectSelectionService.setCurrentProject(proj);
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
  hideLoading() {
    this.loading.dismiss();
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();
  }
  // presentConfirm() {
  //   let alert = this.alertCtrl.create({
  //     title: 'How do you want to upload your photo?',
  //     buttons: [
  //       {
  //         text: 'Gallery',
  //         role: 'cancel',
  //         handler: () => {
  //           // console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Take a picture',
  //         handler: () => {
  //           // console.log('Buy clicked');
  //           this.takePhoto();
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }
  delete(item) {}
}
