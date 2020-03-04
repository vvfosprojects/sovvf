import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';
import { makeAreaMappaEsri } from '../../../../shared/helper/function';
import { MapService } from '../service/map-service/map-service.service';
import { MarkerService } from '../service/marker-service/marker-service.service';
import esri = __esri;
import Extent = __esri.geometry.Extent;
import GraphicsLayer = __esri.GraphicsLayer;

@Component({
    selector: 'app-esri',
    templateUrl: './esri.component.html',
    styleUrls: ['./esri.component.css']
})
export class EsriComponent implements OnInit, OnChanges, OnDestroy {

    @Input() richiesteMarkers: Array<RichiestaMarker>;

    @Output() mapLoadedEvent = new EventEmitter<boolean>();

    // The <div> where we will place the map
    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

    /**
     * _zoom sets map zoom
     * _center sets map center
     * _basemap sets type of map
     * _loaded provides map loaded status
     */
    private _zoom = 10;
    private _center: Array<number> = [0.1278, 51.5074];
    private _basemap = 'streets';
    private _loaded = false;
    private _view: esri.MapView = null;
    private _extent = null;
    private _EsriMap = null;
    private _EsriMapView = null;
    private _EsriGraphicsLayer = null;
    private _EsriGraphic = null;
    private _EsriWebMercatorUtils = null;
    private _EsriWatchUtils = null;
    private _layerChiamate: GraphicsLayer = null;

    get mapLoaded(): boolean {
        return this._loaded;
    }

    @Input()
    set zoom(zoom: number) {
        this._zoom = zoom;
    }

    get zoom(): number {
        return this._zoom;
    }

    @Input()
    set center(center: Array<number>) {
        this._center = center;
    }

    get center(): Array<number> {
        return this._center;
    }

    @Input()
    set basemap(basemap: string) {
        this._basemap = basemap;
    }

    get basemap(): string {
        return this._basemap;
    }

    constructor(private mapService: MapService,
                private markerService: MarkerService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.richiesteMarkers && changes.richiesteMarkers.currentValue) {
            if (this._layerChiamate) {
                this._layerChiamate.removeAll();
            }
            this.richiesteMarkers.forEach((rMarker: RichiestaMarker) => {
                const markerChiamata = {
                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                    url: this.iconaRichiestaMarkerSelezionato(rMarker.id) + rMarker.iconUrl.url,
                    width: rMarker.iconUrl.width,
                    height: rMarker.iconUrl.height
                };
                const point = {
                    type: 'point', // autocasts as new Point()
                    longitude: rMarker.localita.coordinate.longitudine,
                    latitude: rMarker.localita.coordinate.latitudine
                };
                const graphic = new this._EsriGraphic({
                    attributes: rMarker,
                    geometry: point,
                    symbol: markerChiamata
                });
                this._layerChiamate.add(graphic);
            });
        }
    }

    async initializeMap() {
        try {
            // Load the modules for the ArcGIS API for JavaScript
            [this._EsriMap, this._EsriMapView, this._EsriGraphicsLayer, this._EsriGraphic, this._EsriWebMercatorUtils, this._EsriWatchUtils] = await loadModules([
                'esri/Map',
                'esri/views/MapView',
                'esri/layers/GraphicsLayer',
                'esri/Graphic',
                'esri/geometry/support/webMercatorUtils',
                'esri/core/watchUtils'
            ]);

            // Configure the Map
            const mapProperties: esri.MapProperties = {
                basemap: this._basemap
            };

            const map: esri.Map = new this._EsriMap(mapProperties);

            // LAYER
            this._layerChiamate = new this._EsriGraphicsLayer({
                graphics: []
            });

            // Add GraphicsLayer to map
            map.add(this._layerChiamate);

            // Initialize the MapView
            const mapViewProperties: esri.MapViewProperties = {
                container: this.mapViewEl.nativeElement,
                center: this._center,
                zoom: this._zoom,
                map: map
            };

            this._view = new this._EsriMapView(mapViewProperties);
            await this._view.when(() => {
                this._extent = this._EsriWebMercatorUtils.webMercatorToGeographic(this._view.extent);
                this.areaCambiata(this._extent);
            });
            return this._view;
        } catch (error) {
            console.log('EsriLoader: ', error);
        }
    }

    ngOnInit() {
        // Initialize MapView and return an instance of MapView
        this.initializeMap().then(mapView => {
            // The map has been initialized
            if (this._view) {
                console.log('mapView ready: ', this._view.ready);
                this._loaded = this._view.ready;
                this.mapLoadedEvent.emit(true);

                mapView.on('pointer-move', function (evt) {
                    const screenPoint = {
                        x: evt.x,
                        y: evt.y
                    };
                    mapView.hitTest(screenPoint)
                        .then(function (response) {
                            if (response.results && response.results.length > 0) {
                                console.log('response', response);
                            }
                        });
                });
            }
        });
    }

    ngOnDestroy() {
        if (this._view) {
            // destroy the map view
            this._view.container = null;
        }
    }

    areaCambiata(extent: Extent): void {
        this.mapService.setArea(makeAreaMappaEsri(extent));
    }

    iconaRichiestaMarkerSelezionato(id: string): string {
        /**
         * ritorno un oggetto di tipo IconUrl con le info dell'icona da utilizzare
         */
        return this.markerService.iconaRichiestaMarkerSelezionato(id);
    }
}
