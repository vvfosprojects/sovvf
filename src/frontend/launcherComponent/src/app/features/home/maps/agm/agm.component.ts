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
import { ControlPosition, FullscreenControlOptions, GoogleMap, LatLngBounds, LatLngLiteral, ZoomControlOptions } from '@agm/core/services/google-maps-types';
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
import { markerColor, markerColorRichiesta } from '../../../../shared/helper/function-colori';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { makeAreaMappa, makeCentroMappa, makeCoordinate, wipeStatoRichiesta } from '../../../../shared/helper/function';
import { MapsButtonsState } from '../../store/states/maps/maps-buttons.state';
import { ButtonControlAnimation, CustomButtonsMaps } from '../maps-interface/maps-custom-buttons';
import { MapsOptionsInterface } from '../../../../core/settings/maps-options';
import { SchedaContattoMarker } from '../maps-model/scheda-contatto.model';

declare var google: any;


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
    @Output() mapFullyLoaded = new EventEmitter<boolean>();
    cachedMarkers: CachedMarker[] = [];
    AppFeatures = AppFeatures;
    MouseE = MouseE;

    @Select(MeteoMarkersState.meteoMarkers) meteoMarkers$: Observable<MeteoMarker[]>;
    meteoMarkers: MeteoMarker[] = [];

    mapsOptions: MapsOptionsInterface;
    map_loaded = false;
    subscription = new Subscription();
    map: any;
    mapWrapper: GoogleMap;
    richiestaMarkerIconUrl: string;
    meteoMarkerIconUrl: string;
    schedaContattoMarkerIconUrl: string;

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
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    mappaCaricata(event: any): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata e inserisco nell'oggetto map il menù
         */
        const self = this;
        this.map_loaded = true;
        this.map = event;
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('Settings'));
        this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('CustomButtons'));
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
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

    isClicked(id: string, tipoMarker: string): boolean {
        return this.markerService.isClicked(id, tipoMarker);
    }

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
        this.mapService.setArea(makeAreaMappa(bounds));
    }

    mapClick(event: any) {
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

    actionRichiestaMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionRichiestaMarker(id, event);
    }

    actionMezzoMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionMezzoMarker(id, event, this.viewStateMappa.active === AppFeatures.ComposizionePartenza, this.viewStateMappa.active === AppFeatures.MezziInServizio);
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

    findDatiMeteo(_id: string): Meteo {
        /**
         * ritorno i dati meteo del marker selezionato
         */
        return this.markerService.findDatiMeteo(_id);
    }

    colorWindow(stato: string): string {
        return markerColor(stato);
    }

    colorWindowRichiesta(stato: StatoRichiesta): string {
        return markerColorRichiesta(stato);
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

}
