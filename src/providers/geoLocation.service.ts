import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import * as geo from '@ionic-native/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions,
  NativeGeocoderReverseResult
} from '@ionic-native/native-geocoder';
import { HttpClient } from '@angular/common/http';
import { AtlasSearchResult } from '../model/atlas-search.model';
import { switchMap, tap } from 'rxjs/operators';
import { AtlasReverseSearchResult } from '../model/atlas-reverse-search.model';
// ios AIzaSyDdT2k5l2ZiHgQP1so8OtGSagAB-NOf2iE
// android AIzaSyDdT2k5l2ZiHgQP1so8OtGSagAB-NOf2iE

@Injectable()
export class GeoLocationService {
  constructor(private nativeGeocoder: NativeGeocoder, private geolocation: geo.Geolocation, private httpClient: HttpClient) {}
  private lastLocation: geo.Geoposition;
  private azureMapsKey = 'ZqLEbMGqH2WyCJiOsIGVYaWhqOXy-vLo5WDCH4DMjnY';
  getCurrentLocation(): Observable<geo.Geoposition> {
    return from(this.geolocation.getCurrentPosition()).pipe(
      tap(loc => {
        this.lastLocation = loc;
      })
    );
  }
  public get lastKnownLocation(): geo.Geoposition {
    return this.lastLocation;
  }
  // public forwardGeocode(searchedLocation: string): Observable<NativeGeocoderForwardResult[]> {
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   return from(this.nativeGeocoder.forwardGeocode(searchedLocation, options));
  // }
  // public backwardGeocode(lat: number, lon: number): Observable<NativeGeocoderReverseResult[]> {
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   return from(this.nativeGeocoder.reverseGeocode(lat, lon, options));
  // }
  public geoLocate(locationStr: string): Observable<AtlasSearchResult> {
    const url =
      'https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=' + this.azureMapsKey + '&query=' + locationStr;

    return this.httpClient.get<AtlasSearchResult>(url);
  }

  public backwardGeocode(lat: number, lon: number): Observable<AtlasReverseSearchResult> {
    const query = lat + ',' + lon;
    const url =
      'https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key=' + this.azureMapsKey + '&query=' + query;
    return this.httpClient.get<AtlasReverseSearchResult>(url);
  }
}
