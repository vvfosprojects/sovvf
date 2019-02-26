import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    ElementRef, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { MezzoMarker } from '../maps-model/mezzo-marker.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { Meteo } from '../../../../shared/model/meteo.model';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { MarkerService } from '../service/marker-service/marker-service.service';
import { Subscription, Observable } from 'rxjs';
import { CenterService } from '../service/center-service/center-service.service';
import { AgmService } from './agm-service.service';
import { ControlPosition, FullscreenControlOptions, ZoomControlOptions } from '@agm/core/services/google-maps-types';
import { MeteoMarker } from '../maps-model/meteo-marker.model';
import { DirectionInterface } from '../maps-interface/direction-interface';
import { CachedMarker } from '../maps-model/cached-marker.model';
import { ViewInterfaceMaps } from '../../../../shared/interface/view.interface';
import { ComposizioneMarker } from '../maps-model/composizione-marker.model';
import { Select } from '@ngxs/store';
import { MeteoMarkersState } from '../store/';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { MouseE } from '../../../../shared/enum/mouse-e.enum';
import { MapsDirectionState } from '../store/states/maps-direction.state';

declare var google: any;


@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnInit, OnDestroy, OnChanges {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() mezziMarkers: MezzoMarker[];
    @Input() centroMappa: CentroMappa; // check non cambia in input
    @Input() chiamataMarkers: ChiamataMarker[];
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() composizioneMarkers: ComposizioneMarker[];
    @Output() mapFullyLoaded = new EventEmitter<boolean>();
    cachedMarkers: CachedMarker[] = [];
    AppFeatures = AppFeatures;
    MouseE = MouseE;

    @Select(MeteoMarkersState.meteoMarkers) meteoMarkers$: Observable<MeteoMarker[]>;
    meteoMarkers: MeteoMarker[] = [];

    minMarkerCluster: number;
    datiMeteo: Meteo;
    coloreStatoWindow: string;
    map_loaded = false;
    subscription = new Subscription();
    map: any;
    richiestaMarkerIconUrl: string;
    meteoMarkerIconUrl: string;

    zoomControlOptions: ZoomControlOptions = {
        position: ControlPosition.BOTTOM_RIGHT
    };

    fullscreenControlOptions: FullscreenControlOptions = {
        position: ControlPosition.TOP_LEFT
    };

    @Select(MapsDirectionState.direction) direction$: Observable<DirectionInterface>;
    direction: DirectionInterface = {
        isVisible: false
    };

    renderOptions: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: true
    };


    @ViewChild('agmContainer') agmContainer: ElementRef;

    constructor(private markerService: MarkerService,
        private centerService: CenterService,
        private agmService: AgmService) {
        /**
         * creo un array di marker fittizi con tutte le icone che utilizzerà agm per metterle in cache
         * ed evitare che si presenti il bug delle icone "selezionate"
         */
        this.markerService.iconeCached.forEach(iconeC => {
            this.cachedMarkers.push(new CachedMarker(iconeC));
        });
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
            this.coloreStatoWindow = colore;
        }));
        /**
         * marker di tipo meteo
         * @type {Subscription}
         */
        this.subscription.add(this.meteoMarkers$.subscribe((marker: MeteoMarker[]) => {
            this.meteoMarkers = marker;
        }));
        /**
         * direzioni di tipo direction
         * @type {Subscription}
         */
        this.subscription.add(
            this.direction$.subscribe((direzioni: DirectionInterface) => {
                this.direction = direzioni;
            })
        );
        /**
         * marker minimi per creare un cluster
         * @type {number}
         */
        this.minMarkerCluster = this.markerService.minMarkerCluster;
        /**
         * imposto il path per le icone di MeteoMarker e ChiamataMarker
         */
        this.richiestaMarkerIconUrl = this.markerService.iconaSpeciale('chiamata');
        this.meteoMarkerIconUrl = this.markerService.iconaSpeciale('meteo');
    }

    ngOnInit() {
        this.centerService.centroMappaIniziale = this.centroMappa;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
    }

    mappaCaricata(event: any): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata e inserisco nell'oggetto map il menù
         */
        const self = this;
        this.map_loaded = true;
        this.map = event;
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('Settings'));
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            self.cachedMarkers = [];
            self.mapFullyLoaded.emit(true);
        });
    }

    loadAPIWrapper(mapWrapper: any): void {
        /**
         * importo il wrapper nell'oggetto map
         */
        this.agmService.map = mapWrapper;
    }

    getCoordinateMarker(event: any) {
        this.markerService.createMeteoMarker(event);
    }

    selezioneMarker(marker: any): void {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.markerService.action(marker, MouseE.Click);
    }

    hoverMarker(marker: any, type: any): void {
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
        return this.markerService.trueMarker(marker, true);
    }

    isVisible(marker: any): boolean {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker è visibile
         */
        return this.markerService.visibile(marker);
    }

    isOpaco(marker: any): number {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker è opacizzato
         */
        return this.markerService.opaco(marker);
    }

    centroCambiato(centro: any): void {
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
