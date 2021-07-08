import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import Search from '@arcgis/core/widgets/Search';
import WebMap from '@arcgis/core/WebMap';
import PortalItem from '@arcgis/core/portal/PortalItem';
import EsriConfig from '@arcgis/core/config';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Layer from '@arcgis/core/layers/Layer';

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit, OnDestroy {

    map: Map;
    view: any = null;
    pointFound: any[];

    @Output() mapIsLoaded: EventEmitter<{ spatialReference?: SpatialReference }> = new EventEmitter<{ spatialReference?: SpatialReference }>();

    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

    private pCenter: Array<number> = [12.495, 41.901];

    constructor(private http: HttpClient) {
    }

    ngOnInit(): any {
        // Esegue il login sul portale (da finire)
        // this.loginIntoESRI().then(() => {
        // Inizializzazione della mappa
        this.initializeMap().then(() => {
            // Inizializzazione dei widget sulla mappa
            this.initializeWidget().then(() => {
                // @ts-ignore
                this.mapIsLoaded.emit({ spatialReference: this.map.initialViewProperties.spatialReference });

                this.addLayer().then();

                this.toggleLayer('HERE_ITALIA');
            });
        });
        // });
    }

    ngOnDestroy(): void {
        if (this.view) {
            this.view.destroy();
        }
    }

    // Per fare il toggle di un intero layer (se è attivato lo disattivo, se è disattivato lo attivo)
    toggleLayer(layerTitle: string): void {
        const map = this.map;
        const mapLayers = map.allLayers.toArray();
        const layerToDelete = mapLayers.filter((l: Layer) => l.title === layerTitle)[0];
        if (layerToDelete) {
            this.map.remove(layerToDelete);
            const layerToDeleteToggled = layerToDelete;
            layerToDeleteToggled.visible = !layerToDeleteToggled.visible;
            this.map.add(layerToDeleteToggled);
        }
    }

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

    async initializeMap(): Promise<any> {
        const container = this.mapViewEl.nativeElement;

        EsriConfig.portalUrl = 'http://gis.dipvvf.it/portal/sharing/rest/portals/self?f=json&culture=it';

        const portalItem = new PortalItem({
            id: '29744867f28e4a96ad3fdedf05482563'
        });

        this.map = new WebMap({
            portalItem
        });

        this.view = new MapView({
            container,
            map: this.map,
            center: this.pCenter,
            zoom: 12,
            highlightOptions: {
                color: '#CDD6DD',
            },
        });

        return this.view.when();
    }

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

        const search = new Search({
            view: this.view,
        });
        // Altre possibili posizioni standard o manuale
        // "bottom-leading"|"bottom-left"|"bottom-right"|"bottom-trailing"|"top-leading"|"top-left"|"top-right"|"top-trailing"|"manual"
        this.view.ui.add(llExpand, 'top-right');
        this.view.ui.add(leExpand, 'top-right');
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

    async addLayer(): Promise<any> {
        const portalItem = new PortalItem({
            id: '07241d64c1404a4e94168c93efeecbed'
        });
        const layerTest = new FeatureLayer({
            portalItem
        });
        this.map.add(layerTest);
    }
}
