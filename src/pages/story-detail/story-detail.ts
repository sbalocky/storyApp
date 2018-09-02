import { Story } from './../../model/story.model';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PoiDetailPage } from '../poi-detail/poi-detail';
import { AddPOIPage } from '../add-poi/add-poi';

@Component({
  selector: 'page-story-detail',
  templateUrl: 'story-detail.html'
})
export class StoryDetailPage {
  listType = 'list';
  currentStory: Story;
  images: string[] = [];
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams) {}
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
          }
        }
      ]
    });
    alert.present();
  }
  delete(item) {}
}
