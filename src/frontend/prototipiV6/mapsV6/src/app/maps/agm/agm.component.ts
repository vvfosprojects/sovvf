import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    ElementRef
} from '@angular/core';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { MezzoMarker } from '../maps-model/mezzo-marker.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { Meteo } from '../../shared/model/meteo.model';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { MarkerService } from '../service/marker-service/marker-service.service';
import { Subject, Subscription } from 'rxjs';
import { CenterService } from '../service/center-service/center-service.service';
import { AgmService } from './agm-service.service';
import { ControlPosition, FullscreenControlOptions, ZoomControlOptions } from '@agm/core/services/google-maps-types';
import { MeteoMarker } from '../maps-model/meteo-marker.model';
import { debounceTime } from 'rxjs/operators';

declare var google: any;


@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnInit, OnDestroy {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() mezziMarkers: MezzoMarker[];
    @Input() centroMappa: CentroMappa;
    @Input() chiamataMarker: ChiamataMarker[];
    meteoMarkers: MeteoMarker[] = [];
    minMarkerCluster: number;
    datiMeteo: Meteo;
    coloreStato: string;
    map_loaded = false;
    subscription = new Subscription();
    map: any;
    delayMarkerTime = 250;
    richiestaMarkerIconUrl = '../../../assets/img/icone-markers/chiamata-marker-rosso.png';
    meteoMarkerIconUrl = '../../../assets/img/icone-markers/marker-meteo-32.png';

    private delayHover = new Subject<HoverType>();

    zoomControlOptions: ZoomControlOptions = {
        position: ControlPosition.BOTTOM_RIGHT
    };

    fullscreenControlOptions: FullscreenControlOptions = {
        position: ControlPosition.TOP_LEFT
    };

    @ViewChild('agmContainer') agmContainer: ElementRef;

    constructor(private markerService: MarkerService,
                private centerService: CenterService,
                private agmService: AgmService) {
        /**
         * dati del centro mappa attuale
         * @type {Subscription}
         */
        this.subscription.add(this.centerService.getCentro().subscribe((centro: CentroMappa) => {
            this.centroMappa = centro;
        }));
        /**
         * dati meteo del marker cliccato/selezionato
         * @type {Subscription}
         */
        this.subscription.add(this.markerService.getMeteo().subscribe((meteo: Meteo) => {
            this.datiMeteo = meteo;
        }));
        /**
         * colore del marker cliccato
         * @type {Subscription}
         */
        this.subscription.add(this.markerService.getMarkedColor().subscribe(colore => {
            this.coloreStato = colore;
        }));
        /**
         * marker di tipo meteo
         * @type {Subscription}
         */
        this.subscription.add(this.markerService.getMeteoMarker().subscribe(marker => {
            this.meteoMarkers = marker;
        }));
        /**
         * marker minimi per creare un cluster
         * @type {number}
         */
        this.minMarkerCluster = this.markerService.minMarkerCluster;
        /**
         * creo un delay all'hover del mouse
         * @type {Subscription}
         */
        this.subscription.add(this.delayHover.pipe(
            debounceTime(this.delayMarkerTime)).subscribe(
            evento => this.hoverMarkerDelayed(evento.markers, evento.hoverName)
        ));
    }

    ngOnInit() {
        this.centerService.centroMappaIniziale = this.centroMappa;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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

    getCoordinateMarker(event) {
        this.markerService.createMeteoMarker(event);
    }

    selezioneMarker(marker: any): void {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.markerService.action(marker, 'click');
        /**
         * prendo il colore della richiesta dallo stato
         */
        this.coloreStato = this.markerService.coloreStato;
    }

    hoverMarker(marker: any, type): void {
        /**
         * richiamo il service marker e gli passo marker e tipo hover
         */
        this.delayHover.next({markers: marker, hoverName: type});
    }

    hoverMarkerDelayed(marker: any, type): void {
        /**
         * richiamo il service marker e gli passo marker e tipo hover
         */
        this.markerService.action(marker, type);
    }

    urlIcona(marker: any, tipoSede?: boolean): string {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi l'url dell'icona da utilizzare
         */
        if (!tipoSede) {
            return this.markerService.tipoIcona(marker, false);
        } else {
            return this.markerService.tipoIcona(marker, true);
        }
    }

    zIndex(marker: any): number {
        return this.markerService.zIndex(marker);
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

    centroCambiato(centro): void {
        /**
         * metodo che fa la next sulla subject di centro
         */
        this.agmService.centro$.next(centro);
    }

    mappaCliccata(): void {
        /**
         * metodo che ritorna allo zoom iniziale e deseleziona un marker se clicco sulla mappa
         */
        this.markerService.action('', '');
    }

}

export interface HoverType {
    markers: any;
    hoverName: string;
}
