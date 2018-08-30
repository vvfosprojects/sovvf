import { Component, OnInit } from '@angular/core';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { MapsService } from './maps-service/maps-service.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
    /*
    proprietà iniziali per caricamento mappa
     */
    lat = 42.2417149;
    lng = 12.3346679;
    zoom = 6;

    richiesteMarkers: RichiestaMarker[];

    constructor(private mapsService: MapsService) {
    }

    ngOnInit() {
        this.mapsService.getData().subscribe(r => {
            this.richiesteMarkers = r;
            // console.log(this.richiesteMarkers);
        });
    }

    /* TESTING METHODS */
    setRandomMarker(newMarker) {
        let nuovoRichiestaMarker;
        nuovoRichiestaMarker = newMarker;
        // console.log(nuovoRichiestaMarker);
        this.richiesteMarkers.push(nuovoRichiestaMarker);
    }

    removeLastMarker() {
        this.richiesteMarkers.pop();
        // console.log(this.richiesteMarkers.length);
    }
}
