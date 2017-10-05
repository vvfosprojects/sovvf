import { Injectable } from '@angular/core'; 
import { Observer } from 'rxjs/Observer'; 
import { Observable } from 'rxjs/Observable'; 

/** 
 * GeocodingService class. 
 * https://developers.google.com/maps/documentation/javascript/ 
 **/ 
@Injectable() export class GeocodingService { 

     geocoder: google.maps.Geocoder; 

     constructor() { 
         this.geocoder = new google.maps.Geocoder(); 
     } 
 
     /** 
      * Reverse geocoding by location. 
      * Wraps the Google Maps API geocoding service into an observable. 
      * @param latLng Location 
      * @return An observable of GeocoderResult 
      **/ 
     geocode(latLng: google.maps.LatLng): Observable<google.maps.GeocoderResult[]> { 
         return Observable.create((observer: Observer<google.maps.GeocoderResult[]>) => { 
             // Invokes geocode method of Google Maps API geocoding. 
             this.geocoder.geocode({ location: latLng }, ( 
                 (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => { 
                     if (status === google.maps.GeocoderStatus.OK) { 
                         observer.next(results); 
                         observer.complete(); 
                     } else { 
                         console.log('Servizio Geocoding: geocoder non riuscita a causa di: ' + status); 
                         observer.error(status); 
                     } 
                 }) 
             ); 
         }); 
     } 
 
     /** 
      * Geocoding services. 
      * Wraps the Google Maps API geocoding service into an observable. 
      * @param address The addres to be searched 
      * @return An observable of GeocoderResult 
      **/ 
     codeAddress(address: string): Observable<google.maps.GeocoderResult[]> { 
         return Observable.create((observer: Observer<google.maps.GeocoderResult[]>) => { 
             // Invokes geocode method of Google Maps API geocoding. 
             //this.geocoder.geocode({ address: address }, (
             this.geocoder.geocode ({'address': address, 'region': 'it'  }, ( ////Se non viene specificato il region la ricerca non è completa
                 (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => { 
                     if (status === google.maps.GeocoderStatus.OK) { 
                         observer.next(results); 
                         observer.complete(); 
                     } else { 
                         console.log('Servizio di geocoding: il geocode non ha avuto successo per la seguente ragione: ' + status); 
                         observer.error(status); 
                     } 
                 }) 
             ); 
         }); 
     } 
}  // END class GeocodingService