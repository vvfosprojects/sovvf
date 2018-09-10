import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MarkedService} from '../marked-service/marked-service.service';
import {Meteo} from '../../shared/model/meteo.model';
import {MarkerService} from '../marker-service/marker-service.service';
import {MeteoService} from '../../shared/meteo/meteo-service.service';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})
export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    datimeteo: Meteo;

    /* proprietà iniziali per caricamento mappa */
    lat: number;
    lng: number;
    zoom: number;


    constructor(private markedService: MarkedService, private meteoService: MeteoService) {
        this.lat = 42.290251;
        this.lng = 12.492373;
        this.zoom = 8;
    }

    ngOnInit() {
    }

    selezioneMarker(marker: RichiestaMarker, infoWindow?): void {
        this.markedService.clearMarked();
        this.markedService.sendMarked(marker);
        this.meteoService.getMeteoData(marker.localita.coordinate)
            .subscribe(data => {
                this.datimeteo = data;
            });
    }

    deselezioneMarker() {
        this.markedService.clearMarked();
    }

}
