import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Meteo} from '../../shared/model/meteo.model';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {MeteoService} from '../../shared/meteo/meteo-service.service';
import {MarkedService} from '../service/marked-service/marked-service.service';
import {Coordinate} from '../../shared/model/coordinate.model';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})
export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() centroMappa: CentroMappa;
    datiMeteo: Meteo;
    map_loaded = false;

    /**
     * proprietà per definire lo status dell'oggetto marker della mappa
     */
    public pathUrl: string;
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

    constructor(private meteoService: MeteoService,
                private markedService: MarkedService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    ngOnInit() {
        /**
         *  inizializzo i marker di tipo icona da utilizzare nella mappa
         */
        this.icone();
        // console.log(this.centroMappa);
    }

    mappaCaricata() {
        /**
         *  imposto una proprietà a true quando la mappa è caricata
         */
        this.map_loaded = true;
    }

    selezioneMarker(marker: RichiestaMarker) {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.selezionato(marker);
    }

    trueMarker(marker: RichiestaMarker) {
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

    icone() {
        /**
         * credo due oggetti mappa per avere una corrispondenza tra il tipo di icona da usare e la relativa corrispondenza
         * per esempio lo stato dell'intervento o la prioprità della richiesta dell'intervento
         */
        this.pathUrl = '../../../assets/img/icone-markers/';

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

    tipoIcona(marker: RichiestaMarker) {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare (già mappate in precedenza vedi il metodo icone())
         */
        if (marker) {
            this.iconaStatoCorrenteSize = this.mapIconeSize.get(marker.prioritaRichiesta);
            const dir = !(this.markerSelezionato === marker) ? this.pathUrl + 'ns/' : this.pathUrl + 's/';
            this.iconaStatoCorrenteUrl = dir + this.iconaStatoCorrenteSize
                + this.mapIconeUrl.get(marker.stato.substring(0, 5).toLowerCase());
            if (!this.iconaStatoCorrenteSize) {
                return '../../../assets/img/icone-markers/30/success.png';
            }
            return this.iconaStatoCorrenteUrl;
        }
    }

    tipoAnimazione(m: RichiestaMarker) {
        /**
         * metodo non ancora implementato che modifica lo stato dell'icona facendolo rimbalzare o cadere
         */
        return null;
    }

    ricentraMappa(nuovoCentro: CentroMappa) {
        /**
         * metodo che riceve il nuovo centroMappa
         */
        this.centroMappa.zoom = nuovoCentro.zoom;
        this.cambiaCoordinate(nuovoCentro.coordinate);
    }

    cambiaCoordinate(coordinate: Coordinate) {
        /**
         * metodo che ricentra la mappa e si aspetta le coordinate
         */
        this.centroMappa.coordinate.latitudine = coordinate.latitudine;
        this.centroMappa.coordinate.longitudine = coordinate.longitudine;
    }

}
