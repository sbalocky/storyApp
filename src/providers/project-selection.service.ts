import { Injectable } from '@angular/core';
import { Project } from '../model/project.model';
import { BehaviorSubject } from 'rxjs';
import { Story } from '../model/story.model';
import { Poi } from '../model/poi.model';

@Injectable()
export class ProjectSelectionService {
  private projSub: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  private storySub: BehaviorSubject<Story> = new BehaviorSubject<Story>(null);
  private poiSub: BehaviorSubject<Poi> = new BehaviorSubject<Poi>(null);
  public currentProject$ = this.projSub.asObservable();
  public currentStory$ = this.storySub.asObservable();
  public currentPoi$ = this.poiSub.asObservable();
  constructor() {}

  getCurrentProject(): Project {
    return this.projSub.getValue();
  }
  setCurrentProject(p: Project) {
    this.projSub.next(p);
  }
  getCurrentPoi(): Poi {
    return this.poiSub.getValue();
  }
  setCurrentPoi(p: Poi) {
    this.poiSub.next(p);
  }
  getCurrentStory(): Story {
    return this.storySub.getValue();
  }
  setCurrentStory(s: Story) {
    this.storySub.next(s);
  }
}
