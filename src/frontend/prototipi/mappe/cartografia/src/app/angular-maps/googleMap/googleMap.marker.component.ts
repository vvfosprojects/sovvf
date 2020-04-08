import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core'; 

import { PuntiMappaGoogleInput } from '../model/puntiMappaGoogleInput.model'
import { MapService } from '../services/map.service'; 

@Directive({ 
    selector: '[google-map-marker]' 
})

export class GoogleMapMarker implements OnChanges {

    /*** Modello Dati. Required. ***/ 
    @Input() punto: PuntiMappaGoogleInput;

    constructor(public maps: MapService) { } 
    
    ngOnChanges(changes: SimpleChanges): void {        
        // Creates the marker and the info window. 
        if (changes['punto']) {
            //this.maps.addMarker(this.position, this.title, this.content, this.urlIcon);
            console.log('Prima this.maps.addMarker: ', this.punto.indirizzo);            
            this.maps.addMarker(this.punto);
            console.log('Dopo this.maps.addMarker');                        
        }; 
    } 
}