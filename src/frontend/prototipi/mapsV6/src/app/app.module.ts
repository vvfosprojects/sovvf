import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import * as Shared from './shared/';
import {AgmCoreModule} from '@agm/core';
import {MapsComponent} from './maps-container/maps/maps.component';
import {MapsService} from './maps-container/maps/maps-service/maps-service.service';
import {MapsServiceFake} from './maps-container/maps/maps-service/maps-service.service.fake';
import {googleApiKey} from './maps-container/maps/apikey';
import {AnimationPipe} from './maps-container/maps/maps-service/animation.pipe';
import { AppComponent } from './app.component';
import { NavComponent } from './maps-container/nav/nav.component';
import { MapsContainerComponent } from './maps-container/maps-container.component';

@NgModule({
  declarations: [
    AppComponent,
      // start import of Shared Declarations
      [
      ],
      // end import of Shared Declarations
      MapsComponent,
      AnimationPipe,
      NavComponent,
      MapsContainerComponent,
  ],
  imports: [
      BrowserModule,
      HttpClientModule,
      PipeModule.forRoot(),
      AgmCoreModule.forRoot({
          apiKey: googleApiKey.apiKey
      })
  ],
  providers: [{provide: MapsService, useClass: MapsService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
