import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {Subscription} from 'rxjs';
import {MarkedService} from '../marked-service/marked-service.service';
import {Meteo} from '../../../shared/model/meteo.model';
import {MeteoService} from '../../../shared/meteo/meteo-service.service';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    datiMeteo: Meteo;

    /**
     * proprietà per definire lo status dell'oggetto marker della mappa
     */
    private pathUrl: string;
    private iconeStati: [string, string][];
    private mapIconeUrl: Map<string, string>;
    private iconeGrandezza: [number, string][];
    private mapIconeSize: Map<number, string>;

    /**
     * proprietà per definire lo status dell'oggetto marker corrente nella mappa
     */
    private iconaStatoCorrenteUrl: string;
    private iconaStatoCorrenteSize: string;

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;


    constructor(private markedService: MarkedService,
                private meteoService: MeteoService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
        /**
         *  inizializzo i marker di tipo icona da utilizzare nella mappa
         */
        this.icone();
    }

    icone() {
        /**
         * credo due oggetti mappa per avere una corrispondenza tra il tipo di icona da usare e la relativa corrispondenza
         * per esempio lo stato dell'intervento o la prioprità della richiesta dell'intervento
         */
        this.pathUrl = '../../../../assets/img/icone-markers/';

        this.iconeStati = [
            ['chiam', 'warning.png'],
            ['asseg', 'info.png'],
            ['presi', 'success.png'],
            ['sospe', 'secondary.png']
        ];
        this.mapIconeUrl = new Map(this.iconeStati);

        this.iconeGrandezza = [
            [1, '20/'],
            [2, '25/'],
            [3, '30/'],
            [4, '35/'],
            [5, '40/']
        ];
        this.mapIconeSize = new Map(this.iconeGrandezza);
    }

    tipoIcona(marker: any) {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare (già mappate in precedenza vedi il metodo icone())
         */
        if (marker) {
            this.iconaStatoCorrenteSize = this.mapIconeSize.get(marker.prioritaRichiesta);
            const check = !(this.markerSelezionato === marker || this.markerSelezionato === marker.id_richiesta);
            const dir = check ? this.pathUrl + 'ns/' : this.pathUrl + 's/';
            this.iconaStatoCorrenteUrl = dir + this.iconaStatoCorrenteSize
                + this.mapIconeUrl.get(marker.stato.substring(0, 5).toLowerCase());
            if (!this.iconaStatoCorrenteSize) {
                return dir + '30/success.png';
            }
            // console.log(this.iconaStatoCorrenteUrl);
            return this.iconaStatoCorrenteUrl;
        }
    }

    trueMarker(marker: RichiestaMarker) {
        /**
         * metodo che mi ritorna true, se il marker selezionato è lo stesso che è stato cliccato
         */
        if (this.markerSelezionato === marker) {
            return true;
        }
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
