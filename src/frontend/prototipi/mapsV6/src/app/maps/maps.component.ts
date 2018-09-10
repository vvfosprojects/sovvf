import {Component, OnInit} from '@angular/core';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
import {MapsService} from './maps-service/maps-service.service';
import {MarkerService} from './marker-service/marker-service.service';
import {MeteoService} from '../shared/meteo/meteo-service.service';
import {Meteo} from '../shared/model/meteo.model';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    richiesteMarkers: RichiestaMarker[];
    datimeteo: Meteo[];

    constructor(private mapsService: MapsService, private markerService: MarkerService, private meteoService: MeteoService) {
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
        /*
        da finire meteo per ogni markers
         */
        // for (let i = 0, len = this.richiesteMarkers.length; i < len; i++) {
        //     this.meteoService.getMeteoData(this.richiesteMarkers[i].localita.coordinate)
        //         .subscribe(data => {
        //             this.datimeteo[i] = data;
        //             console.log('prova' + this.datimeteo[i]);
        //         });
        // }
    }

}
