import {Component, OnInit} from '@angular/core';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
import {MapsService} from './maps-service/maps-service.service';
import {MarkerService} from './marker-service/marker-service.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    richiesteMarkers: RichiestaMarker[];

    constructor(private mapsService: MapsService, private markerService: MarkerService) {
    }

    ngOnInit() {
        this.mapsService.getData().subscribe((r: RichiestaMarker[]) => {
            r.forEach(rr => {
                this.markerService.richiesteMarkers.push(rr);
            });
            this.markerService.count = this.richiesteMarkers.length;
        });
        this.markerService.getMarkers().subscribe(r => {
            this.richiesteMarkers = r;
        });
    }

}
