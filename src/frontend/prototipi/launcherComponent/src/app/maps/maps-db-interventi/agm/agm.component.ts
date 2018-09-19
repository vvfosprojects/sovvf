import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Meteo} from '../../../shared/model/meteo.model';
import {CentroMappa} from '../maps-model/centro-mappa.model';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})
export class AgmComponent implements OnInit, OnChanges {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() centroMappa: CentroMappa;
    @Input() datiMeteo: Meteo;
    @Output() markerSelezionato: EventEmitter<RichiestaMarker> = new EventEmitter();

    map_loaded = false;

    loopMarker: RichiestaMarker[] = [];

    // proprietà per definire lo status dell'oggetto marker della mappa
    private pathUrl: string;
    private iconeStati: any;
    private mapIconeUrl: any;
    private iconeGrandezza: any;
    private mapIconeSize: any;

    // proprietà per definire lo status dell'oggetto marker corrente nella mappa
    private iconaStatoCorrenteUrl: any;
    private iconaStatoCorrenteSize: any;

    constructor() {

    }

    ngOnInit() {

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

    ngOnChanges() {
        if (this.loopMarker.length === 0) {
            this.loopMarker = this.richiesteMarkers;
        } else {
            this.loopMarker.concat(this.richiesteMarkers);
        }
    }

    selezioneMarker(marker: RichiestaMarker): void {
        this.markerSelezionato.emit(marker);
    }

    mappaCaricata() {
        this.map_loaded = true;
    }

    tipoIcona(m: RichiestaMarker) {
        if (m) {
            this.iconaStatoCorrenteSize = this.mapIconeSize.get(m.prioritaRichiesta);
            this.iconaStatoCorrenteUrl = this.pathUrl +
                this.iconaStatoCorrenteSize +
                this.mapIconeUrl.get(m.stato.substring(0, 5).toLowerCase());
            if (!this.iconaStatoCorrenteSize) {
                return '../../../assets/img/icone-markers/30/success.png';
            }
            return this.iconaStatoCorrenteUrl;
        }
    }

    tipoAnimazione(m: RichiestaMarker) {
        return null;
    }

}
