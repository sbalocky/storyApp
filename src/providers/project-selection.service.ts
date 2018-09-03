import { Injectable } from '@angular/core';
import { Project } from '../model/project.model';

@Injectable()
export class ProjectSelectionService {
  private proj: Project;
  constructor() {}

  getCurrentProject() {
    return this.proj;
  }
  setCurrentProject(p: Project) {
    this.proj = p;
  }
}
