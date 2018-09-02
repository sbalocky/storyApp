export interface Summary {
  queryTime: number;
  numResults: number;
}

export interface BoundingBox {
  northEast: string;
  southWest: string;
  entity: string;
}

export interface Address2 {
  routeNumbers: any[];
  street: string;
  streetName: string;
  countryCode: string;
  municipality: string;
  postalCode: string;
  municipalitySubdivision: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  boundingBox: BoundingBox;
}

export interface Address {
  address: Address2;
  position: string;
}

export interface AtlasReverseSearchResult {
  summary: Summary;
  addresses: Address[];
}
