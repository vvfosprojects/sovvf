import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
/**
 * Model
 */
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { ChiamataMarker } from '../../maps-model/chiamata-marker.model';
import { CentroMappa } from '../../maps-model/centro-mappa.model';
import { MeteoMarker } from '../../maps-model/meteo-marker.model';
import { Localita } from '../../../../../shared/model/localita.model';
import { RichiestaMarker } from '../../maps-model/richiesta-marker.model';
import { Meteo } from '../../../../../shared/model/meteo.model';
/**
 * Interface
 */
import { BoxClickArrayInterface } from '../../../boxes/box-interface/box-click-interface';
/**
 * Enum
 */
import { Markers } from '../../../../../shared/enum/markers.enum';
import { MouseE } from '../../../../../shared/enum/mouse-e.enum';
import { MapsEvent } from '../../../../../shared/enum/maps-event.enum';
/**
 * Service
 */
import { MeteoService } from '../../../../../shared/meteo/meteo-service.service';
import { AgmService } from '../../agm/agm-service.service';
import { UnitaAttualeService } from '../../../../navbar/navbar-service/unita-attuale/unita-attuale.service';
import { RichiesteMarkerManagerService } from '../../../../../core/manager/maps-manager';
import { MapsFiltroService } from '../../maps-ui/filtro/maps-filtro.service';
/**
 * Ngxs
 */
import { Select, Store } from '@ngxs/store';
import { MarkerMeteoState } from '../../../filterbar/store/states/marker-meteo-switch.state';
import { SetRichiestaFissata, ClearRichiestaFissata } from '../../../richieste/store/actions/richiesta-fissata.actions';
import { SetRichiestaHover, ClearRichiestaHover } from '../../../richieste/store/actions/richiesta-hover.actions';
import { ClearRichiestaSelezionata } from '../../../richieste/store/actions/richiesta-selezionata.actions';
import { AddMeteoMarker, RemoveMeteoMarker } from '../../store';
import { MarkedMarkerState } from '../../store/states/marked-marker.state';
import { SetMarkedMarker, ClearMarkedMarker } from '../../store/actions/marked-marker.actions';

import { IconMappe } from './_icone';
import { TipoMappe } from './_typeof';
import { TipoColori } from './_color';
import { wipeStatoRichiesta } from '../../../../../shared/helper/function';

@Injectable()
export class MarkerService implements OnDestroy {

    private subjectMeteo = new Subject<Meteo>();
    private markedColor = new Subject<string>();
    icone = new IconMappe();
    tipo = new TipoMappe();
    colori = new TipoColori();
    coloreStato: string;
    minMarkerCluster: number;
    livelloOpacita: number;

    iconeCached: string[];

    @Select(MarkedMarkerState.markedMarker) markerSelezionato$: Observable<any>;
    markerSelezionato: any;

    markerColorato: any;
    markerZIndex: any;

    subscription = new Subscription();

    filtro: Array<any>;

    checkMarker: any;

    @Select(MarkerMeteoState.active) stateSwitch$: Observable<boolean>;
    switchMeteo: boolean;

    constructor(private meteoService: MeteoService,
        private agmService: AgmService,
        private markerRichiesteManager: RichiesteMarkerManagerService,
        private unitaAttualeS: UnitaAttualeService,
        private mapsFiltroService: MapsFiltroService,
        private store: Store) {

        this.subscription.add(this.markerSelezionato$.subscribe(marker => {
            this.markerSelezionato = marker;
        }));

        this.filtro = this.mapsFiltroService.filtroAttivo;
        this.subscription.add(
            this.mapsFiltroService.getMenu().subscribe(menu => {
                this.filtro = [];
                menu.forEach(r => {
                    if (r.isActive) {
                        this.filtro.push(r.id);
                    }
                });
                this.mapsFiltroService.filtroAttivo = this.filtro;
            })
        );
        this.subscription.add(
            this.stateSwitch$.subscribe((state: boolean) => {
                this.switchMeteo = state;
            })
        );
        this.subscription.add(
            this.mapsFiltroService.getFiltroBoxes().subscribe((filtroBoxes: BoxClickArrayInterface) => {
                this.filtroBoxes(filtroBoxes);
            })
        );
        /**
         * marker minimi per creare un cluster
         * @type {number}
         */
        this.minMarkerCluster = 99999;
        /**
         * imposto il livello di opacità generico,
         * si potrebbe implementare anche un metodo che imposta un opacità singolarmente
         */
        this.livelloOpacita = 0.3;
        /**
         * creo un array con i path di tutte le icone da mettere in cache
         */
        this.iconeCached = this.icone.urlIcone();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    tipoIcona(marker: any, tipoSede: boolean): string {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare
         */
        // console.log(marker);
        if (!tipoSede) {
            return this.icone.tipoIcona(marker, this.modelloMarker(marker), this.iconaSelezionata(marker));
        } else {
            return this.icone.tipoIcona(marker, 'tipo-sede', this.iconaSelezionata(marker));
        }
    }

    /**
     * ritorna l'url del path dell'icona "speciale" da utilizzare
     * @param tipo
     */
    iconaSpeciale(tipo: string): string {
        return this.icone.iconaSpeciale(tipo);
    }

    modelloMarker(marker: any): string {
        /**
         * metodo che mi ritorna il modello del marker come stringa
         */
        return this.tipo.markerType(marker);
    }

    trueMarker(marker?: any, cross?: boolean): boolean {
        /**
         * metodo che mi ritorna true, se il marker selezionato è lo stesso che è stato cliccato
         */
        this.coloraMarker(marker);
        if (cross) {
            return true;
        } else {
            return this.markerSelezionato === marker;
        }
    }

    iconaSelezionata(marker: any): boolean {
        if (this.markerSelezionato === marker) {
            return true;
        } else if (this.markerColorato === marker) {
            return true;
        }
    }

    zIndex(marker: any): number {
        if (this.markerZIndex === marker) {
            return 99999;
        }
    }

    coloraMarker(marker: any) {
        const _wipeStatoRichiesta = wipeStatoRichiesta(marker.stato);
        if (!!marker.id_richiesta && marker.mezzo.stato) {
            this.coloreStato = this.colori.markerColor(marker.mezzo.stato);
        } else if (_wipeStatoRichiesta) {
            this.coloreStato = this.colori.markerColor(_wipeStatoRichiesta);
        } else {
            this.coloreStato = '#343a40';
        }
        this.markedColor.next(this.coloreStato);
    }

    cliccato(marker: any): void {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.selezionato(marker);

        /**
         *  mi arrivano i dati del meteo
         */
        this.getDatiMeteo(marker);
        /**
         * richiamo i metodi per modficare il centro e lo zoom del marker cliccato
         */
        this.agmService.centraMappa(this.getCoordinate(marker));
        this.agmService.cambiaZoom(18);
    }

    selezionato(marker: any): void {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.store.dispatch(new SetMarkedMarker(marker));
    }

    deseleziona(): void {
        /**
         * deseleziono il marker
         */
        this.store.dispatch(new ClearMarkedMarker());
    }

    action(marker: any, mouse: any) {
        /**
         * controllo il tipo di marker e il suo mouse event
         */
        const modello = this.modelloMarker(marker);
        switch (modello + '|' + mouse) {
            case 'richiesta|hover-in': {
                this.markerColorato = marker;
                this.markerZIndex = marker;

                // Store implementation
                this.store.dispatch(new SetRichiestaHover(marker.id));
            }
                break;
            case 'richiesta|hover-out': {
                this.markerColorato = null;
                this.markerZIndex = null;

                // Store implementation
                this.store.dispatch(new ClearRichiestaHover());
            }
                break;
            case 'richiesta|click': {
                if (this.checkMarker !== marker.id) {
                    this.cliccato(marker);
                    this.checkMarker = marker.id;

                    // Store implementation
                    this.store.dispatch(new SetRichiestaFissata(marker.id));
                }
            }
                break;
            case 'mezzo|hover-in': {
                this.markerZIndex = marker;
                this.markerColorato = marker;
            }
                break;
            case 'mezzo|hover-out': {
                this.markerZIndex = null;
                this.markerColorato = null;
            }
                break;
            case 'mezzo|click': {
                this.cliccato(marker);
                if (!!marker.id_richiesta) {
                    /**
                     * lanciare azione solo quando il mezzo è in soccorso
                     */
                }
            }
                break;
            case 'sede|click': {
                this.cliccato(marker);
            }
                break;
            case 'sede|hover-in': {
                this.markerZIndex = marker;
                this.markerColorato = marker;
            }
                break;
            case 'sede|hover-out': {
                this.markerZIndex = null;
                this.markerColorato = null;
            }
                break;
            default: {
                this.noAction();
                this.checkMarker = null;
                this.markerZIndex = null;
                this.markerColorato = null;
                this.markedColor.next(null);

                // Store implementation
                this.store.dispatch(new ClearRichiestaFissata());
                this.store.dispatch(new ClearRichiestaSelezionata());
            }
                break;
        }
    }

    getMarkedColor(): Observable<any> {
        return this.markedColor.asObservable();
    }


    visibile(marker: any, selected?: any): boolean {
        /**
         * metodo che nasconde o mostra i marker sulla mappa
         */
        if (selected) {
            return (this.modelloMarker(marker).includes(selected));
        }
        if (this.filtro && this.filtro.length > 0) {
            return this.filtro.includes(this.modelloMarker(marker));
        }
        return true;
    }

    opaco(marker: any): number {
        return marker.opacita ? this.livelloOpacita : 1;
    }

    getDatiMeteo(marker: any): void {
        /**
         *  faccio una chiamata all'api del servizio meteo e aspetto i dati del marker selezionato
         */
        this.meteoService.getMeteoData(this.getCoordinate(marker))
            .subscribe({
                next: data => this.subjectMeteo.next(data),
                error: data => console.log(`Errore: ${data}`)
            });
    }

    getMeteo(): Observable<Meteo> {
        return this.subjectMeteo.asObservable();
    }

    cambioSede(sede: any) {
        /**
         * evento che cambia la sede
         */
        const sedeAttuale = [];
        sedeAttuale.push(sede);
        this.unitaAttualeS.sendUnitaOperativaAttuale(sedeAttuale);
    }

    noAction() {
        if (this.markerSelezionato) {
            this.agmService.cambiaZoom(12);
            this.deseleziona();
        }
    }

    actionById(id: any, mouse: any, unclick?: any) {
        let marker: any;
        marker = this.getMarkerFromId(id);
        switch (mouse) {
            case MouseE.HoverIn: {
                this.markerColorato = marker;
                this.markerZIndex = marker;
            }
                break;
            case MouseE.HoverOut: {
                this.markerColorato = null;
                this.markerZIndex = null;
            }
                break;
            case MouseE.Click: {
                if (this.checkMarker !== marker && !unclick) {
                    this.cliccato(marker);
                    this.checkMarker = marker.id;
                } else {
                    this.noAction();
                }
            }
                break;
        }
    }

    getCoordinate(marker: any): Coordinate {
        /**
         * fa il mapping dell'oggetto coordinate a seconda del modello di marker
         */
        const modello = this.modelloMarker(marker);
        let coordinate: Coordinate = null;
        switch (modello) {
            case 'richiesta': {
                coordinate = marker.localita.coordinate;
            }
                break;
            default: {
                coordinate = marker.coordinate;
            }
                break;
        }
        return coordinate;
    }

    /**
     * metodo che ritorna un oggetto di tipo RichiestaMarker ricevendo un id
     * @param id
     */
    getMarkerFromId(id: string): RichiestaMarker {
        return this.markerRichiesteManager.getMarkerFromId(id);
    }

    /**
     * metodo che chiama il manager e cambia la proprietà opacità al marker
     * @param action
     * @param tipo
     * @param filterState
     * @param stringSearch
     */
    opacizzaMarkers(action: boolean, tipo: string, filterState?: string[], stringSearch?: string[]): void {
        const className = 'marker' + capitalize(tipo) + 'Manager';
        if (this[className]) {
            if (action) {
                this[className].cambiaOpacitaMarker(true, filterState, stringSearch);
            } else {
                this[className].cambiaOpacitaMarker(false);
            }
        } else {
            // console.log('manager non esistente');
        }

        function capitalize(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

    }

    /**
     * opacizza i marker dal filtro attivato su Boxes
     * @param obj
     */
    filtroBoxes(obj: BoxClickArrayInterface) {
        if (obj.richieste.length > 0) {
            this.opacizzaMarkers(true, Markers.Richieste, obj.richieste, undefined);
        } else {
            this.opacizzaMarkers(false, Markers.Richieste);
        }
        if (obj.mezzi.length > 0) {
            this.opacizzaMarkers(true, Markers.Mezzi, obj.mezzi, undefined);
        } else {
            this.opacizzaMarkers(false, Markers.Mezzi);
        }
    }

    /**
     * centra la mappa sul marker della chiamata
     * @param marker
     * @param action
     * @param centroMappa
     */
    chiamata(marker: ChiamataMarker, action: string, centroMappa?: CentroMappa) {
        switch (action) {
            case MapsEvent.Centra: {
                this.agmService.centraMappa(this.getCoordinate(marker));
                this.agmService.cambiaZoom(18);
                this.markerZIndex = marker;
                this.getDatiMeteo(marker);
            }
                break;
            default: {
                this.agmService.centraMappa(centroMappa.coordinate);
                this.agmService.cambiaZoom(12);
                this.markerZIndex = null;
            }
                break;
        }
    }

    /**
     * centra la mappa sul marker della partenza
     * @param id
     * @param action
     * @param centroMappa
     */
    partenza(id: string, action: string, centroMappa?: CentroMappa) {
        const marker = this.getMarkerFromId(id);
        switch (action) {
            case MapsEvent.Centra: {
                this.agmService.centraMappa(this.getCoordinate(marker));
                this.markerZIndex = marker;
            }
                break;
            default: {
                this.agmService.centraMappa(centroMappa.coordinate);
                this.markerZIndex = null;
            }
                break;
        }
    }

    /**
     * crea a runtime un marker, se l'utente clicca in un punto della mappa
     * @param event
     */
    createMeteoMarker(event: any) {
        if (this.switchMeteo) {
            const x = event.coords.lat;
            const y = event.coords.lng;
            const id = `(lat: ${coord2String(x)} - lng: ${coord2String(y)})`;
            const mMarker: MeteoMarker = new MeteoMarker(id, new Localita(new Coordinate(x, y)));
            const arrayM: MeteoMarker[] = [];
            arrayM.push(mMarker);
            this.getDatiMeteo(mMarker);

            // Store implementation
            this.store.dispatch(new RemoveMeteoMarker());
            this.store.dispatch(new AddMeteoMarker(arrayM));
        }

        function coord2String(number: number) {
            const string = number.toString();
            const countString = string.length;
            return string.slice(0, ((countString - 5) * -1));
        }
    }
}
