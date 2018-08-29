import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PoiDetailPage } from '../poi-detail/poi-detail';

@Component({
  selector: 'page-story-deail',
  templateUrl: 'story-deail.html'
})
export class StoryDeailPage {

  constructor(public navCtrl: NavController) {
  }
  goToPoiDetail(params){
    if (!params) params = {};
    this.navCtrl.push(PoiDetailPage);
  }
}
