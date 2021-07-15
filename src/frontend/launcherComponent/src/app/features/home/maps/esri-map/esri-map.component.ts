import {
    Component,
    ViewChild,
    ElementRef,
    OnDestroy,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges, OnInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalNuovaChiamataComponent } from '../modal-nuova-chiamata/modal-nuova-chiamata.component';
import { Utente } from '../../../../shared/model/utente.model';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../auth/store/auth.state';
import { makeIdChiamata } from '../../../../shared/helper/function-richieste';
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

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit, OnChanges, OnDestroy {

    @Input() pCenter: CentroMappa;
    @Input() chiamateMarkers: ChiamataMarker[];

    @Output() mapIsLoaded: EventEmitter<{ spatialReference?: SpatialReference }> = new EventEmitter<{ spatialReference?: SpatialReference }>();

    operatore: Utente;

    map: Map;
    view: any = null;

    chiamateInCorsoFeatureLayer: FeatureLayer;
    chiamateMarkersGraphics = [];

    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

    constructor(private http: HttpClient,
                private modalService: NgbModal,
                private store: Store,
                private configModal: NgbModalConfig) {
        configModal.backdrop = 'static';
        configModal.keyboard = false;
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
                // Inizializzazione dei layer lato client delle chiamate in corso
                this.initializeChiamateInCorsoLayer().then(() => {
                    // Abilito il click su mappa per avviare la chiamata dal punto selezionato
                    // TODO: togliere il commento per abilitare la Nuova Chiamata al click e finire logica
                    // this.onClickNuovaChiamata().then();
                    // Aggiungo i Chiamate Markers
                    if (changes?.chiamateMarkers?.currentValue && this.map && this.chiamateInCorsoFeatureLayer) {
                        const markersChiamate = changes?.chiamateMarkers?.currentValue;
                        this.addChiamateMarkersToLayer(markersChiamate).then();
                    }
                    // Inizializzazione dei widget sulla mappa
                    this.initializeWidget().then(() => {
                        // @ts-ignore
                        this.mapIsLoaded.emit({ spatialReference: this.map.initialViewProperties.spatialReference });

                        // TODO: togliere commento (funzionante)
                        // this.addHereItaliaMapImageLayer().then();

                        // Nasconde il layer HERE_ITALIA
                        this.toggleLayer('HERE_ITALIA').then();
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
            },
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

    // Apre il modale con il Form Chiamata
    async onClickNuovaChiamata(): Promise<any> {
        this.view.on('click', (event) => {
            const check = document.getElementById('idCheck');
            // @ts-ignore
            if (check && !check.checked) {
                return;
            }

            const lat = event.mapPoint.latitude;
            const lon = event.mapPoint.longitude;

            // Inserisco il marker Chiamata in Corso
            const p: number[] = [lon, lat];
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
                    idChiamataMarker: makeIdChiamata(this.operatore)
                }
            });
            addChiamataMarker(this.chiamateInCorsoFeatureLayer, graphic).then(() => {
                // Apro il modale con FormChiamata
                const modalNuovaChiamata = this.modalService.open(ModalNuovaChiamataComponent, {
                    windowClass: 'xxlModal modal-holder',
                });
                modalNuovaChiamata.componentInstance.lat = lat;
                modalNuovaChiamata.componentInstance.lon = lon;
                modalNuovaChiamata.componentInstance.address = null; // TODO: trovare indirizzo tramite lat e long

                modalNuovaChiamata.result.then((result: any) => {
                    console.log('modalNuovaChiamata result', result);
                });
                this.changeCenter([lon, lat]);
            });

            async function addChiamataMarker(chiamateInCorsoFeatureLayer: FeatureLayer, g: Graphic): Promise<any> {
                await chiamateInCorsoFeatureLayer.applyEdits({ addFeatures: [g] });
            }

        });
        return this.view.when();
    }

    // Inizializza i layer "Chiamate in Corso"
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

        this.map.add(this.chiamateInCorsoFeatureLayer);
    }

    // Aggiunge i marker delle chiamate in corso al layer "Chiamate in Corso"
    async addChiamateMarkersToLayer(chiamateMarkers: ChiamataMarker[], applyEdits?: boolean): Promise<any> {
        if (this.chiamateMarkersGraphics?.length) {
            await this.chiamateInCorsoFeatureLayer.applyEdits({ deleteFeatures: this.chiamateMarkersGraphics });
        }

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
            await this.chiamateInCorsoFeatureLayer.source.addMany(chiamateMarkersGraphicsToAdd);
        } else if (applyEdits) {
            await this.chiamateInCorsoFeatureLayer.applyEdits({ addFeatures: chiamateMarkersGraphicsToAdd });
        }

        this.chiamateMarkersGraphics = chiamateMarkersGraphicsToAdd;
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
        // Altre possibili posizioni standard o manuale
        // "bottom-leading"|"bottom-left"|"bottom-right"|"bottom-trailing"|"top-leading"|"top-left"|"top-right"|"top-trailing"|"manual"
        this.view.ui.add(llExpand, 'top-right');
        this.view.ui.add(leExpand, 'top-right');
        this.view.ui.add(bgExpand, 'top-right');
        this.view.ui.add(search, {
            position: 'top-left',
            index: 0, // cosi indico la posizione che deve avere nella ui
        });

        // Widget per disegnare sulla mappa
        // const graphicsLayer = new GraphicsLayer();
        // this.map.add(graphicsLayer);
        //
        // const sketch = new Sketch({
        //     layer: graphicsLayer,
        //     view: this.view,
        //     // graphic will be selected as soon as it is created
        //     creationMode: 'update'
        // });
        //
        // this.view.ui.add(sketch, 'top-right');
    }

    // Aggiunge il MapImageLayer chiamato "Here Italia"
    async addHereItaliaMapImageLayer(): Promise<any> {
        const portalMapImageLayerHereItalia = new PortalItem({
            id: '21029042105b4ffb86de33033786dfc8'
        });
        const layerTest = new MapImageLayer({
            portalItem: portalMapImageLayerHereItalia
        });
        this.map.add(layerTest);
    }

    // Effettua il toggle di un layer
    async toggleLayer(layerTitle: string): Promise<any> {
        const layerExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
        if (layerExists) {
            this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = !this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible;
        }
    }

    // TODO: capire dove, e se, usarlo
    // Rimuove un intero layer dalla mappa
    // async removeLayer(layerTitle: string): Promise<any> {
    //     const layerToRemoveExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
    //     if (layerToRemoveExists) {
    //         this.map.allLayers.toArray().filter((l: Layer) => l.title !== layerTitle);
    //     }
    // }
}
