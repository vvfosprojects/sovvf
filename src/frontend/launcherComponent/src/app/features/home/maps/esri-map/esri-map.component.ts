import {
    Component,
    ViewChild,
    ElementRef,
    OnDestroy,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
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

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnChanges, OnDestroy {

    map: Map;
    view: any = null;
    chiamateInCorsoFeatureLayer: FeatureLayer;

    @Input() pCenter: CentroMappa;
    @Input() chiamateMarkers: ChiamataMarker[];

    @Output() mapIsLoaded: EventEmitter<{ spatialReference?: SpatialReference }> = new EventEmitter<{ spatialReference?: SpatialReference }>();

    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

    constructor(private http: HttpClient) {
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
                    // Aggiungo i Chiamate Markers
                    if (changes?.chiamateMarkers?.currentValue && this.map && this.chiamateInCorsoFeatureLayer) {
                        const markersChiamate = changes?.chiamateMarkers?.currentValue;
                        this.addChiamateMarkersToLayer(markersChiamate).then();
                    }
                    // Inizializzazione dei widget sulla mappa
                    this.initializeWidget().then(() => {
                        // @ts-ignore
                        this.mapIsLoaded.emit({ spatialReference: this.map.initialViewProperties.spatialReference });

                        this.addHereItaliaMapImageLayer().then();

                        this.toggleLayer('HERE_ITALIA').then();
                    });
                });
            });
            // });
        } else if (changes?.pCenter?.currentValue && this.map) {
            const newPCenter = changes.pCenter.currentValue;
            const center = [newPCenter.coordinateCentro.longitudine, newPCenter.coordinateCentro.latitudine];
            this.changeCenter(center).then(() => {
                const zoom = newPCenter.zoom;
                this.changeZoom(zoom).then();
            });
        }
        // Aggiungo i Chiamate Markers
        if (changes?.chiamateMarkers?.currentValue && this.map && this.chiamateInCorsoFeatureLayer) {
            const markersChiamate = changes?.chiamateMarkers?.currentValue;
            this.addChiamateMarkersToLayer(markersChiamate, true).then();
        }
    }

    ngOnDestroy(): void {
        if (this.view) {
            this.view.destroy();
        }
    }

    // Effettua il login automatico ad ESRI senza doverlo fare manualmente ogni volta
    // TODO: terminare login automatico
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
        this.view.center = center;
    }

    // Modifica lo zoom della mappa
    async changeZoom(zoom: number): Promise<any> {
        this.view.zoom = zoom;
    }

    // Inizializza i layer lato client delle chiamate in corso
    async initializeChiamateInCorsoLayer(): Promise<any> {
        // creazione feature layer
        this.chiamateInCorsoFeatureLayer = new FeatureLayer({
            title: 'Chiamate in Corso',
            outFields: ['*'],
            source: [],
            objectIdField: 'ID',
            popupEnabled: true,
            labelsVisible: true,
            fields: [
                {
                    name: 'id',
                    alias: 'ID',
                    type: 'string',
                }
            ],
            popupTemplate: {
                title: 'Id: {id}',
                content: '<h1>aaa => {id}</h1>'
            },
            geometryType: 'point'
        });
        this.map.add(this.chiamateInCorsoFeatureLayer);
    }

    // Aggiunge i marker delle chiamate in corso al layer "Chiamate in Corso"
    async addChiamateMarkersToLayer(chiamateMarkers: ChiamataMarker[], applyEdits?: boolean): Promise<any> {
        console.log('addChiamateMarkersToLayer chiamateMarkers', chiamateMarkers);
        const graphicsToAdd = [];
        for (const markerDaStampare of chiamateMarkers) {
            const long = markerDaStampare.localita.coordinate.longitudine;
            const lat = markerDaStampare.localita.coordinate.latitudine;
            const p: any = [long, lat];
            const mp = new Point(p);
            const graphic = new Graphic({
                geometry: mp,
                attributes: {
                    ID: markerDaStampare.id
                },
            });
            graphicsToAdd.push(graphic);
        }
        if (!applyEdits) {
            this.chiamateInCorsoFeatureLayer.source.addMany(graphicsToAdd);
        } else if (applyEdits) {
            await this.chiamateInCorsoFeatureLayer.applyEdits({ addFeatures: graphicsToAdd });
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

    // Per fare il toggle di un intero layer (se è attivato lo disattivo, se è disattivato lo attivo)
    async toggleLayer(layerTitle: string): Promise<any> {
        const layerExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
        if (layerExists) {
            this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible = !this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0].visible;
        }
    }

    // Rimuove un intero layer dalla mappa
    async removeLayer(layerTitle: string): Promise<any> {
        const layerToRemoveExists = !!(this.map.allLayers.toArray().filter((l: Layer) => l.title === layerTitle)[0]);
        if (layerToRemoveExists) {
            this.map.allLayers.toArray().filter((l: Layer) => l.title !== layerTitle);
        }
    }
}
