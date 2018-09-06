import { ProjectSelectionService } from './../../providers/project-selection.service';
import { ProjectService } from './../../providers/project.service';
import { Story } from './../../model/story.model';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { StoryDetailPage } from '../story-detail/story-detail';
import { PoiDetailPage } from '../poi-detail/poi-detail';
import { Project } from '../../model/project.model';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HeartBeatService } from '../../providers/heartBeat.service';

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
    public loadingCtrl: LoadingController,
    public heartBeatService: HeartBeatService,
    public projectService: ProjectService
  ) {
    // https://storydb.documents.azure.com/dbs/storydb/colls/storydb/docs/1
    // https://{databaseaccount}.documents.azure.com/dbs/{db-id}/colls/{coll-id}/docs/{doc-id}
    //const s1 = this.projectService.getFakeStory();
    //let a = this.storyService.watchDocument('bjoY3UvL7xXQMymqao7l');
    //this.storyService.watchDocument('bjoY3UvL7xXQMymqao7l').subscribe(doc => console.log(doc.payload.data()));
  }
  ngOnInit(): void {
    this.heartBeatService.heartBeat();
    this.projectSelectionService.currentProject$.subscribe(p => {
      if (p) {
        this.stories = p.stories;
      }
    });
    this.loaddata();
  }
  loaddata() {
    //   this.projectService.watchDocument("").
    this.projectService.getDocument(this.projectId).subscribe(doc => {
      //const project = doc.payload.data() as Project;
      if (doc) {
        console.log('synced: ' + JSON.stringify(doc));
        this.projectSelectionService.setCurrentProject(doc);
      }
    });
  }
  delete(s: Story) {
    const index = this.stories.indexOf(s, 0);
    const p = this.projectSelectionService.getCurrentProject();
    if (index >= 0) {
      this.stories.splice(index, 1);
      this.projectService.updateProject(p);
    }
  }
  onRefresh(refresher) {
    const loader2 = this.loadingCtrl.create({ content: 'Refresing data' });
    from(loader2.present())
      .pipe(
        switchMap(() => {
          return this.projectService.getDocument(this.projectId);
        })
      )
      .subscribe(
        doc => {
          this.projectSelectionService.setCurrentProject(doc);
          this.stories = doc.stories;
          loader2.dismiss();
          refresher.complete();
        },
        err => {
          console.error(JSON.stringify(err));
          refresher.complete();
        }
      );

    this.loaddata();
  }
  goToStoryDeail(params) {
    if (!params) params = {};
    this.projectSelectionService.setCurrentStory(params);
    this.navCtrl.push(StoryDetailPage, { story: params });
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
