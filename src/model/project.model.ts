import { Story } from './story.model';
import { IDbEntity } from './iDbEntity.model';
export class Project implements IDbEntity {
  constructor(public id: string, public userId: string, public stories: Story[]) {}
}
