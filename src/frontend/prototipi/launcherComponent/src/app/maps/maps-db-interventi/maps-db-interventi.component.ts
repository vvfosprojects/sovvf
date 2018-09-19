import {Component, Input, OnInit} from '@angular/core';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
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

    @Input() centroMappa: CentroMappa;
    @Input() richiesteMarkers: RichiestaMarker[];
    datiMeteo: Meteo;

    constructor(private meteoService: MeteoService, /** servizio che innietta dati meteo alla mappa **/
                private markedService: MarkedService /** servizio che controlla quale marker è selezionato nella mappa **/) {
    }

    ngOnInit() {

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
