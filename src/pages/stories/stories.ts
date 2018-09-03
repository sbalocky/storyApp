import { ProjectSelectionService } from './../../providers/project-selection.service';
import { ProjectService } from './../../providers/project.service';
import { Story } from './../../model/story.model';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { StoryDetailPage } from '../story-detail/story-detail';
import { PoiDetailPage } from '../poi-detail/poi-detail';
import { Project } from '../../model/project.model';

@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage implements OnInit {
  stories: Story[] = [];
  projectId: string = 'yG2RfmhC7Z2cajGcoPD3';

  constructor(
    public navCtrl: NavController,
    public projectSelectionService: ProjectSelectionService,
    public alertCtrl: AlertController,
    public projectService: ProjectService
  ) {
    // https://storydb.documents.azure.com/dbs/storydb/colls/storydb/docs/1
    // https://{databaseaccount}.documents.azure.com/dbs/{db-id}/colls/{coll-id}/docs/{doc-id}
    const s1 = this.projectService.getFakeStory();

    //let a = this.storyService.watchDocument('bjoY3UvL7xXQMymqao7l');
    //this.storyService.watchDocument('bjoY3UvL7xXQMymqao7l').subscribe(doc => console.log(doc.payload.data()));
  }
  ngOnInit(): void {
    this.projectService.getDocument(this.projectId).subscribe(doc => {
      console.log(doc);
      this.projectSelectionService.setCurrentProject(doc);
      this.stories = doc.stories;
    });
  }

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
      imgURL: 'assets/imgs/4.jpg',
      title: name,
      pois: []
    };
    const p = this.projectSelectionService.getCurrentProject();
    p.stories = [...p.stories, s1];
    this.stories = p.stories;
    this.projectService.updateProject(p);
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
