import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {SedeMarker} from '../maps-model/sede-marker.model';
import {MezzoMarker} from '../maps-model/mezzo-marker.model';
import {Meteo} from '../../shared/model/meteo.model';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {MarkerService} from '../service/marker-service/marker-service.service';
import {Subscription} from 'rxjs';
import {CenterService} from '../service/center-service/center-service.service';
import {AgmService} from './agm-service.service';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() mezziMarkers: MezzoMarker[];
    @Input() centroMappa: CentroMappa;
    minMarkerCluster: number;
    datiMeteo: Meteo;
    map_loaded = false;
    subscription: Subscription;

    constructor(private markerService: MarkerService,
                private centerService: CenterService,
                private agmService: AgmService) {
        this.subscription = this.centerService.getCentro().subscribe(centro => {
            this.centroMappa = centro;
        });
        this.minMarkerCluster = 10;
    }

    ngOnInit() {
    }

    mappaCaricata(): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata
         */
        this.map_loaded = true;
    }

    loadAPIWrapper(map): void {
        /**
         * importo il wrapper nell'oggetto map
         */
        this.agmService.map = map;
    }

    selezioneMarker(marker: any): void {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.markerService.selezionato(marker);
        /**
         *  prendo i dati del meteo dal service marker (che li ha già richiesti)
         */
        this.datiMeteo = this.markerService.datiMeteo;
        /**
         * richiamo i metodi per modficare il centro e lo zoom del marker cliccato
         */
        this.agmService.centraMappa(marker.getCoordinate());
        this.agmService.cambiaZoom(12);
    }

    urlIcona(marker: any): string {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi l'url dell'icona da utilizzare
         */
        return this.markerService.tipoIcona(marker);
    }

    trueMarker(marker: any): boolean {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker cliccato è quello selezionato
         */
        return this.markerService.trueMarker(marker);
    }

    isVisible(marker: any): boolean {
        /**
         * metodo che nasconde o mostra i marker sulla mappa - in lavorazione
         */
        if (marker) {
            return true;
        }
    }

    centroCambiato(centro) {
        /**
         * metodo che fa la next sulla subject di centro
         */
        this.agmService.centro$.next(centro);
    }

}
