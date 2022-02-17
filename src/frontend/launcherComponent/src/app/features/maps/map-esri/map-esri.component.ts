import { Component, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuovaChiamataComponent } from '../modal-nuova-chiamata/modal-nuova-chiamata.component';
import { Utente } from '../../../shared/model/utente.model';
import { Store } from '@ngxs/store';
import { AuthState } from '../../auth/store/auth.state';
import { SetChiamataFromMappaActiveValue } from '../store/actions/tasto-chiamata-mappa.actions';
import { makeCentroMappa, makeCoordinate } from 'src/app/shared/helper/mappa/function-mappa';
import { MapService } from '../map-service/map-service.service';
import { AreaMappa } from '../maps-model/area-mappa-model';
import { DirectionInterface } from '../maps-interface/direction.interface';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { VoceFiltro } from '../../home/filterbar/filtri-richieste/voce-filtro.model';
import { TravelModeService } from '../map-service/travel-mode.service';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { ZonaEmergenzaModalComponent } from '../../zone-emergenza/zona-emergenza-modal/zona-emergenza-modal.component';
import { SetZonaEmergenzaFromMappaActiveValue } from '../../zone-emergenza/store/actions/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.actions';
import { ZoneEmergenzaState } from '../../zone-emergenza/store/states/zone-emergenza/zone-emergenza.state';
import { AddZonaEmergenza, ResetZonaEmergenzaForm } from '../../zone-emergenza/store/actions/zone-emergenza/zone-emergenza.actions';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { RichiesteState } from '../../home/store/states/richieste/richieste.state';
import { GetInitCentroMappa, SetCentroMappa, SetZoomCentroMappa, SetZoomCentroMappaByKilometers } from '../store/actions/centro-mappa.actions';
import { Partenza } from '../../../shared/model/partenza.model';
import { MezziInServizioState } from '../../home/store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { MezzoInServizio } from '../../../shared/interface/mezzo-in-servizio.interface';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { ViewComponentState } from '../../home/store/states/view/view.state';
import { SchedeContattoState } from '../../home/store/states/schede-contatto/schede-contatto.state';
import { SchedaContatto } from '../../../shared/interface/scheda-contatto.interface';
import { ComposizionePartenzaState } from '../../home/store/states/composizione-partenza/composizione-partenza.state';
import { RichiestaGestioneState } from '../../home/store/states/richieste/richiesta-gestione.state';
import { CentroMappaState } from '../store/states/centro-mappa.state';
import { SetDirectionTravelData } from '../store/actions/maps-direction.actions';
import { ESRI_LAYERS_CONFIG } from '../../../core/settings/esri-layers-config';
import { DirectionTravelDataInterface } from '../maps-interface/direction-travel-data.interface';
import { SetVisualizzaPercosiRichiesta } from '../../home/store/actions/composizione-partenza/composizione-partenza.actions';
import { environment } from '../../../../environments/environment';
import { SetChiamataFromMappaStatus } from '../../home/store/actions/view/view.actions';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import Search from '@arcgis/core/widgets/Search';
import WebMap from '@arcgis/core/WebMap';
import PortalItem from '@arcgis/core/portal/PortalItem';
import EsriConfig from '@arcgis/core/config';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Layer from '@arcgis/core/layers/Layer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Locator from '@arcgis/core/tasks/Locator';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteTask from '@arcgis/core/tasks/RouteTask';
import RouteResult from '@arcgis/core/tasks/support/RouteResult';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import supportFeatureSet from '@arcgis/core/rest/support/FeatureSet';
import esriId from '@arcgis/core/identity/IdentityManager';
import IdentityManagerRegisterTokenProperties = __esri.IdentityManagerRegisterTokenProperties;
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';

@Component({
    selector: 'app-map-esri',
    templateUrl: './map-esri.component.html',
    styleUrls: ['./map-esri.component.scss']
})
export class MapEsriComponent implements OnInit, OnChanges, OnDestroy {

    @Input() activeRoute: string;
    @Input() pCenter: CentroMappa;
    @Input() idRichiestaSelezionata: string;
    @Input() richiestaModifica: SintesiRichiesta;
    @Input() richiestaGestione: SintesiRichiesta;
    @Input() richiestaComposizione: SintesiRichiesta;
    @Input() chiamateMarkers: ChiamataMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() direction: DirectionInterface;
    @Input() tastoChiamataMappaActive: boolean;
    @Input() tastoZonaEmergenzaMappaActive: boolean;
    @Input() filtriRichiesteSelezionati: VoceFiltro[];
    @Input() schedeContattoStatus: boolean;
    @Input() composizionePartenzaStatus: boolean;
    @Input() mezziInServizioStatus: boolean;
    @Input() idMezzoInServizioSelezionato: string;
    @Input() idSchedaContattoSelezionata: string;
    @Input() areaMappaLoading: boolean;
    @Input() richiesteStatus: boolean;
    @Input() travelDataNuovaPartenza: DirectionTravelDataInterface;
    @Input() visualizzaPercorsiRichiesta: boolean;

    @Output() mapIsLoaded: EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }> = new EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }>();
    @Output() boundingBoxChanged: EventEmitter<{ spatialReference?: SpatialReference }> = new EventEmitter<{ spatialReference?: SpatialReference }>();

    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
    @ViewChild('contextMenu', { static: false }) private contextMenu: ElementRef;

    map: Map;
    view: any = null;
    eventClick: any;
    eventMouseMove: any;
    eventMouseMoveStart: any;
    contextMenuVisible = false;

    chiamateInCorsoFeatureLayer: FeatureLayer;
    chiamateMarkersGraphics = [];
    sediOperativeFeatureLayer: FeatureLayer;
    sediOperativeMarkersGraphics = [];

    operatore: Utente;
    RoutesPath = RoutesPath;

    constructor(private http: HttpClient,
                private mapService: MapService,
                private modalService: NgbModal,
                private store: Store,
                private configModal: NgbModalConfig,
                private renderer: Renderer2,
                private travelModeService: TravelModeService) {
        this.configModal.backdrop = 'static';
        this.configModal.keyboard = false;
        this.mapService.getRefresh().subscribe(() => {
            // TODO: implementare logica refresh layer Interventi
        });
    }

    ngOnInit(): void {
        this.operatore = this.store.selectSnapshot(AuthState.currentUser);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Centro e Zoom mappa
        if (changes?.pCenter?.currentValue && !this.map) {
            // Inizializzazione della mappa
            this.initializeMap().then(() => {
                // Controllo l'extent per richiedere i marker da visualizzare ogni volta che quest'ultimo cambia
                this.view.watch('extent', (event: any) => {
                    const geoExt = webMercatorUtils.webMercatorToGeographic(this.view.extent);
                    const bounds = {
                        northEastLat: geoExt.extent.ymax,
                        northEastLng: geoExt.extent.xmax,
                        southWestLat: geoExt.extent.ymin,
                        southWestLng: geoExt.extent.xmin
                    };
                    this.areaCambiata(bounds, event.zoom);
                });

                // Lista layer (client) da aggiungere alla mappa
                const layersToInitialize = [
                    this.initializeChiamateInCorsoLayer(),
                    this.initializeSediOperativeLayer()
                ];
                Promise.all(layersToInitialize).then(() => {
                    // Feature Layers da nascondere
                    const layersToHide = [
                        'Sedi Operative'
                    ];
                    for (const layerToHide of layersToHide) {
                        this.toggleLayer(layerToHide, false).then();
                    }

                    // Se ci sono aggiungo i markers chiamata
                    if (this.chiamateMarkers?.length) {
                        this.addChiamateMarkersToLayer(this.chiamateMarkers, true).then();
                    }

                    // Gestisco l'evento "click"
                    this.view.on('click', (event) => {
                        this.eventClick = event;
                        if ((this.tastoChiamataMappaActive || this.tastoZonaEmergenzaMappaActive) && event.button === 0) {
                            const screenPoint = this.eventClick.screenPoint;
                            // Controllo se dove ho fatto click sono presenti dei graphics facendo un "HitTest"
                            this.view.hitTest(screenPoint)
                                .then((resHitTest) => {
                                    const graphic = resHitTest.results[0]?.graphic;
                                    if (!graphic) {
                                        if (this.tastoChiamataMappaActive) {
                                            this.startNuovaChiamata();
                                        } else if (this.tastoZonaEmergenzaMappaActive) {
                                            this.createNuovaEmergenza();
                                        }
                                    }
                                });
                        } else if ((!this.tastoChiamataMappaActive || !this.tastoZonaEmergenzaMappaActive) && event.button === 2) {
                            if (this.contextMenuVisible) {
                                this.setContextMenuVisible(false);
                            } else {
                                this.setContextMenuVisible(true);
                            }
                        } else if (event.button !== 0) {
                            if (this.tastoChiamataMappaActive) {
                                this.store.dispatch(new SetChiamataFromMappaActiveValue(false));
                            } else if (this.tastoZonaEmergenzaMappaActive) {
                                this.store.dispatch(new SetZonaEmergenzaFromMappaActiveValue(false));
                            }
                        } else if (event.button !== 2) {
                            this.setContextMenuVisible(false);
                        }
                    });
                    // Gestisco l'evento "pointer-move"
                    this.view.on('pointer-move', (event) => {
                        this.eventMouseMove = event;
                    });
                    // Gestisco l'evento "drag"
                    this.view.on('drag', (event: any) => {
                        // TODO: implementare in un secondo momento
                        // if (!this.drawing) {
                        this.setContextMenuVisible(false);
                        // }
                        const geoExt = webMercatorUtils.webMercatorToGeographic(this.view.extent);
                        const bounds = {
                            northEastLat: geoExt.extent.ymax,
                            northEastLng: geoExt.extent.xmax,
                            southWestLat: geoExt.extent.ymin,
                            southWestLng: geoExt.extent.xmin
                        };
                        this.areaCambiata(bounds, event.zoom);
                        // TODO: verificare se serve
                        // this.centroCambiato({ coordinateCentro: { latitudine: event.x, longitudine: event.y }, zoom: event.zoom});
                    });
                    // Gestisco l'evento "mouse-wheel"
                    this.view.on('mouse-wheel', () => {
                        // TODO: implementare in un secondo momento
                        // if (!this.drawing) {
                        this.setContextMenuVisible(false);
                        // }
                    });

                    // Inizializzazione dei widget sulla mappa
                    this.initializeWidget().then(() => {
                        const geoExt = webMercatorUtils.webMercatorToGeographic(this.view.extent);
                        const areaMappa = {
                            topRight: {
                                latitudine: geoExt.extent.ymax,
                                longitudine: geoExt.extent.xmax
                            },
                            bottomLeft: {
                                latitudine: geoExt.extent.ymin,
                                longitudine: geoExt.extent.xmin
                            }
                        } as AreaMappa;
                        // @ts-ignore
                        this.mapIsLoaded.emit({ areaMappa, spatialReference: this.map.spatialReference });
                    });
                });
            });
        } else if (changes?.pCenter?.currentValue && this.map && this.view?.ready) {
            const newPCenter = changes.pCenter.currentValue;
            const center = [newPCenter.coordinateCentro.longitudine, newPCenter.coordinateCentro.latitudine];
            this.changeCenter(center).then(() => {
                const zoom = newPCenter.zoom;
                this.changeZoom(zoom).then(() => {
                });
            });
        }

        // Aggiungo i Chiamate Markers con "ApplyEdits"
        if (changes?.chiamateMarkers?.currentValue && this.chiamateInCorsoFeatureLayer) {
            const markersChiamate = changes?.chiamateMarkers?.currentValue;
            this.addChiamateMarkersToLayer(markersChiamate, true).then();
            markersChiamate?.forEach((mC: ChiamataMarker) => {
                if (mC.mySelf) {
                    this.searchForARIRAndIdranti(mC.localita.coordinate);
                }
            });

            if (!markersChiamate.filter((mC: ChiamataMarker) => mC.mySelf)?.length) {
                this.clearSearchForARIRAndIdranti();
            }
        }

        // Aggiungo i Sedi Markers con "ApplyEdits"
        if (changes?.sediMarkers?.currentValue && this.sediOperativeFeatureLayer) {
            const markersSedi = changes?.sediMarkers?.currentValue;
            this.addSediMarkersToLayer(markersSedi, true).then();
        }

        // Controllo il valore di "tastoChiamataMappaActive"
        if (changes?.tastoChiamataMappaActive?.currentValue && this.chiamateInCorsoFeatureLayer) {
            this.setContextMenuVisible(false);
        }

        // Controllo il valore di "direction"
        if (changes?.direction?.currentValue) {
            const direction = changes?.direction?.currentValue;
            if (direction?.isVisible) {
                this.getRoute('nuovaPartenza', direction, { clearPrevious: true, color: [255, 0, 0] });
            } else if (!direction?.isVisible) {
                const zoom = 19;
                const centroMappa = this.store.selectSnapshot(CentroMappaState.centroMappa);
                this.store.dispatch(new SetCentroMappa({ coordinateCentro: centroMappa.coordinateCentro, zoom }));
                this.clearDirection('nuovaPartenza');
            }
        }

        // Controllo il valore di "idRichiestaSelezionata"
        if (changes?.idRichiestaSelezionata?.currentValue && this.map && this.view?.ready) {
            let richiestaSelezionata: SintesiRichiesta;
            let coordinateCentro: Coordinate;
            const idRichiestaSelezionata = changes?.idRichiestaSelezionata?.currentValue;

            if (this.richiesteStatus) {
                const richieste = this.store.selectSnapshot(RichiesteState.richieste);
                richiestaSelezionata = richieste.filter((r: SintesiRichiesta) => r.id === idRichiestaSelezionata)[0];
            } else if (this.composizionePartenzaStatus) {
                richiestaSelezionata = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
            }

            if (richiestaSelezionata) {
                coordinateCentro = richiestaSelezionata.localita.coordinate;
                const zoom = 19;
                this.store.dispatch(new SetCentroMappa({ coordinateCentro, zoom }));
                richiestaSelezionata.partenze.forEach((p: Partenza, index: number) => {
                    if (index === 0) {
                        this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, true).then();
                    }
                    if (!p.partenza.partenzaAnnullata && !p.partenza.sganciata && !p.partenza.terminata) {
                        let origin: { lat: number, lng: number };
                        let destination: { lat: number, lng: number };
                        if (p.partenza.coordinate) {
                            origin = { lat: +p.partenza.coordinate.latitudine, lng: +p.partenza.coordinate.longitudine };
                        }
                        if (richiestaSelezionata.localita.coordinate) {
                            destination = { lat: richiestaSelezionata.localita.coordinate.latitudine, lng: richiestaSelezionata.localita.coordinate.longitudine };
                        }
                        if (origin && destination) {
                            const genereMezzo = p.partenza.mezzo.genere;
                            const direction = { origin, destination, genereMezzo, isVisible: true } as DirectionInterface;
                            this.getRoute('partenzeRichiestaSelezionata', direction);
                        }
                    }
                });
                this.searchForARIRAndIdranti(coordinateCentro);
            }
        } else if (changes?.idRichiestaSelezionata?.currentValue === null && this.map && this.view?.ready) {
            this.store.dispatch(new GetInitCentroMappa());
            this.clearDirection('partenzeRichiestaSelezionata');
            this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, false).then();
            if (!changes?.richiestaComposizione?.currentValue) {
                this.clearSearchForARIRAndIdranti();
            }
        }

        // Controllo il valore di "richiestaModifica"
        if (changes?.richiestaModifica?.currentValue && this.map && this.view?.ready) {
            const richiestaModifica = changes?.richiestaModifica?.currentValue;
            const coordinateCentro = richiestaModifica.localita.coordinate;
            const zoom = 19;
            this.store.dispatch(new SetCentroMappa({ coordinateCentro, zoom }));
        } else if (changes?.richiestaModifica?.currentValue === null && this.map && this.view?.ready) {
            this.store.dispatch(new GetInitCentroMappa());
        }

        // Controllo il valore di "richiestaComposizione"
        if (changes?.richiestaComposizione?.currentValue && this.map && this.view?.ready) {
            const richiestaComposizione = changes?.richiestaComposizione?.currentValue;
            const coordinateCentro = richiestaComposizione.localita.coordinate;
            const zoom = 19;
            this.store.dispatch([
                new SetCentroMappa({ coordinateCentro, zoom }),
                new SetVisualizzaPercosiRichiesta(true)
            ]);
            this.searchForARIRAndIdranti(coordinateCentro);
        } else if (changes?.richiestaComposizione?.currentValue === null && this.map && this.view?.ready) {
            this.store.dispatch(new GetInitCentroMappa());
            if (!changes?.idRichiestaSelezionata?.currentValue) {
                this.clearSearchForARIRAndIdranti();
            }
        }

        // Controllo il valore di "visualizzaPercorsiRichiesta"
        if (changes?.visualizzaPercorsiRichiesta?.currentValue && this.map && this.view?.ready) {
            if (this.richiestaComposizione) {
                this.richiestaComposizione.partenze.forEach((p: Partenza, index: number) => {
                    if (index === 0) {
                        this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, true).then();
                    }
                    if (!p.partenza.partenzaAnnullata && !p.partenza.sganciata && !p.partenza.terminata) {
                        const origin = { lat: +p.partenza.coordinate.latitudine, lng: +p.partenza.coordinate.longitudine };
                        const destination = { lat: this.richiestaComposizione.localita.coordinate.latitudine, lng: this.richiestaComposizione.localita.coordinate.longitudine };
                        const genereMezzo = p.partenza.mezzo.genere;
                        const direction = { origin, destination, genereMezzo, isVisible: true } as DirectionInterface;
                        this.getRoute('partenzeRichiestaComposizione', direction);
                    }
                });
            }
        } else if (changes?.visualizzaPercorsiRichiesta?.currentValue === false && this.map && this.view?.ready) {
            if (this.direction?.isVisible) {
                const totalKilometers = this.travelDataNuovaPartenza?.totalKilometers;
                this.store.dispatch(new SetZoomCentroMappaByKilometers(totalKilometers));
            } else if (!this.direction?.isVisible) {
                const zoom = 19;
                this.store.dispatch(new SetZoomCentroMappa(zoom));
            }
            this.clearDirection('partenzeRichiestaComposizione');
        }

        // Controllo il valore di "filtriRichiesteSelezionati"
        if (changes?.filtriRichiesteSelezionati?.currentValue) {
            const filtriRichiesteSelezionati = changes.filtriRichiesteSelezionati.currentValue as VoceFiltro[];
            if (filtriRichiesteSelezionati?.length) {
                filtriRichiesteSelezionati.forEach((filtro: VoceFiltro) => {
                    const codFiltro = filtro.codice.toLocaleLowerCase().replace(/\s+/g, '');
                    switch (codFiltro) {
                        case 'interventichiusi':
                            this.toggleLayer(ESRI_LAYERS_CONFIG.layers.interventi.chiusi, true).then();
                            break;
                        default:
                            this.toggleLayer(ESRI_LAYERS_CONFIG.layers.interventi.chiusi, false).then();
                            break;
                    }
                });
            } else {
                this.toggleLayer(ESRI_LAYERS_CONFIG.layers.interventi.chiusi, false).then();
            }
        }

        // Controllo se la feature "Chiamate/Interventi" viene attivata
        if (changes?.richiesteStatus?.currentValue) {
            const richiesteActive = changes?.richiesteStatus?.currentValue;
            switch (richiesteActive) {
                case true:
                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, false).then();
                    break;
            }
            this.store.dispatch(new GetInitCentroMappa());
        }

        // Controllo se la feature "Schede Contatto" viene attivata
        if (changes?.schedeContattoStatus?.currentValue !== null) {
            const schedeContattoActive = changes?.schedeContattoStatus?.currentValue;
            switch (schedeContattoActive) {
                case true:
                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.schedeContatto.nonGestite, true).then();
                    break;
                case false:
                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.schedeContatto.nonGestite, false).then(() => {
                        this.toggleLayer(ESRI_LAYERS_CONFIG.layers.schedeContatto.gestite, false).then();
                    });
                    break;
            }
        }

        // Controllo il valore di "idSchedaContattoSelezionata"
        if (changes?.idSchedaContattoSelezionata?.currentValue && this.map && this.view?.ready) {
            const schedeContatto = this.store.selectSnapshot(SchedeContattoState.schedeContatto);
            const idSchedaContattoSelezionata = changes?.idSchedaContattoSelezionata?.currentValue;
            const schedaContattoSelezionata = schedeContatto.filter((s: SchedaContatto) => s.codiceScheda === idSchedaContattoSelezionata)[0];
            const coordinateCentro = new Coordinate(schedaContattoSelezionata.localita.coordinate.latitudine, schedaContattoSelezionata.localita.coordinate.longitudine);
            const zoom = 19;
            this.store.dispatch(new SetCentroMappa({ coordinateCentro, zoom }));
        } else if (changes?.idSchedaContattoSelezionata?.currentValue === null && this.map && this.view?.ready) {
            this.store.dispatch(new GetInitCentroMappa());
        }

        // Controllo se la feature "Composizione Partenza" viene attivata
        if (changes?.composizionePartenzaStatus?.currentValue !== null) {
            const composizionePartenzaActive = changes?.composizionePartenzaStatus?.currentValue;
            switch (composizionePartenzaActive) {
                case true:
                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, true).then();
                    break;
                case false:
                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, false).then();
                    break;
            }
        }

        // Controllo se la feature "Mezzi in Servizio" viene attivata
        if (changes?.mezziInServizioStatus?.currentValue !== null) {
            const mezziInServizioActive = changes?.mezziInServizioStatus?.currentValue;
            switch (mezziInServizioActive) {
                case true:
                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, true).then();
                    break;
                case false:
                    const backupView = this.store.selectSnapshot(ViewComponentState.colorButton)?.backupViewComponent?.view;
                    if (backupView && backupView.mezziInServizio && backupView.mezziInServizio.active) {
                        this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, true).then();
                    } else {
                        this.toggleLayer(ESRI_LAYERS_CONFIG.layers.mezzi, false).then();
                    }
                    break;
            }
        }

        // Controllo il valore di "idMezzoInServizioSelezionato"
        if (changes?.idMezzoInServizioSelezionato?.currentValue && this.map && this.view?.ready) {
            let lat: number;
            let lon: number;
            const idMezzoInServizioSelezionato = changes?.idMezzoInServizioSelezionato?.currentValue;

            if (this.mezziInServizioStatus) {
                const mezziInServizio = this.store.selectSnapshot(MezziInServizioState.mezziInServizio);
                const mezzoInServizioSelezionato = mezziInServizio.filter((m: MezzoInServizio) => m.mezzo.mezzo.codice === idMezzoInServizioSelezionato)[0];
                lat = +mezzoInServizioSelezionato.mezzo.mezzo.coordinateStrg[0];
                lon = +mezzoInServizioSelezionato.mezzo.mezzo.coordinateStrg[1];
            } else if (this.richiesteStatus) {
                const richiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione);
                const partenza = richiestaGestione.partenze.filter((p: Partenza) => p.partenza.mezzo.codice === idMezzoInServizioSelezionato)[0];
                lat = +partenza.partenza.mezzo.coordinateStrg[0];
                lon = +partenza.partenza.mezzo.coordinateStrg[1];
            }
            const coordinateCentro = new Coordinate(lat, lon);
            const zoom = 19;
            this.store.dispatch(new SetCentroMappa({ coordinateCentro, zoom }));
        } else if (changes?.idMezzoInServizioSelezionato?.currentValue === null && this.map && this.view?.ready) {
            this.store.dispatch(new GetInitCentroMappa());
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(new SetVisualizzaPercosiRichiesta(false));
        this.clearDirection();
        this.view?.destroy();
        this.map?.destroy();
    }

    // Inizializza la mappa
    async initializeMap(): Promise<any> {
        const container = this.mapViewEl.nativeElement;

        const serverUrl = 'https://gis.dipvvf.it/portal/sharing/rest';
        const username = this.store.selectSnapshot(AuthState.currentUserEsri);
        const password = this.store.selectSnapshot(AuthState.currentPswEsri);
        let token = null;

        const formDataGenerateToken = new FormData();
        formDataGenerateToken.set('username', username);
        formDataGenerateToken.set('password', password);
        formDataGenerateToken.set('expiration', '' + (60 * 24));
        formDataGenerateToken.set('f', 'json');
        formDataGenerateToken.set('client', 'referer');
        formDataGenerateToken.set('referer', location.protocol + '//' + location.host);

        await this.http.post(serverUrl + '/generateToken', formDataGenerateToken).subscribe((res: { expires: number, ssl: boolean, token: string }) => {
            token = res.token;

            if (token) {
                const props = { server: serverUrl, token } as IdentityManagerRegisterTokenProperties;

                esriId.registerToken(props);
            }
        });

        EsriConfig.portalUrl = 'https://gis.dipvvf.it/portal/sharing/rest/portals/self?f=json&culture=it';
        EsriConfig.apiKey = 'AAPK36ded91859154c2cad9002a686434a34Jt_FmrqMObHesjY_bYHlJu-HZZrTDGJzsQMKnxd8f4TmYY_Vi-f8-4y-7G6WbcVf';

        let portalItemId = '55fdd15730524dedbff72e285cba3795';
        if (environment.productionTest) {
            portalItemId = 'c11359cbc7144f628c88db7690234db6';
        } else if (environment.productionDemo) {
            portalItemId = '091fdcc608fb4a6eb3ba5022c36a4a58';
        }

        const portalItem = new PortalItem({
            id: portalItemId
        });

        this.map = new WebMap({
            portalItem
        });

        const center = [this.pCenter.coordinateCentro.longitudine, this.pCenter.coordinateCentro.latitudine];
        const zoom = this.pCenter.zoom;

        this.view = new MapView({
            container,
            map: this.map,
            center,
            zoom,
            highlightOptions: {
                color: '#CDD6DD',
            }
        });

        return this.view.when();
    }

    // Modifica il centro della mappa
    async changeCenter(center: number[]): Promise<any> {
        if (this.view?.ready) {
            this.view.center = center;
        }
    }

    // Modifica lo zoom della mappa
    async changeZoom(zoom: number): Promise<any> {
        if (this.view?.ready) {
            this.view.zoom = zoom;
        }
    }

    // Inizializza il layer "Chiamate in Corso"
    async initializeChiamateInCorsoLayer(): Promise<any> {
        // creazione marker Chiamata in Corso
        const markerChiamataInCorso = new PictureMarkerSymbol({
            url: '/assets/img/icone-markers/speciali/chiamata-marker-rosso.png',
            width: '50px',
            height: '50px'
        });

        // creazione renderer Chiamata in Corso
        const rendererChiamataInCorso = new SimpleRenderer({
            symbol: markerChiamataInCorso
        });

        // creazione feature layer
        this.chiamateInCorsoFeatureLayer = new FeatureLayer({
            title: 'Chiamate in Corso',
            source: [],
            objectIdField: 'ID',
            popupEnabled: false,
            labelsVisible: true,
            listMode: 'hide',
            renderer: rendererChiamataInCorso,
            spatialReference: {
                wkid: 3857
            },
            geometryType: 'point'
        });

        // aggiungo il feature layer alla mappa
        this.map.add(this.chiamateInCorsoFeatureLayer);
    }

    // Inizializza il layer "Sedi Operative"
    async initializeSediOperativeLayer(): Promise<any> {
        // creazione renderer SediOperative
        const rendererSediOperative = new UniqueValueRenderer({
            field: 'tipo',
            uniqueValueInfos: [
                {
                    value: 'Comando',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/sedi/ns/sede5.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Distaccamento',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/sedi/ns/sede5.png',
                        width: '50px',
                        height: '50px'
                    })
                }
            ],
        });

        // creazione feature layer
        this.sediOperativeFeatureLayer = new FeatureLayer({
            title: 'Sedi Operative',
            outFields: ['*'],
            source: [],
            objectIdField: 'ID',
            popupEnabled: true,
            labelsVisible: true,
            // featureReduction: clusterConfigSediOperative,
            renderer: rendererSediOperative,
            fields: [
                {
                    name: 'ID',
                    alias: 'id',
                    type: 'oid',
                },
                {
                    name: 'codice',
                    alias: 'codice',
                    type: 'string',
                },
                {
                    name: 'tipo',
                    alias: 'tipo',
                    type: 'string',
                },
                {
                    name: 'descrizione',
                    alias: 'descrizione',
                    type: 'string',
                }
            ],
            spatialReference: {
                wkid: 3857
            },
            popupTemplate: {
                title: 'ID: {id}',
                content:
                    '<ul><li>Tipo: {tipo} </li>' +
                    '<ul><li>Codice: {codice} </li>' +
                    '<ul><li>Descrizione: {descrizione} </li>'
            },
            geometryType: 'point'
        });

        // aggiungo il feature layer alla mappa
        this.map.add(this.sediOperativeFeatureLayer);
    }

    // Aggiunge i marker delle chiamate in corso al layer "Chiamate in Corso"
    async addChiamateMarkersToLayer(chiamateMarkers: ChiamataMarker[], applyEdits?: boolean): Promise<any> {
        if (this.chiamateMarkersGraphics?.length) {
            const query = { where: '1=1' };
            this.chiamateInCorsoFeatureLayer.queryFeatures(query).then((results: supportFeatureSet) => {
                const deleteFeatures = results.features;
                this.chiamateInCorsoFeatureLayer.applyEdits({ deleteFeatures });
                this.chiamateInCorsoFeatureLayer.refresh();
                addMarkers(this.chiamateInCorsoFeatureLayer).then((chiamateMarkersGraphics: any[]) => {
                    this.chiamateMarkersGraphics = chiamateMarkersGraphics;
                });
            });
        } else {
            addMarkers(this.chiamateInCorsoFeatureLayer).then((chiamateMarkersGraphics: any[]) => {
                this.chiamateMarkersGraphics = chiamateMarkersGraphics;
            });
        }

        async function addMarkers(chiamateInCorsoFeatureLayer: FeatureLayer): Promise<any[]> {
            const chiamateMarkersGraphicsToAdd = [];
            for (const markerDaStampare of chiamateMarkers) {
                const long = markerDaStampare.localita.coordinate.longitudine;
                const lat = markerDaStampare.localita.coordinate.latitudine;
                const p: number[] = [long, lat];
                const mp = new Point({
                    longitude: p[0],
                    latitude: p[1],
                    spatialReference: {
                        wkid: 3857
                    }
                });
                const graphic = new Graphic({
                    geometry: mp,
                    attributes: {
                        idChiamataMarker: markerDaStampare.id
                    }
                });
                chiamateMarkersGraphicsToAdd.push(graphic);
            }

            if (!applyEdits) {
                chiamateInCorsoFeatureLayer.source.addMany(chiamateMarkersGraphicsToAdd);
            } else if (applyEdits) {
                chiamateInCorsoFeatureLayer.applyEdits({ addFeatures: chiamateMarkersGraphicsToAdd }).then(() => {
                    chiamateInCorsoFeatureLayer.refresh();
                });
            }

            return chiamateMarkersGraphicsToAdd;
        }
    }

    // Aggiunge i marker delle sedi al layer "Sedi Operative"
    async addSediMarkersToLayer(sediMarkers: SedeMarker[], applyEdits?: boolean): Promise<any> {
        if (this.sediOperativeMarkersGraphics?.length) {
            const query = { where: '1=1' };
            this.sediOperativeFeatureLayer.queryFeatures(query).then((results) => {
                const deleteFeatures = results.features;
                deleteFeatureSediOperativeLayer(this.sediOperativeFeatureLayer, deleteFeatures).then(() => {
                    addMarkers(this.sediOperativeFeatureLayer).then((sediOperativeMarkersGraphics: any[]) => {
                        this.sediOperativeMarkersGraphics = sediOperativeMarkersGraphics;
                        this.sediOperativeFeatureLayer.refresh();
                    });
                });
            });
        } else {
            addMarkers(this.sediOperativeFeatureLayer).then((sediOperativeMarkersGraphics: any[]) => {
                this.sediOperativeMarkersGraphics = sediOperativeMarkersGraphics;
            });
        }

        async function deleteFeatureSediOperativeLayer(sediOperativeFeatureLayer: FeatureLayer, deleteFeatures: any): Promise<any> {
            await sediOperativeFeatureLayer.applyEdits({ deleteFeatures });
            sediOperativeFeatureLayer.refresh();
        }

        async function addMarkers(sediOperativeFeatureLayer: FeatureLayer): Promise<any[]> {
            const sediOperativeMarkersGraphicsToAdd = [];
            for (const markerDaStampare of sediMarkers) {
                const long = markerDaStampare.coordinate.longitudine;
                const lat = markerDaStampare.coordinate.latitudine;
                const p: any = [long, lat];
                const mp = new Point(p);
                const graphic = new Graphic({
                    geometry: mp,
                    attributes: {
                        ID: markerDaStampare.codice,
                        codice: markerDaStampare.codice,
                        tipo: markerDaStampare.tipo,
                        descrizione: markerDaStampare.descrizione
                    }
                });
                sediOperativeMarkersGraphicsToAdd.push(graphic);
            }

            if (!applyEdits) {
                sediOperativeFeatureLayer.source.addMany(sediOperativeMarkersGraphicsToAdd);
            } else if (applyEdits) {
                sediOperativeFeatureLayer.applyEdits({ addFeatures: sediOperativeMarkersGraphicsToAdd }).then(() => {
                    sediOperativeFeatureLayer.refresh();
                });
            }

            return sediOperativeMarkersGraphicsToAdd;
        }
    }

    // Aggiunge i widget sulla mappa
    async initializeWidget(): Promise<any> {
        console.log('view', this.view);

        const layerList = new LayerList({
            view: this.view
        });

        const llExpand = new Expand({
            id: 'layerList',
            view: this.view,
            content: layerList
        });

        const legend = new Legend({
            view: this.view
        });

        const leExpand = new Expand({
            id: 'legend',
            view: this.view,
            content: legend
        });

        const basemapGallery = new BasemapGallery({
            view: this.view
        });

        const bgExpand = new Expand({
            id: 'basemapList',
            view: this.view,
            content: basemapGallery
        });

        const search = new Search({
            id: 'search',
            view: this.view
        });

        // TODO: implementare in un secondo momento
        // const sketch = new Sketch({
        //     layer: this.drawGraphicLayer,
        //     view: this.view,
        //     // graphic will be selected as soon as it is created
        //     creationMode: 'single',
        //     availableCreateTools: ['polygon']
        // });

        // TODO: implementare in un secondo momento
        // Ascolta l'evento "create" del widget Sketch
        // sketch.on('create', (event) => {
        //     // check if the create event's state has changed to complete indicating
        //     // the graphic create operation is completed.
        //     switch (event.state) {
        //         case 'start':
        //             this.drawing = true;
        //             this.eventMouseMoveStart = this.eventMouseMove;
        //             break;
        //         case 'active':
        //             break;
        //         case 'complete':
        //             this.drawing = false;
        //             this.drawedPolygon = event.graphic;
        //             this.setDrawContextMenuVisible(true);
        //             break;
        //         default:
        //             console.log('nuovo evento trovato', event);
        //             break;
        //     }
        // });

        // TODO: implementare in un secondo momento
        // Ascolta l'evento "update" del widget Sketch
        // sketch.on('update', () => {
        //     this.drawing = false;
        //     this.drawedPolygon = null;
        //     this.drawGraphicLayer.removeAll();
        //     this.setDrawContextMenuVisible(false);
        // });

        // TODO: implementare in un secondo momento
        // Ascolta l'evento "delete" del widget Sketch
        // sketch.on('delete', () => {
        //     this.drawing = false;
        //     this.drawedPolygon = null;
        //     this.drawGraphicLayer.removeAll();
        //     this.setDrawContextMenuVisible(false);
        // });

        console.log('this.view.ui._components', this.view.ui._components);

        if (!this.view.ui._components?.filter((c) => c.id === 'layerList')?.length) {
            this.view.ui.add(llExpand, 'top-right');
        }
        if (!this.view.ui._components?.filter((c) => c.id === 'legend')?.length) {
            this.view.ui.add(leExpand, 'top-right');
        }
        if (!this.view.ui._components?.filter((c) => c.id === 'basemapList')?.length) {
            this.view.ui.add(bgExpand, 'top-right');
        }

        if (!this.view.ui._components?.filter((c) => c.id === 'search')?.length) {
            this.view.ui.add(search, {
                position: 'top-left',
                index: 0 // indico la posizione nella UI
            });
        }

        // TODO: implementare in un secondo momento
        // this.view.ui.add(sketch, 'bottom-right');
    }

    // Aggiunge il MapImageLayer dal portal tramite il portalId
    async addMapImageLayer(portalItemId: string): Promise<any> {
        const portalMapImageLayer = new PortalItem({
            id: portalItemId
        });
        const mapImageLayerHereItalia = new MapImageLayer({
            portalItem: portalMapImageLayer
        });
        this.map.add(mapImageLayerHereItalia);
    }

    // Aggiunge un FeatureLayer dal portal tramite il portalId
    async addFeatureLayer(portalItemId: string): Promise<any> {
        const portalFeatureLayer = new PortalItem({
            id: portalItemId
        });
        const featureLayer = new FeatureLayer({
            portalItem: portalFeatureLayer
        });
        this.map.add(featureLayer);
    }

    // Effettua il toggle di un layer
    async toggleLayer(layerTitle: string, valueToSet?: boolean): Promise<any> {
        if (this.map) {
            const layerExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
            if (layerExists) {
                if (valueToSet === null) {
                    this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = !this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible;
                } else {
                    this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = valueToSet;
                }
            }
        }
    }

    searchForARIRAndIdranti(coordinateCentro: { latitudine: number, longitudine: number }): void {
        const allLayers = this.view.map.allLayers._items;
        allLayers.forEach((layer: any) => {
            if (layer.title === ESRI_LAYERS_CONFIG.layers.arir) {
                const queryArir = layer.createQuery();
                queryArir.geometry = new Point({
                    latitude: coordinateCentro.latitudine,
                    longitude: coordinateCentro.longitudine
                });
                queryArir.distance = 5000;
                queryArir.units = 'meters';
                queryArir.spatialRelationship = 'intersects';
                queryArir.returnGeometry = true;
                queryArir.outFields = ['*'];

                layer.queryFeatures(queryArir)
                    .then((aziendeARIR: any) => {
                        if (aziendeARIR && aziendeARIR.features.length > 0) {
                            this.toggleLayer(ESRI_LAYERS_CONFIG.layers.arir, true).then(() => {
                                allLayers.forEach((l: any) => {
                                    if (l.title === ESRI_LAYERS_CONFIG.layers.approviggionamentiIdrici) {
                                        const queryApprovviggionamentiIdrici = l.createQuery();
                                        queryApprovviggionamentiIdrici.geometry = new Point({
                                            latitude: coordinateCentro.latitudine,
                                            longitude: coordinateCentro.longitudine
                                        });
                                        queryApprovviggionamentiIdrici.distance = 500;
                                        queryApprovviggionamentiIdrici.units = 'meters';
                                        queryApprovviggionamentiIdrici.spatialRelationship = 'intersects';
                                        queryApprovviggionamentiIdrici.returnGeometry = true;
                                        queryApprovviggionamentiIdrici.outFields = ['*'];
                                        l.queryFeatures(queryApprovviggionamentiIdrici)
                                            .then((approvvigionamentiIdriciResult: any) => {
                                                if (approvvigionamentiIdriciResult && approvvigionamentiIdriciResult.features.length > 0) {
                                                    this.toggleLayer(ESRI_LAYERS_CONFIG.layers.approviggionamentiIdrici, true).then(() => {
                                                        const layerApproviggionamentiIdrici = this.view.map.allLayers.toArray().filter((x: Layer) => x.title === ESRI_LAYERS_CONFIG.layers.approviggionamentiIdrici)[0];
                                                        const approviggionamentiIdriciResultObjectIds = approvvigionamentiIdriciResult.features.map((y: any) => y.attributes.objectid);
                                                        layerApproviggionamentiIdrici.definitionExpression = 'objectid in (' + approviggionamentiIdriciResultObjectIds + ')';
                                                    });
                                                }
                                            });
                                    }
                                });
                            });
                        }
                    });
            }
        });
    }

    clearSearchForARIRAndIdranti(): void {
        this.toggleLayer(ESRI_LAYERS_CONFIG.layers.arir, false).then(() => {
            this.toggleLayer(ESRI_LAYERS_CONFIG.layers.approviggionamentiIdrici, false).then(() => {
                const layerApproviggionamentiIdrici = this.view.map.allLayers.toArray().filter((x: Layer) => x.title === ESRI_LAYERS_CONFIG.layers.approviggionamentiIdrici)[0];
                layerApproviggionamentiIdrici.definitionExpression = '1 = 1';
            });
        });
    }

    startNuovaChiamata(): void {
        let lat: number;
        let lon: number;

        const mapPoint = this.eventClick.mapPoint;

        if (this.eventClick?.mapPoint) {
            lat = mapPoint.latitude;
            lon = mapPoint.longitude;
        }

        // Se il "contextMenu" è aperto lo chiudo
        if (this.contextMenuVisible) {
            this.setContextMenuVisible(false);
        }

        // Se il puntatore di "NuovaChiamtaMappa" è attivo posso aprire il "Form Chiamata"
        const check = document.getElementById('idCheck');
        // @ts-ignore
        if (check && !check.checked) {
            return;
        }

        // Imposto l'url al servizio che mi restituisce l'indirizzo tramite lat e lon
        const locatorTask = new Locator({
            url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        });
        this.view.popup.autoOpenEnabled = false;

        // Params per il servizio "locationToAddress"
        const location = mapPoint;
        const params = {
            location
        };

        // Trovo l'indirizzo tramite le coordinate
        locatorTask.locationToAddress(params).then((response) => {
            console.log('locationToAddress response', response);

            this.changeCenter([lon, lat]).then(() => {
                const zoom = 19;
                this.changeZoom(zoom).then(() => {
                });
            });

            // Apro il modale con FormChiamata con lat, lon e address
            const modalNuovaChiamata = this.modalService.open(ModalNuovaChiamataComponent, {
                windowClass: 'xxlModal modal-holder',
            });
            modalNuovaChiamata.componentInstance.lat = lat;
            modalNuovaChiamata.componentInstance.lon = lon;
            modalNuovaChiamata.componentInstance.address = response.attributes.Match_addr;
            modalNuovaChiamata.componentInstance.provincia = response.attributes.Subregion;
            modalNuovaChiamata.componentInstance.cap = response.attributes.Postal;
            modalNuovaChiamata.componentInstance.regione = response.attributes.Region;
            modalNuovaChiamata.componentInstance.civico = response.attributes.AddNum;

            this.store.dispatch(new SetChiamataFromMappaStatus(true));
            modalNuovaChiamata.result.then(() => {
                this.store.dispatch([
                    new SetChiamataFromMappaStatus(false),
                    new SetChiamataFromMappaActiveValue(false)
                ]);
            });
        });
    }

    // Imposta il "contextMenu" visibile o no in base al valore passato a "value"
    createNuovaEmergenza(): void {
        let lat: number;
        let lon: number;

        const mapPoint = this.eventClick.mapPoint;

        if (this.eventClick?.mapPoint) {
            lat = mapPoint.latitude;
            lon = mapPoint.longitude;
        }

        // Se il "contextMenu" è aperto lo chiudo
        if (this.contextMenuVisible) {
            this.setContextMenuVisible(false);
        }

        this.changeCenter([lon, lat]).then(() => {
            const zoom = 19;
            this.changeZoom(zoom).then(() => {
            });
        });

        const modalNuovaEmergenza = this.modalService.open(ZonaEmergenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'md'
        });

        const allTipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.allTipologieZonaEmergenza);
        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.tipologieZonaEmergenza);

        modalNuovaEmergenza.componentInstance.apertoFromMappa = true;
        modalNuovaEmergenza.componentInstance.mapPoint = mapPoint;
        modalNuovaEmergenza.componentInstance.lat = lat;
        modalNuovaEmergenza.componentInstance.lon = lon;
        modalNuovaEmergenza.componentInstance.allTipologieEmergenza = allTipologieEmergenza;
        modalNuovaEmergenza.componentInstance.tipologieEmergenza = tipologieEmergenza;

        modalNuovaEmergenza.result.then((result: string) => {
            switch (result) {
                case 'ok':
                    this.store.dispatch([
                        new AddZonaEmergenza(),
                        new SetZonaEmergenzaFromMappaActiveValue(false)
                    ]);
                    break;
                case 'ko':
                    this.store.dispatch([
                        new ResetZonaEmergenzaForm(),
                        new SetZonaEmergenzaFromMappaActiveValue(false)
                    ]);
                    break;
                default:
                    this.store.dispatch([
                        new ResetZonaEmergenzaForm(),
                        new SetZonaEmergenzaFromMappaActiveValue(false)
                    ]);
                    break;
            }
        });
    }

    saveDrawedPolygon(): void {
        console.log('saveDrawedPolygon');
    }

    // Imposta il "contextMenu" visibile o no in base al valore passato a "value"
    setContextMenuVisible(value: boolean): void {
        if (value && !this.areaMappaLoading) {
            const lat = this.eventClick.mapPoint.latitude;
            const lon = this.eventClick.mapPoint.longitude;
            this.changeCenter([lon, lat]).then(() => {
                this.changeZoom(19).then(() => {
                    this.contextMenuVisible = true;
                    const screenPoint = this.eventClick;
                    let pageX = screenPoint.x;
                    const pageY = screenPoint.y;
                    if (pageX > 1600) {
                        pageX = 1600;
                    }
                    this.renderer.setStyle(this.contextMenu.nativeElement, 'top', pageY + 10 + 'px');
                    this.renderer.setStyle(this.contextMenu.nativeElement, 'left', pageX + 23 + 'px');
                    this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'block');
                });
            });
        } else {
            this.eventClick = null;
            this.contextMenuVisible = false;
            this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'none');
        }
    }

    // Imposta il "contextMenu" del widget Draw visibile o no in base al valore passato a "value"
    setDrawContextMenuVisible(value: boolean, options?: { skipRemoveDrawedPolygon?: boolean }): void {
        if (value) {
            this.contextMenuVisible = true;
            const screenPoint = this.eventMouseMove;
            const pageX = screenPoint.x;
            const pageY = screenPoint.y;
            this.renderer.setStyle(this.contextMenu.nativeElement, 'top', pageY + 30 + 'px');
            this.renderer.setStyle(this.contextMenu.nativeElement, 'left', pageX - 30 + 'px');
            this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'block');
        } else {
            // TODO: implementare in un secondo momento
            // if (!options?.skipRemoveDrawedPolygon) {
            //     this.drawGraphicLayer.removeAll();
            //     this.drawedPolygon = null;
            // }
            this.eventMouseMove = null;
            this.contextMenuVisible = false;
            this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'none');
        }
    }

    getRoute(idDirectionSymbols: string, direction: DirectionInterface, options?: { clearPrevious?: boolean, color?: number[] }): void {
        if (options?.clearPrevious) {
            this.clearDirection('nuovaPartenza');
        }

        const pointPartenza = new Point({
            longitude: direction.origin.lng,
            latitude: direction.origin.lat,
            spatialReference: {
                wkid: 3857
            }
        });

        const pointDestinazione = new Point({
            longitude: direction.destination.lng,
            latitude: direction.destination.lat,
            spatialReference: {
                wkid: 3857
            }
        });

        const pointPartenzaGraphic = new Graphic({
            geometry: pointPartenza
        });

        const pointDestinazioneGraphic = new Graphic({
            geometry: pointDestinazione
        });

        const routeTask: RouteTask = new RouteTask({
            url: 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
        });

        const routeParams = new RouteParameters({
            stops: new FeatureSet({
                features: [pointPartenzaGraphic, pointDestinazioneGraphic]
            }),
            travelMode: this.travelModeService.getTravelModeByGenereMezzo(direction.genereMezzo)
        });

        routeTask.solve(routeParams).then((data: RouteResult) => {
            // @ts-ignore
            data.routeResults.forEach((result: any) => {
                result.route.symbol = {
                    id: idDirectionSymbols,
                    type: 'simple-line',
                    color: options?.color ? options.color : [5, 150, 255],
                    width: 3
                };
                const totalKilometers = result.route?.attributes?.Total_Kilometers;
                const totalTravelTime = result.route?.attributes?.Total_TravelTime ? result.route.attributes.Total_TravelTime : result.route?.attributes?.Total_TruckTravelTime;
                this.store.dispatch(new SetDirectionTravelData(idDirectionSymbols, { totalKilometers, totalTravelTime }));

                let labelText = '';
                labelText = totalKilometers?.toFixed(2) + ' KM \n ' + totalTravelTime?.toFixed(2) + ' MIN';
                const textSymbol = {
                    id: 'textSymbol',
                    type: 'text',  // autocasts as new TextSymbol()
                    color: 'white',
                    haloColor: [44, 49, 52],
                    haloSize: '30px',
                    text: labelText,
                    verticalAlignment: 'bottom',
                    xoffset: 5,
                    yoffset: 10,
                    font: {
                        size: 22,
                        family: 'cursive',
                        weight: 'bolder'
                    }
                };
                // @ts-ignore
                pointPartenzaGraphic.symbol = textSymbol;
                this.view.graphics.add(pointPartenzaGraphic);
                this.view.graphics.add(result.route);
            });
        });
    }

    clearDirection(idSymbol?: string): void {
        if (this.view?.graphics?.length) {
            if (!idSymbol) {
                this.view.graphics.items = [];
            } else {
                // @ts-ignore
                this.view.graphics.items = this.view.graphics.items.filter((item: Graphic) => item.symbol.id !== idSymbol && item.symbol.id !== 'textSymbol');
            }
        }
    }

    // TODO: verificare se utilizzato
    centroCambiato(centro: CentroMappa): void {
        this.mapService.setCentro(makeCentroMappa(makeCoordinate(centro.coordinateCentro.latitudine, centro.coordinateCentro.longitudine), centro.zoom));
    }

    areaCambiata(bounds: { northEastLat: number, northEastLng: number, southWestLat: number, southWestLng: number }, zoom: number): void {
        this.mapService.setArea(bounds);
    }
}
