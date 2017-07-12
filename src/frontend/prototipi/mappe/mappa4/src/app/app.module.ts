import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GoogleMapComponent } from './googleMap/googleMap.component'
import { GoogleMapMarker } from './googleMap/googleMap.marker.component'

import { MapsService  } from './services/maps.service'
import { GeolocationService } from './services/geolocation.service';
import { GeocodingService } from './services/geocoding.service';
//import { PuntiDataOutput } from "./services/puntiDataOutput.service";

import { AppComponent } from './app.component';

@NgModule({
  imports: [
     BrowserModule
    ,CommonModule
    ,FormsModule
  ],
  declarations: [
     AppComponent
    ,GoogleMapComponent
    ,GoogleMapMarker
  ],
  providers: [
     MapsService
    ,GeolocationService
    ,GeocodingService    
    //,PuntiDataOutput
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }