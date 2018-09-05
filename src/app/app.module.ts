import { Camera } from '@ionic-native/camera';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StoriesPage } from '../pages/stories/stories';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { StoryDetailPage } from '../pages/story-detail/story-detail';
import { PoiDetailPage } from '../pages/poi-detail/poi-detail';
import { AddPOIPage } from '../pages/add-poi/add-poi';
import * as geo from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GeoLocationService } from '../providers/geoLocation.service';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';
import { ProjectService } from '../providers/project.service';
import { ProjectSelectionService } from '../providers/project-selection.service';
import { PhotoService } from '../providers/photo.service';
import { CameraService } from '../providers/camera.service';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
  declarations: [MyApp, StoriesPage, TabsControllerPage, StoryDetailPage, PoiDetailPage, AddPOIPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    LongPressModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, StoriesPage, TabsControllerPage, StoryDetailPage, PoiDetailPage, AddPOIPage],
  providers: [
    StatusBar,
    Camera,
    PhotoLibrary,
    SplashScreen,
    geo.Geolocation,
    GeoLocationService,
    ProjectService,
    PhotoService,
    PhotoViewer,
    CameraService,
    ProjectSelectionService,
    NativeGeocoder,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
