import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
/**
 * Model
 */
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { MeteoMarker } from '../../maps-model/meteo-marker.model';
import { Localita } from '../../../../../shared/model/localita.model';
import { Meteo } from '../../../../../shared/model/meteo.model';
/**
 * Enum
 */
import { MouseE } from '../../../../../shared/enum/mouse-e.enum';
/**
 * Ngxs
 */
import { Select, Store } from '@ngxs/store';
import { MarkerMeteoState } from '../../../store/states/filterbar/marker-meteo-switch.state';
import { ClearRichiestaFissata, SetRichiestaFissata } from '../../../store/actions/richieste/richiesta-fissata.actions';
import { ClearRichiestaHover, SetRichiestaHover } from '../../../store/actions/richieste/richiesta-hover.actions';
import { ClearRichiestaSelezionata } from '../../../store/actions/richieste/richiesta-selezionata.actions';
import { AddMeteoMarker, RemoveMeteoMarker } from '../../../store/actions/maps/meteo-markers.actions';
import { MarkerState } from '../../../store/states/maps/marker.state';
import {
    ClearMarkerMezzoHover,
    ClearMarkerMezzoSelezionato,
    ClearMarkerRichiestaHover,
    ClearMarkerRichiestaSelezionato,
    ClearMarkerSedeHover,
    ClearMarkerSedeSelezionato,
    SetMarkerMezzoHover,
    SetMarkerMezzoSelezionato,
    SetMarkerRichiestaHover,
    SetMarkerRichiestaSelezionato,
    SetMarkerSedeHover,
    SetMarkerSedeSelezionato,
} from '../../../store/actions/maps/marker.actions';
import { GetInitCentroMappa } from '../../../store/actions/maps/centro-mappa.actions';
import { MapsFiltroState } from '../../../store/states/maps/maps-filtro.state';
/**
 * Helper Functions
 */
import { IconMappe } from './_icone';
import { coord2String, makeID } from '../../../../../shared/helper/function';
import { GetMarkerDatiMeteo } from '../../../store/actions/maps/marker-info-window.actions';
import { MarkerInfoWindowState } from '../../../store/states/maps/marker-info-window.state';
import { MarkerDatiMeteo } from '../../maps-model/marker-dati-meteo.interface';
import { MarkerOpachiState, MarkerOpachiStateModel } from '../../../store/states/maps/marker-opachi.state';
import { CustomButtonsMaps } from '../../maps-interface/maps-custom-buttons';
import {
    CentraMappaButton,
    ToggleAnimation,
    ToggleAnimationButton
} from '../../../store/actions/maps/maps-buttons.actions';
import { MAPSOPTIONS, MapsOptionsInterface } from '../../../../../core/settings/maps-options';
import {
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    SelectMezzoComposizioneFromMappa
} from '../../../store/actions/composizione-partenza/mezzi-composizione.actions';
import { ViewInterfaceMaps } from '../../../../../shared/interface/view.interface';
import { ViewComponentState } from '../../../store/states/view/view.state';
import { AppFeatures } from '../../../../../shared/enum/app-features.enum';
import { ClearMezzoInServizioHover, SetMezzoInServizioHover, SetMezzoInServizioSelezionato } from '../../../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';


@Injectable()
export class MarkerService implements OnDestroy {

    private subscription = new Subscription();
    private icone = new IconMappe();

    private selfHoveredMarker: string;
    private selfClickedMarker: string;

    mapsOptions: MapsOptionsInterface;
    iconeCached: string[];

    @Select(MarkerState.markerRichiestaSelezionato) markerRichiestaSelezionato$: Observable<string>;
    private markerRichiestaSelezionato: string;

    @Select(MarkerState.markerRichiestaHover) markerRichiestaHover$: Observable<string>;
    private markerRichiestaHover: string;

    @Select(MarkerState.markerMezzoSelezionato) markerMezzoSelezionato$: Observable<string>;
    private markerMezzoSelezionato: string;

    @Select(MarkerState.markerMezzoHover) markerMezzoHover$: Observable<string>;
    private markerMezzoHover: string;

    @Select(MarkerState.markerSedeSelezionato) markerSedeSelezionato$: Observable<string>;
    private markerSedeSelezionato: string;

    @Select(MarkerState.markerSedeHover) markerSedeHover$: Observable<string>;
    private markerSedeHover: string;

    @Select(MapsFiltroState.filtroMarkerAttivo) filtroMarkerAttivo$: Observable<string[]>;
    private filtroMarkerAttivo: string[];

    @Select(MarkerInfoWindowState.markerDatiMeteo) datiMeteo$: Observable<MarkerDatiMeteo[]>;
    private datiMeteo: MarkerDatiMeteo[];

    @Select(MarkerOpachiState.markerOpachi) markerOpachi$: Observable<MarkerOpachiStateModel>;
    private markerOpachi: MarkerOpachiStateModel;

    @Select(ViewComponentState.viewStateMaps) viewStateMaps$: Observable<ViewInterfaceMaps>;
    private viewStateMaps: ViewInterfaceMaps;

    @Select(MarkerMeteoState.active) stateSwitch$: Observable<boolean>;
    private switchMeteo: boolean;

    @Select(MarkerState.markerStateNull) markerStateNull$: Observable<boolean>;

    constructor(private store: Store) {
        this.subscription.add(this.filtroMarkerAttivo$.subscribe((filtroAttivo: string[]) => {
            this.filtroMarkerAttivo = filtroAttivo;
            this.store.dispatch(new ToggleAnimationButton(true));
        }));
        this.subscription.add(this.stateSwitch$.subscribe((state: boolean) => this.switchMeteo = state));
        this.subscription.add(this.markerOpachi$.subscribe((state: MarkerOpachiStateModel) => this.markerOpachi = state));
        this.subscription.add(this.markerRichiestaSelezionato$.subscribe((id: string) => this.markerRichiestaSelezionato = id));
        this.subscription.add(this.markerRichiestaHover$.subscribe((id: string) => this.markerRichiestaHover = id));
        this.subscription.add(this.markerMezzoSelezionato$.subscribe((id: string) => this.markerMezzoSelezionato = id));
        this.subscription.add(this.markerMezzoHover$.subscribe((id: string) => this.markerMezzoHover = id));
        this.subscription.add(this.markerSedeSelezionato$.subscribe((id: string) => this.markerSedeSelezionato = id));
        this.subscription.add(this.markerSedeHover$.subscribe((id: string) => this.markerSedeHover = id));
        this.subscription.add(this.datiMeteo$.subscribe((meteo: MarkerDatiMeteo[]) => this.datiMeteo = meteo));
        this.subscription.add(this.viewStateMaps$.subscribe((viewStateMaps: ViewInterfaceMaps) => this.viewStateMaps = viewStateMaps));
        this.subscription.add(this.markerStateNull$.subscribe((isNull: boolean) => {
            if (isNull && this.selfClickedMarker) {
                this.selfClickedMarker = null;
            }
        }));
        /**
         * opzioni della mappa
         */
        this.mapsOptions = MAPSOPTIONS;
        /**
         * creo un array con i path di tutte le icone da mettere in cache
         */
        this.iconeCached = this.icone.urlIcone();
        /**
         * intervallo animazione dei marker rilevanti 30 sec.
         */
        setInterval(() => {
            this.store.dispatch(new ToggleAnimation());
        }, MAPSOPTIONS.animationTimeoutMs);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * ritorna l'url del path dell'icona "speciale" da utilizzare
     * @param tipo
     */
    iconaSpeciale(tipo: string): string {
        return this.icone.iconaSpeciale(tipo);
    }

    isClicked(id: string, tipoMarker: string): boolean {
        let trueMarkerValue = false;
        switch (tipoMarker) {
            case 'richiesta':
                if (this.markerRichiestaSelezionato === id) {
                    trueMarkerValue = true;
                }
                break;
            case 'mezzo':
                if (this.markerMezzoSelezionato === id) {
                    trueMarkerValue = true;
                }
                break;
            case 'sede':
                if (this.markerSedeSelezionato === id) {
                    trueMarkerValue = true;
                }
                break;
        }
        return trueMarkerValue;
    }

    isHovered(id: string, tipoMarker: string): boolean {
        let trueMarkerValue = false;
        switch (tipoMarker) {
            case 'richiesta':
                if (this.markerRichiestaHover === id) {
                    trueMarkerValue = true;
                }
                break;
            case 'mezzo':
                if (this.markerMezzoHover === id) {
                    trueMarkerValue = true;
                }
                break;
            case 'sede':
                if (this.markerSedeHover === id) {
                    trueMarkerValue = true;
                }
                break;
        }
        return trueMarkerValue;
    }

    isSelfHovered(id: string, tipoMarker: string): boolean {
        let trueMarkerValue = false;
        switch (tipoMarker) {
            case 'richiesta':
                if (this.selfHoveredMarker === `richiesta-${id}` && !this.isClicked(id, tipoMarker)) {
                    trueMarkerValue = true;
                }
                break;
            case 'mezzo':
                if (this.selfHoveredMarker === `mezzo-${id}` && !this.isClicked(id, tipoMarker)) {
                    trueMarkerValue = true;
                }
                break;
            case 'sede':
                if (this.selfHoveredMarker === `sede-${id}` && !this.isClicked(id, tipoMarker)) {
                    trueMarkerValue = true;
                }
                break;
            case 'schedaContatto':
                if (this.selfHoveredMarker === `scheda-contatto-${id}` && !this.isClicked(id, tipoMarker)) {
                    trueMarkerValue = true;
                }
                break;
        }
        return trueMarkerValue;
    }

    isSelfClicked(id: string, tipoMarker: string): boolean {
        let trueMarkerValue = false;
        if (this.isVisible(tipoMarker)) {
            switch (tipoMarker) {
                case 'richiesta':
                    if (this.selfClickedMarker === `richiesta-${id}` || (this.selfHoveredMarker === `richiesta-${id}` && this.isClicked(id, tipoMarker))) {
                        trueMarkerValue = true;
                    }
                    break;
                case 'mezzo':
                    if (this.selfClickedMarker === `mezzo-${id}` || (this.selfHoveredMarker === `mezzo-${id}` && this.isClicked(id, tipoMarker))) {
                        trueMarkerValue = true;
                    }
                    break;
                case 'sede':
                    if (this.selfClickedMarker === `sede-${id}` || (this.selfHoveredMarker === `sede-${id}` && this.isClicked(id, tipoMarker))) {
                        trueMarkerValue = true;
                    }
                    break;
            }
        }
        return trueMarkerValue;
    }

    zIndex(id: string, tipoMarker: string, rilevante?: boolean, rilevanzaStArCu?: boolean): number {
        let zIndexValue = 30;
        const zIndexUp = 10;
        switch (tipoMarker) {
            case 'richiesta':
                if (this.markerRichiestaSelezionato === id || this.markerRichiestaHover === id) {
                    zIndexValue += zIndexUp;
                }
                if (!!rilevante || !!rilevanzaStArCu) {
                    zIndexValue += zIndexUp / 2;
                }
                if (this.markerOpachi.stato.richieste) {
                    if (this.markerOpachi.markerOpachiId.richiesteId.includes(id)) {
                        zIndexValue += zIndexUp;
                    }
                }
                break;
            case 'mezzo':
                if (this.markerMezzoSelezionato === id || this.markerMezzoHover === id) {
                    zIndexValue += zIndexUp;
                }
                if (this.markerOpachi.stato.mezzi) {
                    if (this.markerOpachi.markerOpachiId.mezziId.includes(id)) {
                        zIndexValue += zIndexUp;
                    }
                }
                break;
            case 'sede':
                if (this.markerSedeSelezionato === id || this.markerSedeHover === id) {
                    zIndexValue += zIndexUp;
                }
                if (this.markerOpachi.stato.sedi) {
                    if (this.markerOpachi.markerOpachiId.sediId.includes(id)) {
                        zIndexValue += zIndexUp;
                    }
                }
                break;
        }
        return zIndexValue;
    }

    isVisible(tipoMarker: string): boolean {
        if (this.filtroMarkerAttivo && this.filtroMarkerAttivo.length > 0) {
            let isVisible = false;
            switch (tipoMarker) {
                case 'richiesta':
                    isVisible = this.filtroMarkerAttivo.includes(tipoMarker);
                    break;
                case 'mezzo':
                    isVisible = this.filtroMarkerAttivo.includes(tipoMarker);
                    break;
                case 'sede':
                    isVisible = this.filtroMarkerAttivo.includes(tipoMarker);
                    break;
                case 'schedeContatto':
                    isVisible = this.viewStateMaps.active === AppFeatures.SchedeContatto;
            }
            return isVisible;
        }
    }

    isOpaque(id: string, tipoMarker: string): number {
        let isOpaque = 1;
        switch (tipoMarker) {
            case 'richiesta':
                if (this.markerOpachi.stato.richieste) {
                    if (!this.markerOpachi.markerOpachiId.richiesteId.includes(id)) {
                        isOpaque = this.mapsOptions.livelloOpacita;
                    }
                }
                break;
            case 'mezzo':
                if (this.markerOpachi.stato.mezzi) {
                    if (!this.markerOpachi.markerOpachiId.mezziId.includes(id)) {
                        isOpaque = this.mapsOptions.livelloOpacita;
                    }
                }
                break;
            case 'sede':
                if (this.markerOpachi.stato.sedi) {
                    if (!this.markerOpachi.markerOpachiId.sediId.includes(id)) {
                        isOpaque = this.mapsOptions.livelloOpacita;
                    }
                }
                break;
        }
        return isOpaque;
    }

    /**
     * crea a runtime un marker, se l'utente clicca in un punto della mappa
     * @param event
     */
    createMeteoMarker(event: any) {
        if (this.switchMeteo) {
            const coordinate = new Coordinate(event.coords.lat, event.coords.lng);
            const etichetta = `(lat: ${coord2String(event.coords.lat)} - lng: ${coord2String(event.coords.lng)})`;
            const id = makeID(10);
            const mMarker: MeteoMarker = new MeteoMarker(id, new Localita(coordinate, etichetta));
            const arrayM: MeteoMarker[] = [];
            arrayM.push(mMarker);
            this.store.dispatch(new GetMarkerDatiMeteo('meteo-' + id, coordinate));
            this.store.dispatch(new RemoveMeteoMarker());
            this.store.dispatch(new AddMeteoMarker(arrayM));
        }
    }

    iconaRichiestaMarkerSelezionato(id: string): string {
        const path = 'assets/img/icone-markers/richieste/';
        if (this.markerRichiestaSelezionato === id || this.markerRichiestaHover === id) {
            return path + 's/';
        }
        return path + 'ns/';
    }

    iconaMezzoMarker(id, stato): string {
        let selezionato = false;
        if (this.markerMezzoSelezionato === id || this.markerMezzoHover === id) {
            selezionato = true;
        }
        return this.icone.iconaMezzo(stato, selezionato);
    }

    iconaSedeMarker(id, tipo): string {
        let selezionato = false;
        if (this.markerSedeSelezionato === id || this.markerSedeHover === id) {
            selezionato = true;
        }
        return this.icone.iconaSede(tipo, selezionato);
    }

    iconaSchedaContattoMarker(tipo): string {
        return this.icone.iconaSchedaContatto(tipo);
    }

    iconaSedeTipoWindow(tipo): string {
        return this.icone.iconaSedeTipoWindow(tipo);
    }

    actionRichiestaMarker(id: string, mouse: MouseE) {
        switch (mouse) {
            case MouseE.HoverIn: {
                this.store.dispatch(new SetMarkerRichiestaHover(id));
                this.store.dispatch(new SetRichiestaHover(id));
                this.selfHoveredMarker = `richiesta-${id}`;
            }
                break;
            case MouseE.HoverOut: {
                this.store.dispatch(new ClearMarkerRichiestaHover());
                this.store.dispatch(new ClearRichiestaHover());
                this.selfHoveredMarker = ``;
            }
                break;
            case MouseE.Click: {
                if (this.markerRichiestaSelezionato !== id) {
                    this.store.dispatch(new SetMarkerRichiestaSelezionato(id));
                    this.store.dispatch(new SetRichiestaFissata(id));
                }
                this.selfClickedMarker = `richiesta-${id}`;
            }
                break;
        }
    }

    actionMezzoMarker(id: string, mouse: MouseE, composizione: boolean, mezziInServizio: boolean) {
        switch (mouse) {
            case MouseE.HoverIn: {
                this.store.dispatch(new SetMarkerMezzoHover(id));
                this.selfHoveredMarker = `mezzo-${id}`;
                if (composizione) {
                    this.store.dispatch(new HoverInMezzoComposizione(id));
                } else if (mezziInServizio) {
                    this.store.dispatch(new SetMezzoInServizioHover(id));
                }
            }
                break;
            case MouseE.HoverOut: {
                this.store.dispatch(new ClearMarkerMezzoHover());
                this.selfHoveredMarker = ``;
                if (composizione) {
                    this.store.dispatch(new HoverOutMezzoComposizione());
                } else if (mezziInServizio) {
                    this.store.dispatch(new ClearMezzoInServizioHover());
                }
            }
                break;
            case MouseE.Click: {
                if (this.markerMezzoSelezionato !== id) {
                    this.store.dispatch(new SetMarkerMezzoSelezionato(id));
                }
                if (mezziInServizio) {
                    this.store.dispatch(new SetMezzoInServizioSelezionato(id));
                }
                this.selfClickedMarker = `mezzo-${id}`;
            }
                break;
        }
    }

    actionSedeMarker(id: string, mouse: MouseE) {
        switch (mouse) {
            case MouseE.HoverIn: {
                this.store.dispatch(new SetMarkerSedeHover(id));
                this.selfHoveredMarker = `sede-${id}`;
            }
                break;
            case MouseE.HoverOut: {
                this.store.dispatch(new ClearMarkerSedeHover());
                this.selfHoveredMarker = ``;
            }
                break;
            case MouseE.Click: {
                if (this.markerSedeSelezionato !== id) {
                    this.store.dispatch(new SetMarkerSedeSelezionato(id));
                }
                this.selfClickedMarker = `sede-${id}`;
            }
                break;
        }
    }

    actionSchedaContattoMarker(id: string, mouse: MouseE) {
        switch (mouse) {
            case MouseE.HoverIn: {
                // this.store.dispatch(new SetMarkerSedeHover(id));
                this.selfHoveredMarker = `scheda-contatto-${id}`;
            }
                break;
            case MouseE.HoverOut: {
                // this.store.dispatch(new ClearMarkerSedeHover());
                this.selfHoveredMarker = ``;
            }
                break;
            case MouseE.Click: {
                if (this.markerSedeSelezionato !== id) {
                    // this.store.dispatch(new SetMarkerSedeSelezionato(id));
                }
                this.selfClickedMarker = `scheda-contatto-${id}`;
            }
                break;
        }
    }

    clearSelfClick() {
        this.selfClickedMarker = ``;
    }

    noAction() {
        if (this.viewStateMaps.active !== AppFeatures.ComposizionePartenza) {
            this.store.dispatch(new ClearRichiestaFissata());
            this.store.dispatch(new ClearRichiestaSelezionata());
            this.store.dispatch(new ClearMarkerRichiestaSelezionato());
            this.store.dispatch(new ClearMarkerSedeSelezionato());
            this.store.dispatch(new ClearMarkerMezzoSelezionato());
        }
        this.store.dispatch(new GetInitCentroMappa());
    }

    findDatiMeteo(_id: string): Meteo {
        let meteoData: Meteo = null;
        const filterData = this.datiMeteo.filter(datiMeteo => datiMeteo.id === _id)[0];
        if (filterData && filterData.id !== undefined) {
            meteoData = filterData.datiMeteo;
        }
        return meteoData;
    }

    onCustomButtonClick($event: CustomButtonsMaps): void {
        switch ($event) {
            case CustomButtonsMaps.Centra:
                this.store.dispatch(new CentraMappaButton());
                break;
            case CustomButtonsMaps.ToggleAnimation:
                this.store.dispatch(new ToggleAnimationButton());
                break;
        }
    }

    onAddMezzoComposizione(idMezzo: string): void {
        this.store.dispatch(new SelectMezzoComposizioneFromMappa(idMezzo));
    }

}
