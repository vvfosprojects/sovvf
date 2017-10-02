import { Directive, Input, OnChanges, SimpleChange } from '@angular/core'; 

import { PuntiMappaGoogleInput } from '../model/puntiMappaGoogleInput.model'
import { MapService } from '../services/map.service'; 

@Directive({ 
    selector: 'google-map-marker' 
})

export class GoogleMapMarker implements OnChanges {

    /*** Marker position. Required. ***/ 
    //@Input() position: google.maps.LatLng; 
    @Input() latitudine: number;
    @Input() longitudine: number;

    /*** The marker's title will appear as a tooltip. ***/ 
    @Input() title: string; 
    /*** An InfoWindow's content is diplayed in a popup window above the map, at a given location. ***/ 
    @Input() content: string; 
    /*** image icon marker ***/ 
    @Input() urlIcon: string; 

    constructor(public maps: MapService) { } 

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {

        alert("ci sono " + this.latitudine);        
        
        if (this.latitudine == 0 || this.longitudine == 0) return;

        // Creates the marker and the info window. 
        if (changes['latitudine'] || changes['longitudine']) {
            //this.maps.addMarker(this.position, this.title, this.content, this.urlIcon);
            this.maps.addMarker(new google.maps.LatLng(this.latitudine, this.longitudine), this.title, this.content, this.urlIcon);            
        }; 
    } 
}