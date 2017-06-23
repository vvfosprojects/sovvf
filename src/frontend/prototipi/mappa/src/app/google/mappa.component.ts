import {Component, Input, OnInit, ElementRef} from '@angular/core';
import * as GoogleMapsLoader from 'google-maps'; // eseguire npm install google-maps

import { PuntiMappaGoogle } from './mappa.model'
import { MappaService } from "./mappa.service";

@Component({
  selector: 'google-mappa',
  templateUrl: './mappa.component.html',
  styleUrls: ['./mappa.component.css']
})

export class MappaComponent implements OnInit {
  title = 'mappa google!';

  @Input() puntiMappaGoogle: PuntiMappaGoogle[];

  constructor(private elementRef:ElementRef, private mappaService: MappaService) { }

  ngOnInit() {
        //this.puntiMappaGoogle = this.mappaService.getPuntiMappaGoogleFake(). .subscribe(lista => this.puntiMappaGoogle = lista);
        this.puntiMappaGoogle = this.mappaService.getPuntiMappaGoogleFake();
  
        let el: HTMLElement = this.elementRef.nativeElement.querySelector('.google-mappa');
        this.createMap(el);
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

            for (var i = 0; i < this.puntiMappaGoogle.length; i++) {
                  var marker = new google.maps.Marker({
                        title: this.puntiMappaGoogle[i].codice + " - " + this.puntiMappaGoogle[i].tipologia,
                        zIndex: 0,
                        position: {lat: this.puntiMappaGoogle[i].latitudine, lng: this.puntiMappaGoogle[i].longitudine},                        
                        icon: this.puntiMappaGoogle[i].marker,
                        map: map
                  });
            }

        });
  }  
}
