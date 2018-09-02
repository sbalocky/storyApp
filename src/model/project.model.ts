import { Story } from './story.model';
export class Project {
  constructor(protected id: string, public userId: string, public stories: Story[]) {}
}
