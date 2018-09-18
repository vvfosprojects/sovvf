import {Component, OnInit} from '@angular/core';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
import {MapsService} from './maps-service/maps-service.service';
import {CentroMappa} from './maps-model/centro-mappa.model';
import {Meteo} from '../../shared/model/meteo.model';
import {MeteoService} from '../../shared/meteo/meteo-service.service';
import {MarkedService} from './marked-service/marked-service.service';

@Component({
    selector: 'app-maps-db-interventi',
    templateUrl: './maps-db-interventi.component.html',
    styleUrls: ['./maps-db-interventi.component.css']
})
export class MapsDbInterventiComponent implements OnInit {

    richiesteMarkers: RichiestaMarker[];
    centroMappa: CentroMappa;
    datiMeteo: Meteo;

    constructor(private mapsService: MapsService,
                private meteoService: MeteoService,
                private markedService: MarkedService) {
        this.centroMappa = {lat: 42.290251, lng: 12.492373, zoom: 8};
    }

    ngOnInit() {
        this.mapsService.getData().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
            this.mapsService.count = this.richiesteMarkers.length;
        });
    }

    markerSelezionato(marker: RichiestaMarker) {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.selezionato(marker);
    }

    selezionato(marker: RichiestaMarker) {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.markedService.sendMarked(marker);
        /**
         *  mi arrivano i dati del meteo
         */
        this.getDatiMeteo(marker);
    }

    getDatiMeteo(marker: RichiestaMarker) {
        /**
         *  faccio una chiamata all'api del servizio meteo e aspetto i dati del marker selezionato
         */
        this.meteoService.getMeteoData(marker.localita.coordinate)
            .subscribe(data => {
                this.datiMeteo = data;
            });
    }

}
