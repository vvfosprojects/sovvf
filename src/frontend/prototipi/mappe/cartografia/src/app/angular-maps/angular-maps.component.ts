import { Component, ElementRef, NgZone, Input } from '@angular/core';

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

 @Input() punto: PuntiMappaGoogleInput = new PuntiMappaGoogleInput("ABC",
                                                                   "Tipologia dell'Intervento",
                                                                   "via cavour 5 Roma",                                                         
                                                                   "Breve descrizione",
                                                                   0,
                                                                   0,
                                                                   "");
  private puntiMappaInput: PuntiMappaGoogleInput[] = [];  
  
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

  // Warning flag & message. 
  warning: boolean; 
  message: string; 

    constructor(private ngZone: NgZone, 
                private elementRef: ElementRef, 
                private map: MapService, 
                private geolocation: GeolocationService, 
                private geocoding: GeocodingService) { 

        this.center = new google.maps.LatLng(41.87, 12.53);         
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
    } // END constructor

//Marca la posizione dell'indirizzo dato
    private search(address: string): void {
        if (address != "") { 
            this.warning = false; 
            this.message = ""; 

            //Converts the address into geographic coordinates. 
            this.geocoding.codeAddress(address).forEach(
                (results: google.maps.GeocoderResult[]) => { 
                    console.log("Inizio: ", results.length)

                    for(let i=0; i < results.length; i++) {
                            console.log("indirizzo: ",  results[i].formatted_address, ' - ', results[i].geometry.location.lat()); 
                           
                            this.zoom = 11;
                            this.puntiMappaInput.push(
                                new PuntiMappaGoogleInput(this.punto.codice,
                                                          this.punto.tipologia,
                                                          results[i].formatted_address,
                                                          this.punto.descrizione,
                                                          results[i].geometry.location.lat(),
                                                          results[i].geometry.location.lng(),
                                                          this.punto.marker));
                    }                        
                })
                .then(() => {
                    console.log('Servizio di geocoding completato.'); 

                    for(let i=0 ; i < this.puntiMappaInput.length; i++) {
                        console.log("Completato: ", this.puntiMappaInput[i].latitudine );
                        //this.punto=this.puntiMappaInput[i];
                        this.map.addMarker(this.puntiMappaInput[i]);                                                
                    }
                })
                .catch((status: google.maps.GeocoderStatus) => { 
                        if (status === google.maps.GeocoderStatus.ZERO_RESULTS) { 
                            this.message = "nessun risultato"; 
                            this.warning = true; 
                        } 
                }); 
        } // END if (address != "")
    }  // END search

 //Marca la posizione dell'intervento 
    marcaIntervento(): void {
        if(this.punto.indirizzo == "" &&
           this.punto.latitudine <= 0.1 &&
           this.punto.longitudine <= 0.1) { 
            this.message = "nessun risultato"; 
            this.warning = true; 
            alert(this.message);
            return;
        }

        this.punto.marker="";
        if(this.punto.indirizzo != "") {
            console.log('prima di chiamata search');
            this.punto.marker='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';                        
            this.search(this.punto.indirizzo);
            console.log('dopo di chiamata search');
        }            
    } // Fine marcaIntervento


////DA VERIFICARE
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