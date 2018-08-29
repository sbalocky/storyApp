import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StoryDeailPage } from '../story-deail/story-deail';
import { PoiDetailPage } from '../poi-detail/poi-detail';

@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage {

  constructor(public navCtrl: NavController) {
  }
  goToStoryDeail(params){
    if (!params) params = {};
    this.navCtrl.push(StoryDeailPage);
  }goToPoiDetail(params){
    if (!params) params = {};
    this.navCtrl.push(PoiDetailPage);
  }
}
