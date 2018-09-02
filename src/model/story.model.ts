import { Poi } from './poi.model';

export class Story {
  constructor(public title: string, public createdAt: string, public updatedAt: string, public imgURL: string, public pois: Poi[]) {}
}
