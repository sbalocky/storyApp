export interface Summary {
  query: string;
  queryType: string;
  queryTime: number;
  numResults: number;
  offset: number;
  totalResults: number;
  fuzzyLevel: number;
}

export interface Address {
  municipality: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  streetName: string;
  streetNumber: string;
  municipalitySubdivision: string;
  postalCode: string;
  extendedPostalCode: string;
  countryTertiarySubdivision: string;
  countrySubdivisionName: string;
}

export interface Position {
  lat: number;
  lon: number;
}

export interface TopLeftPoint {
  lat: number;
  lon: number;
}

export interface BtmRightPoint {
  lat: number;
  lon: number;
}

export interface Viewport {
  topLeftPoint: TopLeftPoint;
  btmRightPoint: BtmRightPoint;
}

export interface TopLeftPoint2 {
  lat: number;
  lon: number;
}

export interface BtmRightPoint2 {
  lat: number;
  lon: number;
}

export interface BoundingBox {
  topLeftPoint: TopLeftPoint2;
  btmRightPoint: BtmRightPoint2;
}

export interface Geometry {
  id: string;
}

export interface DataSources {
  geometry: Geometry;
}

export interface Result {
  type: string;
  id: string;
  score: number;
  info: string;
  entityType: string;
  address: Address;
  poi: Poi;
  position: Position;
  viewport: Viewport;
  boundingBox: BoundingBox;
  dataSources: DataSources;
}
export interface Poi {
  name: string;
  phone: string;
  url: string;
  categories: string[];
  classifications: Classification[];
}
export interface Classification {
  code: string;
  names: Name[];
}

export interface Name {
  nameLocale: string;
  name: string;
}

export interface AtlasSearchResult {
  summary: Summary;
  results: Result[];
}
