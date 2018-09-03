import { ProjectService } from './../../providers/project.service';
import { ProjectSelectionService } from './../../providers/project-selection.service';
import { Poi } from './../../model/poi.model';
import { Story } from './../../model/story.model';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PoiDetailPage } from '../poi-detail/poi-detail';
import { AddPOIPage } from '../add-poi/add-poi';
import { POIType } from '../../model/poi-type.model';
import { PhotoService } from '../../providers/photo.service';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CameraService } from '../../providers/camera.service';

@Component({
  selector: 'page-story-detail',
  templateUrl: 'story-detail.html'
})
export class StoryDetailPage {
  listType = 'list';
  currentStory: Story;
  images: string[] = [];
  constructor(
    public navCtrl: NavController,
    public photoService: PhotoService,
    public projectSelectionService: ProjectSelectionService,
    public projectService: ProjectService,
    public cameraService: CameraService,
    public alertCtrl: AlertController,
    public params: NavParams
  ) {}
  ionViewWillEnter() {
    this.images = [];
    this.currentStory = this.params.data.story;
    this.currentStory.pois.forEach(val => {
      this.images = [...this.images, ...val.images];
    });
  }
  goToPoiDetail(params) {
    if (!params) params = {};
    this.navCtrl.push(PoiDetailPage, { poi: params });
  }
  onAddClick() {
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
        return 'help';
    }
  }
  takePhoto() {
    // this.cameraService.selectPhoto().pipe(switchMap(photo=>{
    //   this.photoService.uploadPhoto(photo)
    // }))
    // this.photoService
    //   .uploadPhoto()
    //   .pipe(
    //     map(a => (this.currentStory.imgURL = a)),
    //     switchMap(() => {
    //       return of(this.projectService.updateProject(this.projectSelectionService.getCurrentProject()));
    //     })
    //   )
    //   .subscribe(res => {
    //     console.log('saved');
    //   });
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
  delete(item) {}
}
