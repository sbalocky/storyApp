import { ProjectService } from './../../providers/project.service';
import { Story } from './../../model/story.model';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { StoryDetailPage } from '../story-detail/story-detail';
import { PoiDetailPage } from '../poi-detail/poi-detail';

@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage {
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public projectService: ProjectService) {
    // https://storydb.documents.azure.com/dbs/storydb/colls/storydb/docs/1
    // https://{databaseaccount}.documents.azure.com/dbs/{db-id}/colls/{coll-id}/docs/{doc-id}
    const s1 = this.projectService.getFakeStory();

    this.projectService.getDocument('yG2RfmhC7Z2cajGcoPD3').subscribe(doc => console.log(doc));
    //let a = this.storyService.watchDocument('bjoY3UvL7xXQMymqao7l');
    //this.storyService.watchDocument('bjoY3UvL7xXQMymqao7l').subscribe(doc => console.log(doc.payload.data()));
    this.stories.push(s1);
  }
  stories: Story[] = [];

  goToStoryDeail(params) {
    if (!params) params = {};
    this.navCtrl.push(StoryDetailPage, { story: params });
  }
  goToPoiDetail(params) {
    if (!params) params = {};
    this.navCtrl.push(PoiDetailPage);
  }
  onAddStory() {
    this.presentPrompt();
  }
  addStory(name) {
    const s1: Story = {
      createdAt: '28.08.2018',
      updatedAt: '',
      imgURL: 'assets/imgs/4.jpg',
      title: name,
      pois: []
    };
    this.stories.push(s1);
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Add new Story',
      inputs: [
        {
          name: 'Name',
          placeholder: 'Name',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.addStory(data.Name);
          }
        }
      ]
    });
    alert.present();
  }
}
