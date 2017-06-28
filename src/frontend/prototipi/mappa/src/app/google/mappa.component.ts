import { Component, Input, Output, OnInit, ElementRef, EventEmitter } from '@angular/core';
import * as GoogleMapsLoader from 'google-maps'; // eseguire npm install google-maps /****/

import { PuntiMappaGoogleInput, PuntiMappaGoogleOutput } from './mappa.model'
import { MappaService } from "./mappa.service";

@Component({
  selector: 'google-mappa',
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.css']
})

export class MappaComponent implements OnInit {
  title = 'mappa google!';
  lat = 0;
  lon = 0;

  @Input() puntiMappaGoogleInput: PuntiMappaGoogleInput[];
  @Output() click = new EventEmitter();

  constructor(private elementRef:ElementRef, private mappaService: MappaService) { }

  ngOnInit() {
        //this.puntiMappaGoogle = this.mappaService.getPuntiMappaGoogleFake(). .subscribe(lista => this.puntiMappaGoogle = lista);
        this.puntiMappaGoogleInput = this.mappaService.getPuntiMappaGoogleFake();
  
        let el: HTMLElement = this.elementRef.nativeElement.querySelector('.google-mappa');
        this.createMap(el);
  }

  public setCoordinataFake() {
        alert("ok: " + this.lat);
        //alert("Lat1: " + this.lat);
        //this.mappaService.setPuntiMappaGoogleFake(new PuntiMappaGoogleOutput(41.897989, 12.504349));
        //this.lat=41.897989;
        //this.lon=12.504349;
  }

  private createMap(el: HTMLElement) {

        GoogleMapsLoader.LANGUAGE = 'it';
        GoogleMapsLoader.REGION = 'IT';
        //GoogleMapsLoader.KEY = 'qwertyuiopasdfghjklzxcvbnm';

        GoogleMapsLoader.load((google) => {

            let map = new google.maps.Map(el, {
                  center: new google.maps.LatLng(41.9060, 12.5122),
                  zoom: 13,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            for (var i = 0; i < this.puntiMappaGoogleInput.length; i++) {
                  var marker = new google.maps.Marker({
                        title: this.puntiMappaGoogleInput[i].codice + " - " + this.puntiMappaGoogleInput[i].tipologia,
                        zIndex: 0,
                        position: {lat: this.puntiMappaGoogleInput[i].latitudine, lng: this.puntiMappaGoogleInput[i].longitudine},                        
                        icon: this.puntiMappaGoogleInput[i].marker,
                        map: map
                  });
            }

            google.maps.event.addListener(map, 'click', function(e) {
                        this.lat=e.latLng.lat();
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
            } 

            google.maps.event.addListener(map, 'click', function($scope, e) {
                  alert("1");
                 $scope.lati=1111;
                  alert("2");
            });

         });
//FINE LOADER MAP GOOGLE
  }  
}
