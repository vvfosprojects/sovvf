import {
    Component,
    ViewChild,
    ElementRef,
    OnDestroy,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges,
    OnInit,
    Renderer2
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuovaChiamataComponent } from '../modal-nuova-chiamata/modal-nuova-chiamata.component';
import { Utente } from '../../../../shared/model/utente.model';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../auth/store/auth.state';
import { SetChiamataFromMappaActiveValue } from '../../store/actions/maps/tasto-chiamata-mappa.actions';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';
import { SchedaContattoMarker } from '../maps-model/scheda-contatto-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { makeCentroMappa, makeCoordinate } from 'src/app/shared/helper/mappa/function-mappa';
import { MapService } from '../service/map-service/map-service.service';
import { AreaMappa } from '../maps-model/area-mappa-model';
import { ViewComponentState } from '../../store/states/view/view.state';
import { ToggleChiamata, ToggleComposizione, ToggleModifica } from '../../store/actions/view/view.actions';
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
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit, OnChanges, OnDestroy {

    @Input() pCenter: CentroMappa;
    @Input() chiamateMarkers: ChiamataMarker[];
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() schedeContattoMarkers: SchedaContattoMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() tastoChiamataMappaActive: boolean;

    @Output() mapIsLoaded: EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }> = new EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }>();
    @Output() boundingBoxChanged: EventEmitter<{ spatialReference?: SpatialReference }> = new EventEmitter<{ spatialReference?: SpatialReference }>();

    operatore: Utente;

    map: Map;
    view: any = null;
    eventClick: any;
    eventMouseMove: any;
    eventMouseMoveStart: any;
    contextMenuVisible = false;

    chiamateInCorsoFeatureLayer: FeatureLayer;
    chiamateMarkersGraphics = [];
    richiesteFeatureLayer: FeatureLayer;
    richiesteMarkersGraphics = [];
    schedeContattoFeatureLayer: FeatureLayer;
    schedeContattoMarkersGraphics = [];
    sediOperativeFeatureLayer: FeatureLayer;
    sediOperativeMarkersGraphics = [];

    drawing: boolean;
    drawGraphicLayer = new GraphicsLayer({
        title: 'Disegno Libero - Poligoni'
    });
    drawedPolygon: Graphic;

    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;
    @ViewChild('contextMenu', { static: false }) private contextMenu: ElementRef;

    constructor(private http: HttpClient,
                private mapService: MapService,
                private modalService: NgbModal,
                private store: Store,
                private configModal: NgbModalConfig,
                private renderer: Renderer2) {
        this.configModal.backdrop = 'static';
        this.configModal.keyboard = false;
    }

    ngOnInit(): void {
        this.operatore = this.store.selectSnapshot(AuthState.currentUser);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Centro e Zoom mappa
        if (changes?.pCenter?.currentValue && !this.map) {
            // Esegue il login sul portale (da finire)
            // this.loginIntoESRI().then(() => {
            // Inizializzazione della mappa
            this.initializeMap().then(() => {

                // Controllo l'extent per richiedere i marker "Richieste" da visualizzare ogni volta che quest'ultimo cambia
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

                // Inizializzazione del layer lato client per disegnare poligoni sulla mappa
                this.map.add(this.drawGraphicLayer);

                // Lista layer da inizializzare
                const layersToInitialize = [
                    this.initializeRichiesteLayer(),
                    this.initializeChiamateInCorsoLayer(),
                    this.initializeSchedeContattoLayer(),
                    this.initializeSediOperativeLayer()
                ];
                Promise.all(layersToInitialize).then(() => {
                    // Gestisco l'evento "click"
                    this.view.on('click', (event) => {
                        this.eventClick = event;
                        if (this.tastoChiamataMappaActive && event.button === 0) {
                            const screenPoint = this.eventClick.screenPoint;
                            // Controllo se dove ho fatto click sono presenti dei graphics facendo un "HitTest"
                            this.view.hitTest(screenPoint)
                                .then((resHitTest) => {
                                    const graphic = resHitTest.results[0]?.graphic;
                                    // Se non ci sono graphics posso aprire il "Form Chiamata"
                                    if (!graphic) {
                                        this.startNuovaChiamata();
                                    }
                                });
                        } else if (!this.tastoChiamataMappaActive && event.button === 2) {
                            if (this.contextMenuVisible) {
                                this.setContextMenuVisible(false);
                            } else {
                                this.setContextMenuVisible(true);
                            }
                        } else if (this.tastoChiamataMappaActive && event.button !== 0) {
                            this.store.dispatch(new SetChiamataFromMappaActiveValue(false));
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
                        if (!this.drawing) {
                            this.setContextMenuVisible(false);
                        }
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
                        if (!this.drawing) {
                            this.setContextMenuVisible(false);
                        }
                    });

                    // Aggiungo i Chiamate Markers
                    if (changes?.chiamateMarkers?.currentValue && this.map && this.chiamateInCorsoFeatureLayer) {
                        const markersChiamate = changes?.chiamateMarkers?.currentValue;
                        this.addChiamateMarkersToLayer(markersChiamate).then();
                    }
                    // Aggiungo i Richieste Markers
                    if (changes?.richiesteMarkers?.currentValue && this.map && this.richiesteFeatureLayer) {
                        const markersRichieste = changes?.richiesteMarkers?.currentValue;
                        this.addRichiesteMarkersToLayer(markersRichieste).then();
                    }
                    // Aggiungo i SchedeContatto Markers
                    if (changes?.schedeContattoMarkers?.currentValue && this.map && this.schedeContattoFeatureLayer) {
                        const markersSchedeContatto = changes?.schedeContattoMarkers?.currentValue;
                        this.addSchedeContattoMarkersToLayer(markersSchedeContatto).then();
                    }
                    // Aggiungo i Sedi Markers
                    if (changes?.sediMarkers?.currentValue && this.map && this.sediOperativeFeatureLayer) {
                        const markersSedi = changes?.sediMarkers?.currentValue;
                        this.addSediMarkersToLayer(markersSedi).then();
                    }
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

                        const mapImageLayersToAdd = [
                            // '21029042105b4ffb86de33033786dfc8'
                        ];

                        for (const lAdd of mapImageLayersToAdd) {
                            this.addMapImageLayer(lAdd).then();
                        }

                        const featuresLayersToAdd = [
                            '3bc8743584c4484aa032a353328969d0'
                        ];

                        for (const lAdd of featuresLayersToAdd) {
                            this.addFeatureLayer(lAdd).then();
                        }

                        const layersToToggle = [
                            'HERE_ITALIA',
                            'Sedi Operative',
                            'Approvvigionamenti Idrici VVF_Idranti'
                        ];

                        for (const lToggle of layersToToggle) {
                            this.toggleLayer(lToggle).then();
                        }
                    });
                });
            });
            // });
        } else if (changes?.pCenter?.currentValue && this.map && this.view?.ready) {
            const newPCenter = changes.pCenter.currentValue;
            const center = [newPCenter.coordinateCentro.longitudine, newPCenter.coordinateCentro.latitudine];
            this.changeCenter(center).then(() => {
                const zoom = newPCenter.zoom;
                this.changeZoom(zoom).then();
            });
        }

        // Aggiungo i Chiamate Markers con "ApplyEdits"
        if (changes?.chiamateMarkers?.currentValue && this.map && this.chiamateInCorsoFeatureLayer) {
            const markersChiamate = changes?.chiamateMarkers?.currentValue;
            this.addChiamateMarkersToLayer(markersChiamate, true).then();
        }
        // Aggiungo i Richieste Markers con "ApplyEdits"
        if (changes?.richiesteMarkers?.currentValue && this.map && this.richiesteFeatureLayer) {
            const markersRichieste = changes?.richiesteMarkers?.currentValue;
            this.addRichiesteMarkersToLayer(markersRichieste, true).then();
        }
        // Aggiungo i SchedeConatto Markers con "ApplyEdits"
        if (changes?.schedeContattoMarkers?.currentValue && this.map && this.schedeContattoFeatureLayer) {
            const markersSchedeContatto = changes?.schedeContattoMarkers?.currentValue;
            this.addSchedeContattoMarkersToLayer(markersSchedeContatto, true).then();
        }
        // Aggiungo i Sedi Markers con "ApplyEdits"
        if (changes?.sediMarkers?.currentValue && this.map && this.sediOperativeFeatureLayer) {
            const markersSedi = changes?.sediMarkers?.currentValue;
            this.addSediMarkersToLayer(markersSedi, true).then();
        }
        // Controllo il valore di "tastoChiamataMappaActive"
        if (changes?.tastoChiamataMappaActive?.currentValue && this.map && this.chiamateInCorsoFeatureLayer) {
            this.setContextMenuVisible(false);
        }
    }

    ngOnDestroy(): void {
        if (this.view) {
            this.view.destroy();
        }
        if (this.map) {
            this.map.destroy();
        }
        if (this.chiamateInCorsoFeatureLayer) {
            this.chiamateInCorsoFeatureLayer.destroy();
        }
    }

    // TODO: terminare login automatico
    // Effettua il login automatico ad ESRI senza doverlo fare manualmente ogni volta
    async loginIntoESRI(): Promise<any> {
        await this.http.get('https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=' + /* TODO: inserire app id dopo registrazione */ +' &response_type=token&redirect_uri=' + 'localhost:4200').subscribe((resAuthorize: any) => {
            if (resAuthorize) {
                this.http.get('https://www.arcgis.com/sharing/rest/oauth2/approval?code=' + resAuthorize).subscribe((resApproval: any) => {
                    if (resApproval) {
                        console.log('sei loggato');
                    }
                });
            }
        });
    }

    // Inizializza la mappa
    async initializeMap(): Promise<any> {
        const container = this.mapViewEl.nativeElement;

        EsriConfig.portalUrl = 'http://gis.dipvvf.it/portal/sharing/rest/portals/self?f=json&culture=it';

        const portalItem = new PortalItem({
            id: 'e0286783ec05475882ed9b1fa89ea8f5'
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

    // Imposta il "contextMenu" visibile o no in base al valore passato a "value"
    startNuovaChiamata(): void {
        // Controllo se è stato scelto un punto ppure un poligono complesso
        let lat: number;
        let lon: number;
        let drawedPolygon: Graphic;

        if (this.eventClick?.mapPoint) {
            lat = this.eventClick.mapPoint.latitude;
            lon = this.eventClick.mapPoint.longitude;
        } else if (this.drawGraphicLayer?.graphics?.length) {
            drawedPolygon = this.drawedPolygon;
        }

        // Se il "contextMenu" è aperto lo chiudo
        if (this.contextMenuVisible) {
            this.setContextMenuVisible(false, { skipRemoveDrawedPolygon: !!drawedPolygon });
        }

        // Se il puntatore di "NuovaChiamtaMappa" è attivo posso aprire il "Form Chiamata"
        const check = document.getElementById('idCheck');
        // @ts-ignore
        if (check && !check.checked) {
            return;
        }

        // TODO: implementare quando il servizio "GeocodeServer" sarà disponibile
        /* if (lat && lon) {
            // Imposto l'url al servizio che mi restituisce l'indirizzo tramite lat e lon
            const locatorTask = new Locator({
                url: 'http://gis.dipvvf.it/portal/sharing/rest/services/World/GeocodeServer'
            });
            const params = {
                location: this.eventClick.mapPoint
            };
            // Trovo l'indirizzo tramite le coordinate
            locatorTask.locationToAddress(params).then((response) => {
                console.log('response', response);
                console.log('address', response.address);

                this.changeCenter([lon, lat]);
                this.changeZoom(19);

                // Apro il modale con FormChiamata con lat, lon e address
                const modalNuovaChiamata = this.modalService.open(ModalNuovaChiamataComponent, {
                    windowClass: 'xxlModal modal-holder',
                });
                modalNuovaChiamata.componentInstance.lat = lat;
                modalNuovaChiamata.componentInstance.lon = lon;
                modalNuovaChiamata.componentInstance.address = response.address;

                modalNuovaChiamata.result.then((result: string) => {
                    this.store.dispatch(new SetChiamataFromMappaActiveValue(false));
                });
            });
        } else if (drawedPolygon) {
            // Apro il modale con FormChiamata con il drawedPolygon
            const modalNuovaChiamata = this.modalService.open(ModalNuovaChiamataComponent, {
                windowClass: 'xxlModal modal-holder',
            });
            modalNuovaChiamata.componentInstance.drawedPolygon = drawedPolygon;

            modalNuovaChiamata.result.then((result: string) => {
                this.store.dispatch(new SetChiamataFromMappaActiveValue(false));
            });
        } */

        if (lat && lon) {
            // !!TEST!! API gratuita per il geocode inverso TODO: sostituire con API dei VVF
            const obj = {
                location: {
                    latLng: {
                        lat,
                        lng: lon
                    }
                },
                options: {
                    thumbMaps: false
                },
                includeNearestIntersection: true,
                includeRoadMetadata: true
            };

            // Trovo l'indirizzo tramite le coordinate (con API gratuita)
            this.http.post('http://open.mapquestapi.com/geocoding/v1/reverse?key=2S0fOQbN9KRvxAg6ONq7J8s2evnvb8dm', obj).subscribe((response: any) => {

                this.changeCenter([lon, lat]);
                this.changeZoom(19);

                const chiamataFormActive = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
                const modificaFormActive = this.store.selectSnapshot(ViewComponentState.modificaRichiestaStatus);
                const composizionePartenzaActive = this.store.selectSnapshot(ViewComponentState.modificaRichiestaStatus);
                if(chiamataFormActive) {
                    this.store.dispatch(new ToggleChiamata());
                } else if(modificaFormActive) {
                    this.store.dispatch(new ToggleModifica());
                } else if(composizionePartenzaActive) {
                    this.store.dispatch(new ToggleComposizione());
                }

                // Apro il modale con FormChiamata con lat, lon e address
                const modalNuovaChiamata = this.modalService.open(ModalNuovaChiamataComponent, {
                    windowClass: 'xxlModal modal-holder',
                });
                modalNuovaChiamata.componentInstance.lat = lat;
                modalNuovaChiamata.componentInstance.lon = lon;
                modalNuovaChiamata.componentInstance.address = response?.results[0]?.locations[0]?.street;

                modalNuovaChiamata.result.then((result: string) => {
                    this.store.dispatch(new SetChiamataFromMappaActiveValue(false));
                });
            });
        }
    }

    // Imposta il "contextMenu" visibile o no in base al valore passato a "value"
    setContextMenuVisible(value: boolean, options?: { skipRemoveDrawedPolygon?: boolean }): void {
        if (value) {
            const lat = this.eventClick.mapPoint.latitude;
            const lon = this.eventClick.mapPoint.longitude;
            this.changeCenter([lon, lat]).then(() => {
                this.changeZoom(19).then(() => {
                    this.contextMenuVisible = true;
                    const screenPoint = this.eventClick;
                    const pageX = screenPoint.x;
                    const pageY = screenPoint.y;
                    this.renderer.setStyle(this.contextMenu.nativeElement, 'top', pageY + 10 + 'px');
                    this.renderer.setStyle(this.contextMenu.nativeElement, 'left', pageX + 23 + 'px');
                    this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'block');
                });
            });
        } else {
            if (!options?.skipRemoveDrawedPolygon) {
                this.drawGraphicLayer.removeAll();
                this.drawedPolygon = null;
            }
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
            if (!options?.skipRemoveDrawedPolygon) {
                this.drawGraphicLayer.removeAll();
                this.drawedPolygon = null;
            }
            this.eventMouseMove = null;
            this.contextMenuVisible = false;
            this.renderer.setStyle(this.contextMenu.nativeElement, 'display', 'none');
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

        // configurazione del cluster Chiamate in Corso
        const clusterConfigChiamateInCorso = new FeatureReductionCluster({
            clusterRadius: '100px',
            popupTemplate: {
                title: 'Cluster Chiamate in Corso',
                content: 'Questo cluster contiene {cluster_count} Chiamate in Corso.',
                fieldInfos: [
                    {
                        fieldName: 'cluster_count',
                        format: {
                            places: 0,
                            digitSeparator: true,
                        },
                    }
                ],
            },
            clusterMinSize: '50px',
            clusterMaxSize: '60px',
            labelingInfo: [
                {
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')',
                    },
                    symbol: {
                        type: 'text',
                        color: 'white',
                        font: {
                            weight: 'bold',
                            family: 'Noto Sans',
                            size: '30px',
                        },
                    },
                    labelPlacement: 'center-center',
                },
            ]
        });

        // creazione feature layer
        this.chiamateInCorsoFeatureLayer = new FeatureLayer({
            title: 'Chiamate in Corso',
            source: [],
            objectIdField: 'ID',
            featureReduction: clusterConfigChiamateInCorso,
            popupEnabled: false, // TODO: Impostare a true dopo aver risolvo con il popupTemplate
            labelsVisible: true,
            renderer: rendererChiamataInCorso,
            // popupTemplate: null, // TODO: Risolvere visualizzazione popup
            spatialReference: {
                wkid: 3857
            },
            geometryType: 'point'
        });

        // aggiungo il feature layer alla mappa
        this.map.add(this.chiamateInCorsoFeatureLayer);
    }

    // Inizializza il layer "Richieste"
    async initializeRichiesteLayer(): Promise<any> {
        // creazione renderer Richieste
        const rendererRichieste = new UniqueValueRenderer({
            field: 'stato',
            uniqueValueInfos: [
                {
                    value: 'Chiamata',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/richieste/ns/chiamata.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Assegnata',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/richieste/ns/assegnata.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Presidiata',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/richieste/ns/presidiata.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Sospesa',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/richieste/ns/sospesa.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Chiusa',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/richieste/ns/chiusa.png',
                        width: '50px',
                        height: '50px'
                    })
                },
            ],
        });

        // configurazione del cluster Richieste
        const clusterConfigRichieste = new FeatureReductionCluster({
            clusterRadius: '100px',
            popupTemplate: {
                title: 'Cluster Richieste',
                content: 'Questo cluster contiene {cluster_count} Richieste.',
                fieldInfos: [
                    {
                        fieldName: 'cluster_count',
                        format: {
                            places: 0,
                            digitSeparator: true,
                        },
                    }
                ],
            },
            clusterMinSize: '50px',
            clusterMaxSize: '60px',
            labelingInfo: [
                {
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')',
                    },
                    symbol: {
                        type: 'text',
                        color: 'white',
                        font: {
                            weight: 'bold',
                            family: 'Noto Sans',
                            size: '30px',
                        },
                    },
                    labelPlacement: 'center-center',
                },
            ]
        });

        // creazione feature layer
        this.richiesteFeatureLayer = new FeatureLayer({
            title: 'Richieste',
            outFields: ['*'],
            source: [],
            objectIdField: 'ID',
            popupEnabled: true,
            labelsVisible: true,
            // featureReduction: clusterConfigRichieste,
            renderer: rendererRichieste,
            fields: [
                {
                    name: 'ID',
                    alias: 'id',
                    type: 'oid',
                },
                {
                    name: 'stato',
                    alias: 'stato',
                    type: 'string',
                },
                {
                    name: 'note',
                    alias: 'note',
                    type: 'string',
                },
                {
                    name: 'descrizioneOperatore',
                    alias: 'descrizioneOperatore',
                    type: 'string',
                },
                {
                    name: 'codiceSedeOperatore',
                    alias: 'codiceSedeOperatore',
                    type: 'string',
                },
            ],
            spatialReference: {
                wkid: 3857
            },
            popupTemplate: {
                title: 'Id: {id}',
                content:
                    '<ul><li>Stato: {stato} </li>' +
                    '<li>Note: {descrizioneOperatore} </li><ul>',
            },
            geometryType: 'point'
        });

        // aggiungo il feature layer alla mappa
        this.map.add(this.richiesteFeatureLayer);
    }

    // Inizializza il layer "Schede Contatto"
    async initializeSchedeContattoLayer(): Promise<any> {
        // creazione renderer SchedeContatto
        const rendererSchedeContatto = new UniqueValueRenderer({
            field: 'classificazione',
            uniqueValueInfos: [
                {
                    value: 'Competenza',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/speciali/scheda-contatto-marker.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Conoscenza',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/speciali/scheda-contatto-marker-conoscenza.png',
                        width: '50px',
                        height: '50px'
                    })
                },
                {
                    value: 'Differibile',
                    symbol: new PictureMarkerSymbol({
                        url: '/assets/img/icone-markers/speciali/scheda-contatto-marker-differibile.png',
                        width: '50px',
                        height: '50px'
                    })
                },
            ],
        });

        // configurazione del cluster SchedeContatto
        const clusterConfigSchedeContatto = new FeatureReductionCluster({
            clusterRadius: '100px',
            popupTemplate: {
                title: 'Cluster Schede Contatto',
                content: 'Questo cluster contiene {cluster_count} Schede Contatto.',
                fieldInfos: [
                    {
                        fieldName: 'cluster_count',
                        format: {
                            places: 0,
                            digitSeparator: true,
                        },
                    }
                ],
            },
            clusterMinSize: '50px',
            clusterMaxSize: '60px',
            labelingInfo: [
                {
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')',
                    },
                    symbol: {
                        type: 'text',
                        color: 'white',
                        font: {
                            weight: 'bold',
                            family: 'Noto Sans',
                            size: '30px',
                        },
                    },
                    labelPlacement: 'center-center',
                },
            ]
        });

        // creazione feature layer
        this.schedeContattoFeatureLayer = new FeatureLayer({
            title: 'Schede Contatto',
            outFields: ['*'],
            source: [],
            objectIdField: 'ID',
            popupEnabled: true,
            labelsVisible: true,
            // featureReduction: clusterConfigSchedeContatto,
            renderer: rendererSchedeContatto,
            fields: [
                {
                    name: 'ID',
                    alias: 'id',
                    type: 'oid',
                },
                {
                    name: 'classificazione',
                    alias: 'Classificazione',
                    type: 'string',
                }
            ],
            spatialReference: {
                wkid: 3857
            },
            popupTemplate: {
                title: 'Id: {id}',
                content:
                    '<ul><li>Classificazione: {classificazione} </li>'
            },
            geometryType: 'point'
        });

        // aggiungo il feature layer alla mappa
        this.map.add(this.schedeContattoFeatureLayer);
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

        // configurazione del cluster SediOperative
        const clusterConfigSediOperative = new FeatureReductionCluster({
            clusterRadius: '100px',
            popupTemplate: {
                title: 'Cluster Sedi Operative',
                content: 'Questo cluster contiene {cluster_count} Sedi Operative.',
                fieldInfos: [
                    {
                        fieldName: 'cluster_count',
                        format: {
                            places: 0,
                            digitSeparator: true,
                        },
                    }
                ],
            },
            clusterMinSize: '50px',
            clusterMaxSize: '60px',
            labelingInfo: [
                {
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')',
                    },
                    symbol: {
                        type: 'text',
                        color: 'red',
                        font: {
                            weight: 'bold',
                            family: 'Noto Sans',
                            size: '25px',
                        },
                    },
                    labelPlacement: 'center-center',
                },
            ]
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
            this.chiamateInCorsoFeatureLayer.queryFeatures(query).then((results) => {
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

    // Aggiunge i marker delle richieste al layer "Richieste"
    async addRichiesteMarkersToLayer(richiesteMarkers: RichiestaMarker[], applyEdits?: boolean): Promise<any> {
        if (this.richiesteMarkersGraphics?.length) {
            const query = { where: '1=1' };
            this.richiesteFeatureLayer.queryFeatures(query).then((results) => {
                const deleteFeatures = results.features;
                this.richiesteFeatureLayer.applyEdits({ deleteFeatures });
                this.richiesteFeatureLayer.refresh();
                addMarkers(this.richiesteFeatureLayer).then((richiesteMarkersGraphics: any[]) => {
                    this.richiesteMarkersGraphics = richiesteMarkersGraphics;
                });
            });
        } else {
            addMarkers(this.richiesteFeatureLayer).then((richiesteMarkersGraphics: any[]) => {
                this.richiesteMarkersGraphics = richiesteMarkersGraphics;
            });
        }

        async function addMarkers(richiesteFeatureLayer: FeatureLayer): Promise<any[]> {
            const richiesteMarkersGraphicsToAdd = [];
            for (const markerDaStampare of richiesteMarkers) {
                const long = markerDaStampare.localita.coordinate.longitudine;
                const lat = markerDaStampare.localita.coordinate.latitudine;
                const p: any = [long, lat];
                const mp = new Point(p);
                const graphic = new Graphic({
                    geometry: mp,
                    attributes: {
                        ID: markerDaStampare.id,
                        STATO: markerDaStampare.stato,
                        descrizioneOperatore: 'OPERATORE',
                        codiceSedeOperatore: 'RM.1000',
                        note: 'NOTE TEST'
                    }
                });
                richiesteMarkersGraphicsToAdd.push(graphic);
            }

            if (!applyEdits) {
                richiesteFeatureLayer.source.addMany(richiesteMarkersGraphicsToAdd);
            } else if (applyEdits) {
                richiesteFeatureLayer.applyEdits({ addFeatures: richiesteMarkersGraphicsToAdd }).then(() => {
                    richiesteFeatureLayer.refresh();
                });
            }

            return richiesteMarkersGraphicsToAdd;
        }
    }

    // Aggiunge i marker delle schede contatto al layer "Schede Contatto"
    async addSchedeContattoMarkersToLayer(schedeContattoMarkers: SchedaContattoMarker[], applyEdits?: boolean): Promise<any> {
        if (this.schedeContattoMarkers?.length) {
            const query = { where: '1=1' };
            this.schedeContattoFeatureLayer.queryFeatures(query).then((results) => {
                const deleteFeatures = results.features;
                this.schedeContattoFeatureLayer.applyEdits({ deleteFeatures });
                this.schedeContattoFeatureLayer.refresh();
                addMarkers(this.schedeContattoFeatureLayer).then((schedeContattoMarkersGraphics: any[]) => {
                    this.schedeContattoMarkersGraphics = schedeContattoMarkersGraphics;
                });
            });
        } else {
            addMarkers(this.schedeContattoFeatureLayer).then((schedeContattoMarkersGraphics: any[]) => {
                this.schedeContattoMarkersGraphics = schedeContattoMarkersGraphics;
            });
        }

        async function addMarkers(schedeContattoFeatureLayer: FeatureLayer): Promise<any[]> {
            const schedeContattoMarkersGraphicsToAdd = [];
            for (const markerDaStampare of schedeContattoMarkers) {
                const long = markerDaStampare.localita.coordinate.longitudine;
                const lat = markerDaStampare.localita.coordinate.latitudine;
                const p: any = [long, lat];
                const mp = new Point(p);
                const graphic = new Graphic({
                    geometry: mp,
                    attributes: {
                        ID: markerDaStampare.codiceScheda,
                        classificazione: markerDaStampare.classificazione
                    }
                });
                schedeContattoMarkersGraphicsToAdd.push(graphic);
            }

            if (!applyEdits) {
                schedeContattoFeatureLayer.source.addMany(schedeContattoMarkersGraphicsToAdd);
            } else if (applyEdits) {
                schedeContattoFeatureLayer.applyEdits({ addFeatures: schedeContattoMarkersGraphicsToAdd }).then(() => {
                    schedeContattoFeatureLayer.refresh();
                });
            }

            return schedeContattoMarkersGraphicsToAdd;
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

        const layerList = new LayerList({
            view: this.view,
        });

        const llExpand = new Expand({
            view: this.view,
            content: layerList,
        });

        const legend = new Legend({
            view: this.view,
        });

        const leExpand = new Expand({
            view: this.view,
            content: legend,
        });

        const basemapGallery = new BasemapGallery({
            view: this.view,
        });

        const bgExpand = new Expand({
            view: this.view,
            content: basemapGallery,
        });

        const search = new Search({
            view: this.view,
        });

        const sketch = new Sketch({
            layer: this.drawGraphicLayer,
            view: this.view,
            // graphic will be selected as soon as it is created
            creationMode: 'single',
            availableCreateTools: ['polygon']
        });

        // Listen to sketch widget's create event.
        sketch.on('create', (event) => {
            // check if the create event's state has changed to complete indicating
            // the graphic create operation is completed.
            switch (event.state) {
                case 'start':
                    this.drawing = true;
                    this.eventMouseMoveStart = this.eventMouseMove;
                    break;
                case 'active':
                    break;
                case 'complete':
                    this.drawing = false;
                    this.drawedPolygon = event.graphic;
                    this.setDrawContextMenuVisible(true);
                    break;
                default:
                    console.log('nuovo evento trovato', event);
                    break;
            }
        });

        // Listen to sketch widget's update event.
        sketch.on('update', () => {
            this.drawing = false;
            this.drawedPolygon = null;
            this.drawGraphicLayer.removeAll();
            this.setDrawContextMenuVisible(false);
        });

        // Listen to sketch widget's delete event.
        sketch.on('delete', () => {
            this.drawing = false;
            this.drawedPolygon = null;
            this.drawGraphicLayer.removeAll();
            this.setDrawContextMenuVisible(false);
        });

        // Altre possibili posizioni standard o manuale
        // "bottom-leading"|"bottom-left"|"bottom-right"|"bottom-trailing"|"top-leading"|"top-left"|"top-right"|"top-trailing"|"manual"
        this.view.ui.add(llExpand, 'top-right');
        this.view.ui.add(leExpand, 'top-right');
        this.view.ui.add(bgExpand, 'top-right');
        this.view.ui.add(search, {
            position: 'top-left',
            index: 0 // indico la posizione nella UI
        });
        this.view.ui.add(sketch, 'bottom-right');
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
    async toggleLayer(layerTitle: string): Promise<any> {
        const layerExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
        if (layerExists) {
            this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = !this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible;
        }
    }

    // TODO: verificare se utilizzato
    // Rimuove un intero layer dalla mappa
    // async removeLayer(layerTitle: string): Promise<any> {
    //     const layerToRemoveExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
    //     if (layerToRemoveExists) {
    //         this.map.allLayers.toArray().filter((l: Layer) => l.title !== layerTitle);
    //     }

    // TODO: verificare se utilizzato
    centroCambiato(centro: CentroMappa): void {
        this.mapService.setCentro(makeCentroMappa(makeCoordinate(centro.coordinateCentro.latitudine, centro.coordinateCentro.longitudine), centro.zoom));
    }

    areaCambiata(bounds: { northEastLat: number, northEastLng: number, southWestLat: number, southWestLng: number }, zoom: number): void {
        this.mapService.setArea(bounds);
    }
}