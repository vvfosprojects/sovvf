import { Component, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuovaChiamataComponent } from '../modal-nuova-chiamata/modal-nuova-chiamata.component';
import { Utente } from '../../../shared/model/utente.model';
import { Store } from '@ngxs/store';
import { AuthState } from '../../auth/store/auth.state';
import { SetChiamataFromMappaActiveValue } from '../../home/store/actions/maps/tasto-chiamata-mappa.actions';
import { makeCentroMappa, makeCoordinate } from 'src/app/shared/helper/mappa/function-mappa';
import { MapService } from '../map-service/map-service.service';
import { AreaMappa } from '../maps-model/area-mappa-model';
import { DirectionInterface } from '../maps-interface/direction-interface';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { VoceFiltro } from '../../home/filterbar/filtri-richieste/voce-filtro.model';
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
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';

@Component({
    selector: 'app-map-esri',
    templateUrl: './map-esri.component.html',
    styleUrls: ['./map-esri.component.scss']
})
export class MapEsriComponent implements OnInit, OnChanges, OnDestroy {

    @Input() pCenter: CentroMappa;
    @Input() chiamateMarkers: ChiamataMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() tastoChiamataMappaActive: boolean;
    @Input() direction: DirectionInterface;
    @Input() filtriRichiesteSelezionati: VoceFiltro[];
    @Input() schedeContattoStatus: boolean;
    @Input() mezziInServizioStatus: boolean;
    @Input() areaMappaLoading: boolean;

    @Output() mapIsLoaded: EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }> = new EventEmitter<{ areaMappa: AreaMappa, spatialReference?: SpatialReference }>();
    @Output() boundingBoxChanged: EventEmitter<{ spatialReference?: SpatialReference }> = new EventEmitter<{ spatialReference?: SpatialReference }>();

    operatore: Utente;
    token: string;

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
        this.token = this.store.selectSnapshot(AuthState.currentEsriToken);
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

                // Lista layer (client) da aggiungere alla mappa all'init della mappa
                const layersToInitialize = [
                    this.initializeChiamateInCorsoLayer(),
                    this.initializeSediOperativeLayer()
                ];
                Promise.all(layersToInitialize).then(() => {
                    // Feature Layers da spegnere all'init della mappa
                    const layersToShutdown = [
                        'Sedi Operative'
                    ];
                    for (const lShutdown of layersToShutdown) {
                        this.toggleLayer(lShutdown, false).then();
                    }

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
                this.changeZoom(zoom).then();
            });
        }

        // Aggiungo i Chiamate Markers con "ApplyEdits"
        if (changes?.chiamateMarkers?.currentValue && this.chiamateInCorsoFeatureLayer) {
            const markersChiamate = changes?.chiamateMarkers?.currentValue;
            this.addChiamateMarkersToLayer(markersChiamate, true).then();
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
                this.getRoute(changes?.direction.currentValue);
            } else {
                this.clearDirection();
            }
        }

        // Controllo il valore di "filtriRichiesteSelezionati"
        if (changes?.filtriRichiesteSelezionati?.currentValue) {
            const filtriRichiesteSelezionati = changes.filtriRichiesteSelezionati.currentValue as VoceFiltro[];
            if (filtriRichiesteSelezionati?.length) {
                filtriRichiesteSelezionati.forEach((filtro: VoceFiltro) => {
                    const codFiltro = filtro.codice.toLocaleLowerCase().replace(/\s+/g, '');
                    switch (codFiltro) {
                        case 'interventichiusi':
                            this.toggleLayer('Interventi - Chiusi', true).then();
                            break;
                        default:
                            this.toggleLayer('Interventi - Chiusi', false).then();
                            break;
                    }
                });
            } else {
                this.toggleLayer('Interventi - Chiusi', false).then();
            }
        }

        // Controllo se la feature "Schede Contatto" viene attivata
        if (changes?.schedeContattoStatus?.currentValue !== null) {
            const schedeContattoActive = changes?.schedeContattoStatus?.currentValue;
            switch (schedeContattoActive) {
                case true:
                    this.toggleLayer('Schede Contatto', true).then();
                    break;
                case false:
                    this.toggleLayer('Schede Contatto', false).then();
                    break;
            }
        }

        // Controllo se la feature "Mezzi in Servizio" viene attivata
        if (changes?.mezziInServizioStatus?.currentValue !== null) {
            const mezziInServizioActive = changes?.mezziInServizioStatus?.currentValue;
            switch (mezziInServizioActive) {
                case true:
                    this.toggleLayer('LOCALIZZAZIONE_MEZZI_VVF_0', true).then();
                    break;
                case false:
                    this.toggleLayer('LOCALIZZAZIONE_MEZZI_VVF_0', false).then();
                    break;
            }
        }
    }

    ngOnDestroy(): void {
        this.view?.destroy();
        this.map?.destroy();
    }

    // Inizializza la mappa
    async initializeMap(): Promise<any> {
        const container = this.mapViewEl.nativeElement;

        EsriConfig.portalUrl = 'https://gis.dipvvf.it/portal/sharing/rest/portals/self?f=json&culture=it';
        EsriConfig.request.interceptors.push({
            before: (params) => {
                params.requestOptions.query = params.requestOptions.query || {};
                params.requestOptions.query.token = this.token;
            },
        });

        const portalItem = new PortalItem({
            id: '55fdd15730524dedbff72e285cba3795'
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

        // configurazione del cluster SediOperative
        // const clusterConfigSediOperative = new FeatureReductionCluster({
        //     clusterRadius: '100px',
        //     popupTemplate: {
        //         title: 'Cluster Sedi Operative',
        //         content: 'Questo cluster contiene {cluster_count} Sedi Operative.',
        //         fieldInfos: [
        //             {
        //                 fieldName: 'cluster_count',
        //                 format: {
        //                     places: 0,
        //                     digitSeparator: true,
        //                 },
        //             }
        //         ],
        //     },
        //     clusterMinSize: '50px',
        //     clusterMaxSize: '60px',
        //     labelingInfo: [
        //         {
        //             deconflictionStrategy: 'none',
        //             labelExpressionInfo: {
        //                 expression: 'Text($feature.cluster_count, \'#,###\')',
        //             },
        //             symbol: {
        //                 type: 'text',
        //                 color: 'red',
        //                 font: {
        //                     weight: 'bold',
        //                     family: 'Noto Sans',
        //                     size: '25px',
        //                 },
        //             },
        //             labelPlacement: 'center-center',
        //         },
        //     ]
        // });

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

        // Altre possibili posizioni standard o manuale
        // "bottom-leading"|"bottom-left"|"bottom-right"|"bottom-trailing"|"top-leading"|"top-left"|"top-right"|"top-trailing"|"manual"
        this.view.ui.add(llExpand, 'top-right');
        this.view.ui.add(leExpand, 'top-right');
        this.view.ui.add(bgExpand, 'top-right');
        this.view.ui.add(search, {
            position: 'top-left',
            index: 0 // indico la posizione nella UI
        });

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
        const layerExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
        if (layerExists) {
            if (valueToSet === null) {
                this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = !this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible;
            } else {
                this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = valueToSet;
            }
        }
    }

    // Imposta il "contextMenu" visibile o no in base al valore passato a "value"
    startNuovaChiamata(): void {
        // Controllo se è stato scelto un punto ppure un poligono complesso
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

            this.changeCenter([lon, lat]).then();
            this.changeZoom(19).then();

            // Apro il modale con FormChiamata con lat, lon e address
            const modalNuovaChiamata = this.modalService.open(ModalNuovaChiamataComponent, {
                windowClass: 'xxlModal modal-holder',
            });
            modalNuovaChiamata.componentInstance.lat = lat;
            modalNuovaChiamata.componentInstance.lon = lon;
            modalNuovaChiamata.componentInstance.address = response.attributes.Match_addr;

            modalNuovaChiamata.result.then(() => {
                this.store.dispatch(new SetChiamataFromMappaActiveValue(false));
            });
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
                    const pageX = screenPoint.x;
                    const pageY = screenPoint.y;
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

    getRoute(direction: DirectionInterface): void {
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
            })
        });

        routeTask.solve(routeParams).then((data: RouteResult) => {
            // @ts-ignore
            data.routeResults.forEach((result: any) => {
                result.route.symbol = {
                    type: 'simple-line',
                    color: [5, 150, 255],
                    width: 3
                };
                this.view.graphics.add(result.route);
            });
        });
    }

    clearDirection(): void {
        if (this.view?.graphics?.length) {
            this.view.graphics.removeAll();
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
