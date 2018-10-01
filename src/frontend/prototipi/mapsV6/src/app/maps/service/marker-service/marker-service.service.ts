import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {Subscription} from 'rxjs';
import {MarkedService} from '../marked-service/marked-service.service';
import {Meteo} from '../../../shared/model/meteo.model';
import {MeteoService} from '../../../shared/meteo/meteo-service.service';
import {IconMappe} from './_icone';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    datiMeteo: Meteo;
    icone = new IconMappe();

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;


    constructor(private markedService: MarkedService,
                private meteoService: MeteoService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    tipoIcona(marker: any, modello: string): string {
        return this.icone.tipoIcona(marker, modello, this.markerSelezionato);
    }

    trueMarker(marker: any): boolean {
        /**
         * metodo che mi ritorna true, se il marker selezionato è lo stesso che è stato cliccato
         */
        if (this.markerSelezionato === marker) {
            return true;
        }
    }

    selezionato(marker: any): void {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.markedService.sendMarked(marker);
        /**
         *  mi arrivano i dati del meteo
         */
        this.getDatiMeteo(marker);
    }

    getDatiMeteo(marker: any): void {
        /**
         *  faccio una chiamata all'api del servizio meteo e aspetto i dati del marker selezionato
         */
        this.meteoService.getMeteoData(marker.localita.coordinate)
            .subscribe(data => {
                this.datiMeteo = data;
            });
    }
}
