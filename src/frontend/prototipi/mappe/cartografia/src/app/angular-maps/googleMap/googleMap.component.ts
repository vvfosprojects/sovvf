import { Component, Input, Output, OnInit, OnChanges, SimpleChange, ElementRef, EventEmitter } from '@angular/core'; 

import { MapService } from '../services/map.service'; 
import { PuntiMappaGoogleOutput } from '../model/puntiMappaGoogleOutput.model'

@Component({ 
      selector: 'google-map', 
      templateUrl: './googleMap.component.html',
      styleUrls: ['./googleMap.component.css']
 }) 

 export class GoogleMapComponent implements OnInit, OnChanges { 

      @Input() puntoOutput: PuntiMappaGoogleOutput;
      private map: google.maps.Map;      

      /* Center map. Required. */ 
      @Input() center: google.maps.LatLng; 

      /* MapOptions object specification. */ 
      /* The initial map zoom level. Required. */ 
      @Input() zoom: number; 

      /* Enables/disables all default UI. */ 
      @Input() disableDefaultUI: boolean; 

      /* Enables/disables zoom and center on double click. Enabled by default. */ 
      @Input() disableDoubleClickZoom: boolean; 
      /* The initial map mapTypeId. Defaults to ROADMAP. */ 
      @Input() mapTypeId: google.maps.MapTypeId; 
      /* The maximum zoom level which will be displayed on the map. */ 
      @Input() maxZoom: number; 
      /* The minimum zoom level which will be displayed on the map. */ 
      @Input() minZoom: number; 
      /* Styles to apply to each of the default map types. */ 
      @Input() styles: google.maps.MapTypeStyle[];

      constructor(public maps: MapService, private elementRef: ElementRef) { }
 
      ngOnInit(): void {
            const el: HTMLElement = this.elementRef.nativeElement.querySelector("#map"); 
            this.createMap(el); 

            this.map.addListener('click', (e) => { 
                  this.puntoOutput.latitudine = e.latLng.lat();
                  this.puntoOutput.longitudine = e.latLng.lng();                  
              }); 
      } 
 
      ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void { 
            if (changes['center']) { this.maps.setCenter(this.center); }; 
            if (changes['zoom']) { this.maps.setZoom(this.zoom); }; 
      } 

      private createMap(el: HTMLElement): void {
            this.map=
                  this.maps.initMap(el, { 
                        center: this.center, 
                        disableDefaultUI: this.disableDefaultUI, 
                        disableDoubleClickZoom: this.disableDoubleClickZoom, 
                        mapTypeId: this.mapTypeId, 
                        maxZoom: this.maxZoom as number, 
                        minZoom: this.minZoom as number, 
                        styles: this.styles, 
                        zoom: this.zoom as number 
                  }); 
      } 

}  //END class GoogleMapDirective