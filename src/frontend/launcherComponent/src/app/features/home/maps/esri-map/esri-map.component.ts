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

    markersDaStampare = [
        {
            id: '1',
            descrizioneOperatore: 'Mario Rossi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.53, 41.893],
                indirizzo: 'Via di Prova'
            }
        },
        {
            id: '2',
            descrizioneOperatore: 'Mario Verdi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.52, 41.897],
                indirizzo: 'Via di Prova 2'
            }
        },
        {
            id: '3',
            descrizioneOperatore: 'Francesco Rossi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.51, 41.8939],
                indirizzo: 'Via di Prova 3'
            }
        },
        {
            id: '4',
            descrizioneOperatore: 'Francesco Maria',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.515, 41.897],
                indirizzo: 'Via di Prova 4'
            }
        },
        {
            id: '5',
            descrizioneOperatore: 'Maria Verde',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.524, 41.892],
                indirizzo: 'Via di Prova 5'
            }
        },
    ];

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

            const [FeatureLayer, GraphicsLayer, SimpleMarkerSymbol, Point, Graphic, PopupTemplate] = await loadModules(['esri/layers/FeatureLayer', 'esri/layers/GraphicsLayer', 'esri/symbols/SimpleMarkerSymbol', 'esri/geometry/Point', 'esri/Graphic', 'esri/PopupTemplate']);
            const layer = new FeatureLayer({
                source: [],  // autocast as a Collection of new Graphic()
                objectIdField: 'ObjectID'
            });


            const clusterConfig = {
                type: 'cluster',
                clusterRadius: '100px',
                // {cluster_count} is an aggregate field containing
                // the number of features comprised by the cluster
                popupTemplate: {
                    title: 'Cluster summary',
                    content: 'Test',
                },
                clusterMinSize: '24px',
                clusterMaxSize: '60px',
                labelingInfo: [{
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')'
                    },
                    symbol: [],
                    labelPlacement: 'center-center',
                }]
            };


            for (const markerDaStampare of this.markersDaStampare) {
                const long = markerDaStampare.localita.coordinate[0];
                const lat = markerDaStampare.localita.coordinate[1];
                const mp = new Point(long, lat);
                const symbol = {
                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                    url: '/assets/img/icone-markers/richieste/ns/chiamata.png',
                    width: '46px',
                    height: '64px'  // pixels
                    // geometry: mp
                };

                const graphic = new Graphic({
                    geometry: mp,
                    symbol
                });

                layer.source.push(graphic);
                clusterConfig.labelingInfo[0].symbol.push(symbol);
            }


            /*const features = [
                {
                    attributes: {
                        ObjectID: 1,
                        DepArpt: 'KATL',
                        MsgTime: Date.now(),
                        FltId: 'UAL1'
                    }
                },

            ];*/


            layer.featureReduction = clusterConfig;
            // graphicsLayer.add(graphic);
            // this.map.add(graphicsLayer);
            this.map.add(layer);

        } catch (error) {
            console.error('Error in "displayMarker"', error);
        }
    }

    ngOnInit(): void {
        this.initializeMap().then();
        this.displayPopUp().then();
    }

}
