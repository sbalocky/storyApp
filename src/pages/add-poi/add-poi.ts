import { AtlasReverseSearchResult } from './../../model/atlas-reverse-search.model';
import { POIType } from './../../model/poi-type.model';
import { Story } from './../../model/story.model';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PoiDetailPage } from '../poi-detail/poi-detail';
import { GeoLocationService } from '../../providers/geoLocation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, debounceTime, tap } from 'rxjs/operators';
import { Poi } from '../../model/poi.model';
import { Address } from '../../model/address.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-add-poi',
  templateUrl: 'add-poi.html'
})
export class AddPOIPage implements OnInit {
  form: FormGroup;
  currentStory: Story;
  autoCompleteItems: Array<any> = [];
  selectedPlace: any;
  searching: boolean = false;
  poiTypes = [POIType.BAR, POIType.RESTAURANT, POIType.NATURE, POIType.OTHER];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public geoService: GeoLocationService,
    public builder: FormBuilder
  ) {
    this.form = this.builder.group({
      useCurrentLocation: [false],
      locationText: [''],
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      poiType: [POIType.BAR, [Validators.required]]
    });
  }
  onPlaceClick(item) {
    this.autoCompleteItems = [];
    this.selectedPlace = item;
    this.form.patchValue({ locationText: item.title }, { emitEvent: false });
  }
  ngOnInit(): void {
    //  map(values=> values.forEach(v=> { return this.geoService.backwardGeocode(v.latitude, v.longitude); })
    this.currentStory = this.navParams.data.story;

    this.locationText.valueChanges
      .pipe(
        debounceTime(500),
        filter(val => val.length >= 3),
        switchMap(addresstxt => this.geoService.geoLocate(addresstxt))
      )
      .subscribe(
        done => {
          this.autoCompleteItems = [];
          // done.map(item => {
          //   if (item.locality) {
          //     this.autoCompleteItems.push({
          //       title: `${item.locality} ${item.subAdministrativeArea}, ${item.countryName}`
          //     });
          //   }
          // });
          done.results.forEach(item => {
            let res = '';
            if (item.type === 'Street' || item.entityType === 'Municipality') {
              if (item.address.streetName) {
                res = `${item.address.streetName}, ${item.address.municipality}, ${item.address.country}`;
              } else {
                res = `${item.address.municipality}, ${item.address.countrySubdivision}, ${item.address.country}`;
              }
              if (this.autoCompleteItems.find(x => x.title === res) == null) {
                this.autoCompleteItems.push({
                  title: res,
                  lat: item.position.lat,
                  lon: item.position.lon,
                  city: item.address.municipality
                });
              }
            }
          });
          console.log(JSON.stringify(done));
        },
        err => {
          console.error(JSON.stringify(err));
        }
      );
    this.useCurrentLocation.valueChanges
      .pipe(
        filter(val => val),
        debounceTime(50),
        tap(s => (this.searching = true)),
        switchMap(val => this.geoService.getCurrentLocation()),
        switchMap(val => this.geoService.backwardGeocode(val.coords.latitude, val.coords.longitude))
      )
      .subscribe((res: AtlasReverseSearchResult) => {
        this.searching = false;
        if (res) {
          const address = res.addresses[0];
          if (address) {
            const coords = address.position.split(',');
            this.onPlaceClick({
              title: address.address.street + ', ' + address.address.municipality + ', ' + address.address.country,
              lat: coords[0],
              lon: coords[1]
            });
          }
        }
        console.log(res);
      });
  }
  get useCurrentLocation() {
    return this.form.get('useCurrentLocation');
  }
  get locationText() {
    return this.form.get('locationText');
  }
  get title() {
    return this.form.get('title');
  }
  get description() {
    return this.form.get('desc');
  }
  get poiType() {
    return this.form.get('poiType');
  }
  goToStoryDeail(params) {
    if (!params) params = {};
    if (this.currentStory && this.currentStory.pois) {
      this.currentStory.pois.push(
        new Poi(
          [],
          this.title.value,
          this.description.value,
          new Address(this.locationText.value, this.selectedPlace.city, this.selectedPlace.lat, this.selectedPlace.lon),
          this.poiType.value
        )
      );
    }
    this.navCtrl.pop();
  }
  goToPoiDetail(params) {
    if (!params) params = {};
    this.navCtrl.push(PoiDetailPage);
  }
  ionViewWillEnter() {
    this.geoService.getCurrentLocation().subscribe(
      pos => {
        console.log(pos);
      },
      err => {
        console.error(err);
      }
    );
  }
}
