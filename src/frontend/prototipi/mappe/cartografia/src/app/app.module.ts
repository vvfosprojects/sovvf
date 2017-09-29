import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

//###########
import { AngularMapsComponent } from './angular-maps/angular-maps.component';

import { GoogleMapComponent } from './angular-maps/googleMap/googleMap.component'
import { GoogleMapMarker } from './angular-maps/googleMap/googleMap.marker.component'

import { MapService } from './angular-maps/services/map.service'
import { GeolocationService } from './angular-maps/services/geolocation.service';
import { GeocodingService } from './angular-maps/services/geocoding.service';
//###########

@NgModule({
  declarations: [
    AppComponent
   ,AngularMapsComponent
   ,GoogleMapComponent
   ,GoogleMapMarker
  ],
  imports: [
    BrowserModule
    ,FormsModule
  ],
  providers: [
    MapService
   ,GeolocationService
   ,GeocodingService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
