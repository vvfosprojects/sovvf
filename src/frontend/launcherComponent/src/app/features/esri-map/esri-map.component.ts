import { ElementRef, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit {

    mapView: esri.MapView;
    map: esri.Map;

    @Output() mapLoaded = new EventEmitter<boolean>();

    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

    /**
     * @private _zoom sets map zoom
     * @private _center sets map center
     * @private _basemap sets type of map
     */
        // tslint:disable-next-line:variable-name
    private _zoom: number;
    // tslint:disable-next-line:variable-name
    private _center: number[];
    // tslint:disable-next-line:variable-name
    private _basemap: string;

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

    markerDaStampare = {
        id: '1',
        descrizioneOperatore: 'Mario Rossi',
        codiceSedeOperatore: 'RM.1000',
        localita: {
            coordinate: [12.53, 41.893],
            indirizzo: 'Via di Prova'
        }
    };

    constructor() {
    }

    async initializeMap(): Promise<any> {
        try {
            // setDefaultOptions({ version: '4.13' });
            const [EsriMap, EsriMapView] = await loadModules([
                'esri/Map',
                'esri/views/MapView'
            ]);

            // Set type of map
            const mapProperties: esri.MapProperties = {
                basemap: this._basemap
            };

            this.map = new EsriMap(mapProperties);

            // Set type of map view
            const mapViewProperties: esri.MapViewProperties = {
                container: this.mapViewEl.nativeElement,
                center: this._center,
                zoom: this._zoom,
                map: this.map
            };

            this.mapView = new EsriMapView(mapViewProperties);

            // All resources in the MapView and the map have loaded.
            // Now execute additional processes
            this.mapView.when(() => {
                this.mapLoaded.emit(true);
            });
        } catch (error) {
            console.error('Error in "initializeMap"', error);
        }

    }

    async displayPopUp(): Promise<any> {
        try {
            const [Locator] = await loadModules(['esri/tasks/Locator']);
            const locatorTask = new Locator({
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
            });

            this.mapView.popup.autoOpenEnabled = false;
            this.mapView.on('click', (event) => {
                // Get the coordinates of the click on the view
                const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

                this.mapView.popup.open({
                    // Set the popup's title to the coordinates of the location
                    title: 'Coordinate: [' + lon + ', ' + lat + ']',
                    location: event.mapPoint, // Set the location of the popup to the clicked location
                });

                const params = {
                    location: event.mapPoint,
                };

                // Display the popup
                // Execute a reverse geocode using the clicked location
                locatorTask
                    .locationToAddress(params)
                    .then((response) => {
                        // If an address is successfully found, show it in the popup's content
                        this.mapView.popup.content = response.address;
                    })
                    .catch(() => {
                        // If the promise fails and no result is found, show a generic message
                        this.mapView.popup.content =
                            'No address was found for this location';
                    });
            });
        } catch (error) {
            console.error('Error in "displayPopUp"', error);
        }
    }

    async displayMarker(): Promise<any> {
        try {

            const [GraphicsLayer, SimpleMarkerSymbol, Point, Graphic] = await loadModules(['esri/layers/GraphicsLayer', 'esri/symbols/SimpleMarkerSymbol', 'esri/geometry/Point', 'esri/Graphic']);
            const long = this.markerDaStampare.localita.coordinate[0];
            const lat = this.markerDaStampare.localita.coordinate[1];
            const mp = new Point(long, lat);
            const symbol = {
                type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                style: 'square',
                color: 'blue',
                size: '8px',  // pixels
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 0],
                    width: 3  // points
                },
                geometry: mp
            };
            const graphicsLayer = new GraphicsLayer({
                graphics: [symbol]
            });
            this.map.add(graphicsLayer);
        } catch (error) {
            console.error('Error in "displayMarker"', error);
        }
    }

    ngOnInit(): void {
        this.initializeMap().then();
        this.displayPopUp().then();
    }

}
