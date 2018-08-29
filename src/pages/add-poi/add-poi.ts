import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StoryDeailPage } from '../story-deail/story-deail';
import { PoiDetailPage } from '../poi-detail/poi-detail';

@Component({
  selector: 'page-add-poi',
  templateUrl: 'add-poi.html'
})
export class AddPOIPage {

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
