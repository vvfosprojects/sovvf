import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MarkedService} from '../marked-service/marked-service.service';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})
export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];

    /* proprietà iniziali per caricamento mappa */
    lat: number;
    lng: number;
    zoom: number;


    constructor(private markedService: MarkedService) {
        this.lat = 42.290251;
        this.lng = 12.492373;
        this.zoom = 8;
    }

    ngOnInit() {
    }

    selezioneMarker(marker): void {
        this.markedService.sendMarked(marker);
    }

}
