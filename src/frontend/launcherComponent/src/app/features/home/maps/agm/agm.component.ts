import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { MezzoMarker } from '../maps-model/mezzo-marker.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { Meteo } from '../../../../shared/model/meteo.model';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { MarkerService } from '../service/marker-service/marker-service.service';
import { Observable, Subscription } from 'rxjs';
import { MapService } from '../service/map-service/map-service.service';
import { MeteoMarker } from '../maps-model/meteo-marker.model';
import { DirectionInterface } from '../maps-interface/direction-interface';
import { CachedMarker } from '../maps-model/cached-marker.model';
import { ViewInterfaceMaps } from '../../../../shared/interface/view.interface';
import { ComposizioneMarker } from '../maps-model/composizione-marker.model';
import { Select } from '@ngxs/store';
import { MeteoMarkersState } from '../../store/states/maps/meteo-markers.state';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { MouseE } from '../../../../shared/enum/mouse-e.enum';
import { MapsDirectionState } from '../../store/states/maps/maps-direction.state';
import { markerColor, markerColorRichiesta, markerColorSC } from '../../../../shared/helper/mappa/function-colori-marker';
import { wipeStatoRichiesta } from 'src/app/shared/helper/function-richieste';
import { makeCentroMappa, makeCoordinate } from '../../../../shared/helper/mappa/function-mappa';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { MapsButtonsState } from '../../store/states/maps/maps-buttons.state';
import { ButtonControlAnimation, CustomButtonsMaps } from '../maps-interface/maps-custom-buttons';
import { MapsOptionsInterface } from '../../../../core/settings/maps-options';
import { SchedaContattoMarker } from '../maps-model/scheda-contatto-marker.model';
import { ClassificazioneSchedaContatto } from '../../../../shared/enum/classificazione-scheda-contatto.enum';

import ZoomControlOptions = google.maps.ZoomControlOptions;
import ControlPosition = google.maps.ControlPosition;
import FullscreenControlOptions = google.maps.FullscreenControlOptions;
import LatLngBounds = google.maps.LatLngBounds;
import LatLngLiteral = google.maps.LatLngLiteral;

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnDestroy {

    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() mezziMarkers: MezzoMarker[];
    @Input() centroMappa: CentroMappa;
    @Input() chiamateMarkers: ChiamataMarker[];
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() composizioneMarkers: ComposizioneMarker[];
    @Input() schedeContattoMarkers: SchedaContattoMarker[];
    @Input() boxAttivi: boolean;

    @Output() mapFullyLoaded = new EventEmitter<boolean>();
    cachedMarkers: CachedMarker[] = [];
    AppFeatures = AppFeatures;
    MouseE = MouseE;

    @Select(MeteoMarkersState.meteoMarkers) meteoMarkers$: Observable<MeteoMarker[]>;
    meteoMarkers: MeteoMarker[] = [];

    mapsOptions: MapsOptionsInterface;
    mapLoaded = false;
    subscription = new Subscription();
    map: any;
    mapWrapper: any;
    richiestaMarkerIconUrl: string;
    meteoMarkerIconUrl: string;
    schedaContattoMarkerIconUrl: string;
    disabilitaIndicatoriMezzo = true;

    zoomControlOptions: ZoomControlOptions = {
        position: ControlPosition.BOTTOM_RIGHT
    };

    fullscreenControlOptions: FullscreenControlOptions = {
        position: ControlPosition.TOP_LEFT
    };

    private mapZoom: Map<number, number>;

    @Select(MapsDirectionState.direction) direction$: Observable<DirectionInterface>;
    direction: DirectionInterface = {
        isVisible: false
    };

    @Select(MapsButtonsState.controlAnimation) controlAnimation$: Observable<ButtonControlAnimation>;
    controlAnimation: ButtonControlAnimation;

    @Select(MapsButtonsState.bounceAnimationStatus) bounceAnimationStatus$: Observable<boolean>;
    bounceAnimationStatus: boolean;

    renderOptions: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: true
    };

    constructor(private markerService: MarkerService,
                private mapService: MapService) {
        /**
         * creo un array di marker fittizi con tutte le icone che utilizzerà agm per metterle in cache
         * ed evitare che si presenti il bug delle icone "selezionate"
         */
        this.markerService.iconeCached.forEach(iconeC => {
            this.cachedMarkers.push(new CachedMarker(iconeC));
        });
        /**
         * marker di tipo meteo
         * @returns: { Subscription }
         */
        this.subscription.add(this.meteoMarkers$.subscribe((marker: MeteoMarker[]) => {
            this.meteoMarkers = marker;
        }));
        /**
         * direzioni di tipo direction
         * @returns: { Subscription }
         */
        this.subscription.add(
            this.direction$.subscribe((direzioni: DirectionInterface) => {
                this.direction = direzioni;
            })
        );
        /**
         * opzioni della mappa
         */
        this.mapsOptions = this.markerService.mapsOptions;
        /**
         * imposto il path per le icone di MeteoMarker e ChiamataMarker
         */
        this.richiestaMarkerIconUrl = this.markerService.iconaSpeciale('chiamata');
        this.meteoMarkerIconUrl = this.markerService.iconaSpeciale('meteo');
        this.schedaContattoMarkerIconUrl = this.markerService.iconaSpeciale('schedaContatto');
        /**
         * stato dei custom button
         */
        this.subscription.add(
            this.controlAnimation$.subscribe((control: ButtonControlAnimation) => this.controlAnimation = control)
        );
        /**
         * bounce animation status
         */
        this.subscription.add(
            this.bounceAnimationStatus$.subscribe((status: boolean) => this.bounceAnimationStatus = status)
        );
        /**
         * creo una mappa zoom corrente -> round exp da utilizzare per arrotondare le coordinate
         * @returns: { Map<number, number> }
         */
        this.mapZoom = this.mapZoomToRound();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    mappaCaricata(event: any): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata e inserisco nell'oggetto map il menù
         */
        const self = this;
        this.mapLoaded = true;
        this.map = event;
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('Settings'));
        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('CustomButtons'));
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
            self.cachedMarkers = [];
            self.mapFullyLoaded.emit(true);
        });
    }

    loadAPIWrapper(mapWrapper: any): void {
        /**
         * importo il wrapper nell'oggetto map
         */
        this.mapWrapper = mapWrapper;
    }

    zIndex(id: string, tipoMarker: string, rilevante?: boolean, rilevanzaStArCu?: boolean): number {
        return this.markerService.zIndex(id, tipoMarker, rilevante, rilevanzaStArCu);
    }

    // Todo da togliere
    isClicked(id: string, tipoMarker: string): boolean {
        return this.markerService.isClicked(id, tipoMarker);
    }

    // Todo da togliere
    isHovered(id: string, tipoMarker: string): boolean {
        return this.markerService.isHovered(id, tipoMarker);
    }

    isRilevante(rilevante?: boolean, rilevanzaStArCu?: boolean): 'BOUNCE' | 'DROP' | null {
        if ((!!rilevante || !!rilevanzaStArCu) && !this.controlAnimation.toggleStatus && this.bounceAnimationStatus) {
            return 'BOUNCE';
        }
        return null;
    }

    animation(mySelf: boolean): 'BOUNCE' | 'DROP' | null {
        if (mySelf) {
            return 'DROP';
        }
        return null;
    }

    isSelfHovered(id: string, tipoMarker: string): boolean {
        return this.markerService.isSelfHovered(id, tipoMarker);
    }

    isSelfClicked(id: string, tipoMarker: string): boolean {
        return this.markerService.isSelfClicked(id, tipoMarker);
    }

    // Todo da togliere
    isVisible(tipoMarker: string): boolean {
        return this.markerService.isVisible(tipoMarker);
    }

    isOpaque(id: string, tipoMarker: string): number {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker è opacizzato
         */
        return this.markerService.isOpaque(id, tipoMarker);
    }

    centroCambiato(centro: LatLngLiteral): void {
        this.mapService.setCentro(makeCentroMappa(makeCoordinate(centro.lat, centro.lng, 8), this.mapWrapper.getZoom()));
    }

    areaCambiata(bounds: LatLngBounds): void {
        this.mapService.setArea(bounds, this.mapZoom.get(this.mapWrapper.getZoom()));
    }

    mapClick(event: any): void {
        this.markerService.createMeteoMarker(event);
        this.markerService.clearSelfClick();
    }

    mapDblClick(): void {
        this.markerService.noAction();
    }

    iconaRichiestaMarkerSelezionato(id: string): string {
        /**
         * ritorno un oggetto di tipo IconUrl con le info dell'icona da utilizzare
         */
        return this.markerService.iconaRichiestaMarkerSelezionato(id);
    }

    iconaMezzoMarker(mezzoMarker: MezzoMarker): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaMezzoMarker(mezzoMarker.mezzo.codice, mezzoMarker.mezzo.stato);
    }

    iconaSedeMarker(sedeMarker: SedeMarker): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaSedeMarker(sedeMarker.codice, sedeMarker.tipo);
    }

    iconaSedeTipoWindow(tipo: string): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaSedeTipoWindow(tipo);
    }

    iconaSchedaContattoMarker(schedaContatto: SchedaContattoMarker): string {
        /**
         * ritorno l'url dell'icona del marker scheda contatto
         */
        const checkGestita = schedaContatto.gestita ? '-g' : '';
        return this.markerService.iconaSchedaContattoMarker(schedaContatto.classificazione + checkGestita);
    }

    actionRichiestaMarker(id: string, codice: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionRichiestaMarker(id, codice, event);
    }

    actionMezzoMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionMezzoMarker(id, event, this.viewStateMappa?.active === AppFeatures.ComposizionePartenza, this.viewStateMappa?.active === AppFeatures.MezziInServizio);
    }

    actionSedeMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionSedeMarker(id, event);
    }

    actionSchedaContattoMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionSchedaContattoMarker(id, event);
    }

    findDatiMeteo(id: string): Meteo {
        /**
         * ritorno i dati meteo del marker selezionato
         */
        return this.markerService.findDatiMeteo(id);
    }

    colorWindow(stato: string): string {
        return markerColor(stato);
    }

    colorWindowRichiesta(stato: StatoRichiesta): string {
        return markerColorRichiesta(stato);
    }

    colorWindowSC(stato: ClassificazioneSchedaContatto): string {
        return markerColorSC(stato);
    }

    wipeStatoRichiesta(statoEnum: StatoRichiesta): string {
        return wipeStatoRichiesta(statoEnum);
    }

    onCustomButtonClick($event: CustomButtonsMaps): void {
        this.markerService.onCustomButtonClick($event);
    }

    onAddMezzoComposizione(idMezzo: string): void {
        this.markerService.onAddMezzoComposizione(idMezzo);
    }

    /**
     * zoom agm - roundExp
     * @returns: { Map<number, number> }
     */
    mapZoomToRound(): Map<number, number> {
        return new Map([
            [6, 0],
            [7, 1], [8, 1], [9, 1],
            [10, 2], [11, 2], [12, 2], [13, 2],
            [14, 3], [15, 3], [16, 3], [17, 3], [18, 3]
        ]);
    }

}
