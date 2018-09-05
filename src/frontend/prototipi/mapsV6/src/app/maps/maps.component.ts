import {Component, OnInit} from '@angular/core';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
import {MapsService} from './maps-service/maps-service.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
    richiesteMarkers: RichiestaMarker[];
    markerSelezionato: RichiestaMarker;
    count: number;
    newMarker: RichiestaMarker;

    constructor(private mapsService: MapsService) {
    }

    ngOnInit() {
        this.mapsService.getData().subscribe(r => {
            this.richiesteMarkers = r;
            console.log(this.richiesteMarkers);
            this.count = this.richiesteMarkers.length;
        });
    }



    /* TESTING METHODS */
    setRandomMarker() {
        this.count++;
        const lat = Math.floor(Math.random() * 10000000) * 0.00000001 + 41.89;
        const long = Math.floor(Math.random() * 10000000) * 0.00000001 + 12.49;
        this.newMarker = new RichiestaMarker(
            this.count, {'indirizzo': 'Via Cavour, 5', 'coordinate': [lat, long]}, 1, 'Marker aggiunto Random', false, 3);
        this.richiesteMarkers.push(this.newMarker);
    }

    removeLastMarker() {
        if (this.markerSelezionato && this.richiesteMarkers.slice(-1).pop().id_richiesta === this.markerSelezionato.id_richiesta) {
            this.deselezionaMarker();
        }
        this.richiesteMarkers.pop();
    }

    selezioneMarker(marker) {
        this.markerSelezionato = marker;
        // console.log('sono il marker ' + this.markerSelezionato.id_richiesta);
    }

    deselezionaMarker() {
        this.markerSelezionato = null;
    }

    changeMarkerColor(marker) {
        console.log('cambio colore al marker (maps component) ' + marker);
    }

    changeMarkerSize(marker) {
        console.log('cambio dimensione al marker (maps component) ' + marker);
    }

    changeMarkerAnimation(marker) {
        console.log('imposto animazione al marker( maps component) ' + marker);
    }
}
