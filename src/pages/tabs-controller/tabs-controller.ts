import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StoriesPage } from '../stories/stories';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = StoriesPage;
  constructor(public navCtrl: NavController) {
  }
  
}
