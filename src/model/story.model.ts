import { Poi } from './poi.model';

export class Story {
  constructor(public title: string, public imgURL: string, public pois: Poi[], public createdAt?: any) {}
}
