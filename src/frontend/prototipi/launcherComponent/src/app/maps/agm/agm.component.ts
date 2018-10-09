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
import {ControlPosition, FullscreenControlOptions, ZoomControlOptions} from '@agm/core/services/google-maps-types';

declare var google: any;


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
    map: any;

    zoomControlOptions: ZoomControlOptions = {
        position: ControlPosition.BOTTOM_RIGHT
    };

    fullscreenControlOptions: FullscreenControlOptions = {
        position: ControlPosition.TOP_LEFT
    };


    constructor(private markerService: MarkerService,
                private centerService: CenterService,
                private agmService: AgmService) {
        this.subscription = this.centerService.getCentro().subscribe(centro => {
            this.centroMappa = centro;
        });
        this.minMarkerCluster = 99999;
    }

    ngOnInit() {
    }

    mappaCaricata(event: any): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata e inserisco nell'oggetto map il menù
         */
        this.map_loaded = true;
        this.map = event;
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('Settings'));
    }

    loadAPIWrapper(mapWrapper): void {
        /**
         * importo il wrapper nell'oggetto map
         */
        this.agmService.map = mapWrapper;
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
        this.agmService.cambiaZoom(14);
    }

    hoverMarker(marker: any, type) {
        /**
         * richiamo il service marker e gli passo marker e tipo hover
         */
        this.markerService.hover(marker, type);
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
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker è visibile
         */
        return this.markerService.visibile(marker);
    }

    centroCambiato(centro) {
        /**
         * metodo che fa la next sulla subject di centro
         */
        this.agmService.centro$.next(centro);
    }

    mappaCliccata() {
        /**
         * metodo che ritorna allo zoom iniziale e deseleziona un marker se clicco sulla mappa
         */
        if (this.markerService.markerSelezionato) {
            this.agmService.cambiaZoom(11);
            this.markerService.deseleziona();
        }
    }

}
