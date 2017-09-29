import { Component, ElementRef, NgZone, Input } from '@angular/core';

////import { GoogleMapMarker } from './googleMap/googleMap.marker.component'

import { PuntiMappaGoogleInput } from './model/puntiMappaGoogleInput.model'

import { MapService } from './services/map.service'
import { GeolocationService } from './services/geolocation.service';
import { GeocodingService } from './services/geocoding.service';

@Component({
  selector: 'app-angular-maps',
  templateUrl: './angular-maps.component.html',
  styleUrls: ['./angular-maps.component.css']
})

export class AngularMapsComponent {

  @Input() puntoMappaInput: PuntiMappaGoogleInput;
  
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
  styles: google.maps.MapTypeStyle[];

  // Marker position. Required. 
  position: google.maps.LatLng; 
  // Marker title. 
  title: string; 
  // Info window. 
  content: string; 

  // Warning flag & message. 
  warning: boolean; 
  message: string; 

    constructor(private ngZone: NgZone, 
                private elementRef: ElementRef, 
                private map: MapService, 
                private geolocation: GeolocationService, 
                private geocoding: GeocodingService) { 
        this.center = new google.maps.LatLng(41.910943, 12.476358); 
        this.zoom = 10; 

        this.disableDefaultUI = true; 
        this.disableDoubleClickZoom = false; 
        this.mapTypeId = google.maps.MapTypeId.ROADMAP; 
        this.maxZoom = 15; 
        this.minZoom = 4; 

        this.styles = [ 
            { 
                featureType: 'all'
                //featureType: 'landscape'
                //"featureType": "road.arterial"
                //,"elementType": "geometry"                    
                //,"elementType": "labels"                    
                //,stylers: [ { color: '#ffffff' } ] 
            } 
        ]; 

        this.warning = false; 
        this.message = ""; 

        //this.puntoMappaInput = new PuntiMappaGoogleInput('','','','',0,0,'');
        this.puntoMappaInput = new PuntiMappaGoogleInput("ABC",
                                                         "Tipologia dell'Intervento",
                                                         "via coriolano 40 roma",                                                         
                                                         "Breve descrizione",
                                                         0,
                                                         0,
                                                         "");        
    } // END constructor

//Marca la posizione dell'indirizzo dato
    private search(address: string): void {
        if (address != "") { 
            this.warning = false; 
            this.message = ""; 
            
            //Converts the address into geographic coordinates. 
            this.geocoding.codeAddress(address).forEach(
                (results: google.maps.GeocoderResult[]) => { 
                        if (!this.center.equals(results[0].geometry.location)) { 
                            this.zoom = 11; 
                            this.center = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()); 
                            //this.setMarker(this.center, results[0].formatted_address, results[0].formatted_address); 
                        } 
                })
                .then(() => { console.log('Servizio di geocoding completato.'); })
                .catch((status: google.maps.GeocoderStatus) => { 
                        if (status === google.maps.GeocoderStatus.ZERO_RESULTS) { 
                            this.message = "nessun risultato"; 
                            this.warning = true; 
                        } 
                }); 
        } // END if (address != "")
    }  // END search

 //Marca la posizione dell'intervento 
    marcaIntervento(): void{
        ////alert("marcaIntervento");
        if(this.puntoMappaInput.indirizzo === "" &&
            this.puntoMappaInput.latitudine <= 0.1 &&
            this.puntoMappaInput.longitudine <= 0.1) { 
            this.message = "nessun risultato"; 
            this.warning = true; 
            alert(this.message);
            return;
        }

        if(this.puntoMappaInput.indirizzo != "") {
            this.search(this.puntoMappaInput.indirizzo);
            this.puntoMappaInput.latitudine = this.center.lat();
            this.puntoMappaInput.longitudine = this.center.lng();            
        }

        this.setMarkerIntervento(); 
    } // Fine marcaIntervento

    private setMarkerIntervento(): void { // ngOnChanges di googleMap.marker
        this.position = new google.maps.LatLng(this.puntoMappaInput.latitudine, this.puntoMappaInput.longitudine); 
        this.title = this.puntoMappaInput.codice + " - " + this.puntoMappaInput.tipologia + "\n"; 
        this.content = this.puntoMappaInput.descrizione;
    }

    

////DA VERIFICARE
//Marca la posizione per Latitudine e Longitudine  
/*
    private setMarker(latLng: google.maps.LatLng, title: string, content: string): void {
        //this.maps.deleteMarkers(); 

        // Sets the marker. 
        this.position = latLng; 
        this.title = title; 

        // Sets the info window. 
        this.content = content; 
    } 
*/
/*
        //Marca la posizione attuale
        getCurrentPosition(): void { 
            this.warning = false; 
            this.message = ""; 

            if (navigator.geolocation) { 
            this.geolocation.getCurrentPosition().subscribe(
                (position: Position) => { 
                    if (this.center.lat() != position.coords.latitude && this.center.lng() != position.coords.longitude) { 
                            this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            this.zoom = 11; 

                            this.geocoding.geocode(this.center).forEach( // Translates the location into address.                            
                                    (results: google.maps.GeocoderResult[]) => 
                                        {this.setMarker(this.center, "La tua località", results[0].formatted_address);}
                                ).then(() => console.log('Servizio di geocoding completato.')); 
                    } 
                },
                (error: PositionError) => { 
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
                        } // end IF
                },
                () => console.log('Servizio di geolocation completato.'));
            } else { 
            this.message = "il browser non supporta la geolocalizzazione"; 
            this.warning = true; 
            } 
        } //END getCurrentPosition
*/
} // END class AngularMapsComponent