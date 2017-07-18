import { Component, Input } from '@angular/core';

import { GoogleMapComponent } from './googleMap/googleMap.component'
import { GoogleMapMarker } from './googleMap/googleMap.marker.component'

import { MapsService  } from './services/maps.service'
import { GeolocationService } from '../app/services/geolocation.service';
import { GeocodingService } from '../app/services/geocoding.service';
//import { PuntiDataOutput } from "./services/puntiDataOutput.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

    LAT: number;
    LON: number;

    // Center map. Required. 
    center: google.maps.LatLng; 

    // MapOptions object specification. 
    // The initial map zoom level. Required. 
    zoom: number; 
    disableDefaultUI: boolean; 
    disableDoubleClickZoom: boolean; 
    mapTypeId: google.maps.MapTypeId; 
    maxZoom: number; 
    minZoom: number; 
    styles: Array<google.maps.MapTypeStyle>; 

    // Marker position. Required. 
    position: google.maps.LatLng; 
    // Marker title. 
    title: string; 
    // Info window. 
    content: string; 

    // Address to be searched. 
    address: string; 

    // Warning flag & message. 
    warning: boolean; 
    message: string; 

    constructor(public maps: MapsService, private geolocation: GeolocationService, private geocoding: GeocodingService) { 
//alert("constructor app.component.ts");
        this.center = new google.maps.LatLng(41.910943, 12.476358); 
        this.zoom = 10; 

        this.disableDefaultUI = true; 
        this.disableDoubleClickZoom = false; 
        this.mapTypeId = google.maps.MapTypeId.ROADMAP; 
        this.maxZoom = 15; 
        this.minZoom = 4; 

        this.styles = [ 
            { 
            featureType: 'landscape', 
                stylers: [ 
                    { color: '#ffffff' } 
                ] 
            } 
        ]; 

        this.address = ""; 
        this.warning = false; 
        this.message = ""; 
    } // END constructor


    getCurrentPosition() { 
//alert("getCurrentPosition app.component.ts");        
        this.warning = false; 
        this.message = ""; 

        if (navigator.geolocation) { 
          this.geolocation.getCurrentPosition()
              .forEach((position: Position) => { 
                if (this.center.lat() != position.coords.latitude && this.center.lng() != position.coords.longitude) { 
                // New center object: triggers OnChanges. 
                  this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
                  this.zoom = 11; 
                // Translates the location into address. 
                  this.geocoding.geocode(this.center).forEach( 
                  (results: google.maps.GeocoderResult[]) => { 
                      this.setMarker(this.center, "La tua località", results[0].formatted_address); 
                  }).then(() => console.log('Servizio di geocoding completato.')); 
                } 
              }).then(() => console.log('Servizio di geolocation completato.'))
                .catch((error: PositionError) => { 
                    if (error.code > 0) { 
                        switch (error.code) { 
                            case error.PERMISSION_DENIED: 
                              this.message = 'permesso negato'; 
                            break; 
                            case error.POSITION_UNAVAILABLE: 
                              this.message = 'posizione non disponibile'; 
                            break; 
                            case error.TIMEOUT: 
                              this.message = 'timeout'; 
                            break; 
                        } 
                        this.warning = true; 
                    } 
                }); 
        } else { 
          this.message = "il browser non supporta la geolocalizzazione"; 
          this.warning = true; 
        } 
    } //END getCurrentPosition

    search(address: string) {
//alert("search app.component.ts");
        if (address != "") { 
            this.warning = false; 
            this.message = ""; 
            
            //Converts the address into geographic coordinates. 
            this.geocoding.codeAddress(address)
                .forEach((results: google.maps.GeocoderResult[]) => { 
                      if (!this.center.equals(results[0].geometry.location)) { 
                        // New center object: triggers OnChanges.                        
                        this.center = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()); 
                        this.zoom = 11; 
                        this.setMarker(this.center, results[0].formatted_address, results[0].formatted_address); 
                      } 
                }).then(() => { 
                      this.address = ""; 
                      console.log('Servizio di geocoding completato.'); 
                }).catch((status: google.maps.GeocoderStatus) => { 
                      if (status === google.maps.GeocoderStatus.ZERO_RESULTS) { 
                          this.message = "nessun risultato"; 
                          this.warning = true; 
                      } 
                }); 
        } 
    }  // END search

    // Sets the marker & the info window. 
    setMarker(latLng: google.maps.LatLng, title: string, content: string) {
//alert("setMarker app.component.ts");         
        //this.maps.deleteMarkers(); 

        // Sets the marker. 
        this.position = latLng; 
        this.title = title; 

        // Sets the info window. 
        this.content = content; 

        this.LAT = latLng.lat();
        this.LON = latLng.lng();
    } 

    setMarkerLatLng(lat: number, lng: number, title: string, content: string) {        
        var latLng: google.maps.LatLng;
        latLng = new google.maps.LatLng(lat, lng); 

        this.setMarker(latLng, title, content);
    }

} // END class AppComponent