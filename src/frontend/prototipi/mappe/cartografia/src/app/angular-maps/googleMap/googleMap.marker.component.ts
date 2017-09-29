import { Directive, Input, OnChanges, SimpleChange } from '@angular/core'; 

import { MapService } from '../services/map.service'; 

@Directive({ 
    selector: 'google-map-marker' 
})

export class GoogleMapMarker implements OnChanges {

    /*** Marker position. Required. ***/ 
    @Input() position: google.maps.LatLng; 

    /*** The marker's title will appear as a tooltip. ***/ 
    @Input() title: string; 

    /*** An InfoWindow's content is diplayed in a popup window above the map, at a given location. ***/ 
    @Input() content: string; 

    constructor(public maps: MapService) { } 

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
        // Creates the marker and the info window. 
        if (changes['position']) { this.maps.addMarker(this.position, this.title, this.content); }; 
    } 
}