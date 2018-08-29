import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StoriesPage } from '../pages/stories/stories';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { StoryDeailPage } from '../pages/story-deail/story-deail';
import { PoiDetailPage } from '../pages/poi-detail/poi-detail';
import { AddPOIPage } from '../pages/add-poi/add-poi';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    StoriesPage,
    TabsControllerPage,
    StoryDeailPage,
    PoiDetailPage,
    AddPOIPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StoriesPage,
    TabsControllerPage,
    StoryDeailPage,
    PoiDetailPage,
    AddPOIPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}