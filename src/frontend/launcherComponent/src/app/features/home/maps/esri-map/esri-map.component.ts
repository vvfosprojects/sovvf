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
            stato: 'Chiamata',
            descrizioneOperatore: 'Mario Rossi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.53, 41.893],
                indirizzo: 'Via di Prova'
            },
            note: 'Note di test'
        },
        {
            id: '2',
            stato: 'Presidiata',
            descrizioneOperatore: 'Mario Verdi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.52, 41.897],
                indirizzo: 'Via di Prova 2'
            },
            note: 'Note di test 2'
        },
        {
            id: '3',
            stato: 'Presidiata',
            descrizioneOperatore: 'Francesco Rossi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.51, 41.8939],
                indirizzo: 'Via di Prova 3'
            },
            note: 'Note di test 3'
        },
        {
            id: '4',
            stato: 'Chiamata',
            descrizioneOperatore: 'Francesco Maria',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.515, 41.897],
                indirizzo: 'Via di Prova 4'
            },
            note: 'Note di test 4'
        },
        {
            id: '5',
            stato: 'Chiamata',
            descrizioneOperatore: 'Maria Verde',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.524, 41.892],
                indirizzo: 'Via di Prova 5'
            },
            note: 'Note di test 5'
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

    // async displayPopUp(): Promise<any> {
    //     try {
    //         const [Locator] = await loadModules(['esri/tasks/Locator']);
    //         const locatorTask = new Locator({
    //             url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    //         });
    //
    //         this.mapView.popup.autoOpenEnabled = false;
    //         this.mapView.on('click', (event) => {
    //             // Get the coordinates of the click on the view
    //             const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    //             const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
    //
    //             this.mapView.popup.open({
    //                 // Set the popup's title to the coordinates of the location
    //                 title: 'Coordinate: [' + lon + ', ' + lat + ']',
    //                 location: event.mapPoint, // Set the location of the popup to the clicked location
    //             });
    //
    //             const params = {
    //                 location: event.mapPoint,
    //             };
    //
    //             // Display the popup
    //             // Execute a reverse geocode using the clicked location
    //             locatorTask
    //                 .locationToAddress(params)
    //                 .then((response) => {
    //                     // If an address is successfully found, show it in the popup's content
    //                     this.mapView.popup.content = response.address;
    //                 })
    //                 .catch(() => {
    //                     // If the promise fails and no result is found, show a generic message
    //                     this.mapView.popup.content =
    //                         'No address was found for this location';
    //                 });
    //         });
    //     } catch (error) {
    //         console.error('Error in "displayPopUp"', error);
    //     }
    // }

    async displayMarker(): Promise<any> {
        try {

            const [
                FeatureLayer,
                GraphicsLayer,
                SimpleMarkerSymbol,
                Point,
                Graphic,
                PopupTemplate,
                SimpleRenderer,
                SimpleFillSymbol,
                UniqueValueRenderer
            ] = await loadModules([
                'esri/layers/FeatureLayer',
                'esri/layers/GraphicsLayer',
                'esri/symbols/SimpleMarkerSymbol',
                'esri/geometry/Point',
                'esri/Graphic',
                'esri/PopupTemplate',
                'esri/renderers/SimpleRenderer',
                'esri/symbols/SimpleFillSymbol',
                'esri/renderers/UniqueValueRenderer'
            ]);


            const clusterConfig = {
                type: 'cluster',
                clusterRadius: '100px',
                // {cluster_count} is an aggregate field containing
                // the number of features comprised by the cluster
                popupTemplate: {
                    title: 'Cluster summary',
                    content: 'This cluster represents {cluster_count} items.',
                    fieldInfos: [{
                        fieldName: 'cluster_count',
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }]
                },
                clusterMinSize: '24px',
                clusterMaxSize: '60px',
                labelingInfo: [{
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')'
                    },
                    symbol: {
                        type: 'text',
                        color: '#004a5d',
                        font: {
                            weight: 'bold',
                            family: 'Noto Sans',
                            size: '12px'
                        }
                    },
                    labelPlacement: 'center-center',
                }]
            };

            // "esri/renderers/SimpleRenderer"
            // "esri/symbols/SimpleFillSymbol"
            // const citiesRenderer = new SimpleRenderer({
            //     symbol: new SimpleFillSymbol(),
            //     visualVariables: [{
            //         type: 'color',
            //         field: 'POPULATION',
            //         normalizationField: 'SQ_KM',
            //         // features with 30 ppl/sq km or below are assiged the first color
            //         stops: [{ value: 100, color: '#FFFCD4' },
            //             { value: 500, color: '#0D2644' }]
            //     }]
            // });

            const renderer3 = {
                type: 'unique-value',  // autocasts as new UniqueValueRenderer()
                field: 'STATO',
                defaultSymbol: {
                    type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                    style: 'square',
                    color: 'blue',
                    size: '8px',  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 0],
                        width: 3  // points
                    }
                },  // autocasts as new SimpleFillSymbol()
                uniqueValueInfos: [{
                    // All features with value of "North" will be blue
                    value: 'Chiamata',
                    symbol: {
                        type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                        style: 'square',
                        color: 'red',
                        size: '8px',  // pixels
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: [255, 155, 0],
                            width: 3  // points
                        }
                    }
                }, {
                    // All features with value of "East" will be green
                    value: 'Presidiata',
                    symbol: {
                        type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                        style: 'square',
                        color: 'green',
                        size: '8px',  // pixels
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 255],
                            width: 3  // points
                        }
                    }
                }
                ]
            };

            const renderer2 = new UniqueValueRenderer({
                field: 'STATO',
                defaultSymbol: {
                    type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                    style: 'square',
                    color: 'blue',
                    size: '8px',  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 0],
                        width: 3  // points
                    }
                }
            });
            // All features with value of "North" will be blue
            renderer2.addUniqueValueInfo('Chiamata',
                {
                    type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                    style: 'square',
                    color: 'green',
                    size: '8px',  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 0],
                        width: 3  // points
                    }
                }
            );
            // All features with value of "East" will be green
            renderer2.addUniqueValueInfo('Presidiata',
                {
                    type: 'simple-marker',  // autocasts as new SimpleMarkerSymbol()
                    style: 'square',
                    color: 'red',
                    size: '8px',  // pixels
                    outline: {  // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 0],
                        width: 3  // points
                    }
                }
            );

            const layer = new FeatureLayer({
                source: [],  // autocast as a Collection of new Graphic()
                objectIdField: 'ID',
                featureReduction: clusterConfig,
                renderer: renderer3,
                fields: [{
                    name: 'ID',
                    alias: 'ID',
                    type: 'oid'
                }, {
                    name: 'STATO',
                    alias: 'Stato',
                    type: 'string'
                }, {
                    name: 'note',
                    alias: 'note',
                    type: 'string'
                }, {
                    name: 'descrizioneOperatore',
                    alias: 'descrizioneOperatore',
                    type: 'string'
                }],
                /*renderer :{
                    type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                    url: '/assets/img/icone-markers/richieste/ns/chiamata.png',
                    width: '46px',
                    height: '64px'  // pixels
                    // geometry: mp
                },*/
                popupTemplate: {
                    title: '{STATO}',
                    content: '<ul><li>stato: {STATO} </li>' +
                        '<ul><li>note: {note} </li>' +
                        '<ul><li>ID: {ID} </li>' +
                        '<ul><li>descrizioneOperatore: {descrizioneOperatore} </li><ul>'
                },

                geometryType: 'point'
            });

            // const symbol = {
            //     type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
            //     url: '/assets/img/icone-markers/richieste/ns/chiamata.png',
            //     width: '46px',
            //     height: '64px'  // pixels
            //     // geometry: mp
            // };

            /*
            {
                    title: '{STATO}',
                    content: '<ul><li>stato: {STATO} </li>' +
                        '<ul><li>note: {note} </li>' +
                        '<ul><li>ID: {ID} </li>' +
                        '<ul><li>descrizioneOperatore: {descrizioneOperatore} </li><ul>'
                }
                */


            for (const markerDaStampare of this.markersDaStampare) {
                const long = markerDaStampare.localita.coordinate[0];
                const lat = markerDaStampare.localita.coordinate[1];
                const mp = new Point(long, lat);
                const template = markerDaStampare.stato === 'Chiamata' ?
                    {
                        // autocasts as new PopupTemplate()
                        title: '{ID} in {STATO}',
                        content: [
                            {
                                type: 'fields',
                                fieldInfos: [
                                    {
                                        fieldName: 'STATO',
                                        label: 'stato'
                                    }
                                ]
                            }
                        ]
                    } : {
                        // autocasts as new PopupTemplate()
                        title: '{ID} o {STATO}',
                        content: [
                            {
                                type: 'fields',
                                fieldInfos: [
                                    {
                                        fieldName: 'STATO',
                                        label: 'stato'
                                    }, {
                                        fieldName: 'descrizioneOperatore',
                                        label: 'descrizioneOperatore'
                                    }
                                ]
                            }
                        ]
                    };
                const graphic = new Graphic({
                    geometry: mp,
                    /*symbol: {
                        type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                        url: '/assets/img/icone-markers/richieste/ns/chiamata.png',
                        width: '46px',
                        height: '64px'  // pixels
                        // geometry: mp
                    },*/
                    attributes: {
                        ID: markerDaStampare.id,
                        STATO: markerDaStampare.stato,
                        descrizioneOperatore: markerDaStampare.descrizioneOperatore,
                        note: markerDaStampare.note,
                    },
                    // popupTemplate: template
                });

                // https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html
                // https://developers.arcgis.com/javascript/latest/api-reference/esri-PopupTemplate.html

                layer.source.push(graphic);
                // clusterConfig.labelingInfo[0].symbol.push(symbol);
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


            // layer.popupTemplate = template;
            // graphicsLayer.add(graphic);
            // this.map.add(graphicsLayer);
            this.map.add(layer);

            // FILTRO SU LAYER
            // setTimeout(() => {
            //     layer.definitionExpression = 'STATO = \'Chiamata\'';
            // }, 5000);

        } catch (error) {
            console.error('Error in "displayMarker"', error);
        }
    }

    async panZoom(): Promise<any> {
        try {
            this.mapView.on('mouse-wheel', event => {
                console.log('mouse-wheel', this.mapView.extent);
            });
            this.mapView.on('drag', event => {
                console.log('drag', this.mapView.extent);
            });
        } catch (error) {
            console.error('Error in "panZoom"', error);
        }
    }

    ngOnInit(): void {
        this.initializeMap().then(() => {
            // this.displayPopUp().then();
            this.panZoom().then();
        });
    }

}
