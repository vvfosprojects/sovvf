import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElementRef } from '@angular/core';
 
// eseguire npm install google-maps --save /****/
import * as GoogleMapsLoader from 'google-maps';

import { PuntiMappaGoogleOutput } from '../model/puntiMappaGoogleOutput.model'

@Component({
  selector: 'google-map',
  templateUrl: './googleMap.component.html',
  styleUrls: ['./googleMap.component.css']
})

//export class GoogleMapComponent implements OnInit{
export class GoogleMapComponent {      
  
      lat :number;

      newPuntoOutput: PuntiMappaGoogleOutput = new PuntiMappaGoogleOutput();
      @Output() 
            add: EventEmitter<PuntiMappaGoogleOutput> = new EventEmitter(); 


      constructor(private elementRef:ElementRef) { }

      //ngOnInit() {
      ngAfterViewInit() {            
            let el: HTMLElement = this.elementRef.nativeElement.querySelector('.google-map');
            this.createMap(el);
      }

      addPuntoOutput() {
            alert("addPuntoOutput");
            //this.add.emit(this.newPuntoOutput); 
            //this.newPuntoOutput = new PuntiMappaGoogleOutput(); 

            alert("(3):" + this.lat);
      }

      private createMap(el: HTMLElement) {

            GoogleMapsLoader.LANGUAGE = 'it';
            GoogleMapsLoader.REGION = 'IT';
            GoogleMapsLoader.KEY = 'AIzaSyAQaGCkBos_D0w-cRhR2jD45yl99FjPFg8';

            this.lat=GoogleMapsLoader.load(google => {

                  let lati=0;
                  let map = new google.maps.Map(el, {
                        center: new google.maps.LatLng(41.9060, 12.5122),
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                  });
                  
                  let listenerHandle=google.maps.event.addListener(map, 'click', function(e) {
                              alert("addListener");                        

                              //this.lat = e.latLng.lat();
                              let lati = e.latLng.lat();                              
                              alert("(1):" + lati);

                              placeMarker(map, e.latLng);
                             
                  });

                  function placeMarker(map, location) {
                        var marker = new google.maps.Marker({
                              position: location,
                              map: map
                        });

                        var infowindow = new google.maps.InfoWindow({
                              content: 'Latitude: ' + location.lat() +
                              '<br>Longitude: ' + location.lng()
                        });
                        infowindow.open(map,marker);
                        //google.maps.event.removeListener(listenerHandle);
                  }

                  return lati; 
            });

            alert("(bbb)" + this.lat);
      }  // END createMap
}
