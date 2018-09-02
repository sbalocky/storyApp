import { Project } from './../model/project.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Story } from '../model/story.model';
import { POIType } from '../model/poi-type.model';
import { BaseService } from './base.service';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(public fireStore: AngularFirestore) {
    super(fireStore);
  }

  getFakeStory() {
    const s1: Story = {
      createdAt: '20.07.2018',
      updatedAt: '',
      imgURL: 'assets/imgs/2.jpg',
      title: 'Athens',
      pois: [
        {
          images: ['assets/imgs/2.jpg', 'assets/imgs/4.jpg', 'assets/imgs/7.jpg'],
          description: 'this is desc Tatzagiakis Bar',
          title: 'Tatzagiakis Bar',
          address: {
            address: 'My Address 200/3',
            city: 'Athens',
            lat: '37.9838',
            lon: '23.7275'
          },
          type: <POIType>'BAR'
        },
        {
          images: ['assets/imgs/1.jpg', 'assets/imgs/5.jpg', 'assets/imgs/8.jpg'],
          description: 'This is desc of Taverna Giannis',
          title: 'Taverna Giannis',
          address: {
            address: 'Giannis Address 200/3',
            city: 'Athens',
            lat: '37.9838',
            lon: '23.7275'
          },
          type: <POIType>'RESTAURANT'
        }
      ]
    };
    return s1;
  }
}
