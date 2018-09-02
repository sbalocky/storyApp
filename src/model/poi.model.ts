import { Address } from './address.model';
import { POIType } from './poi-type.model';
export class Poi {
  constructor(public images: string[], public title: string, public description: string, public address: Address, public type: POIType) {}
}
