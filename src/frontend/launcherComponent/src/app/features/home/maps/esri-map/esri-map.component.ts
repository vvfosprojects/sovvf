import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Point from '@arcgis/core/geometry/Point';
import Locator from '@arcgis/core/tasks/Locator';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster';
import Color from '@arcgis/core/Color';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Expand from '@arcgis/core/widgets/Expand';
import Search from '@arcgis/core/widgets/Search';
import RouteTask from '@arcgis/core/tasks/RouteTask';
import RouteParameters from '@arcgis/core/tasks/support/RouteParameters';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit, OnDestroy {

    private pCenter: Array<number> = [12.495, 41.901];
    private featureLayer: FeatureLayer;
    // private pCenter: Array<number> = [13.495, 43.901];

    public map: Map;
    public view: any = null;

    pointFound: any[];

    // The <div> where we will place the map
    @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

    markersDaStampare = [
        {
            id: '1',
            stato: 'Chiamata',
            descrizioneOperatore: 'Mario Rossi',
            codiceSedeOperatore: 'RM.1001',
            localita: {
                coordinate: [12.53, 41.893],
                indirizzo: 'Via di Prova',
            },
            note: 'Note di test',
        },
        {
            id: '2',
            stato: 'Presidiata',
            descrizioneOperatore: 'Mario Verdi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.52, 41.897],
                indirizzo: 'Via di Prova 2',
            },
            note: 'Note di test 2',
        },
        {
            id: '3',
            stato: 'Presidiata',
            descrizioneOperatore: 'Francesco Rossi',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.51, 41.8939],
                indirizzo: 'Via di Prova 3',
            },
            note: 'Note di test 3',
        },
        {
            id: '4',
            stato: 'Chiamata',
            descrizioneOperatore: 'Francesco Maria',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.515, 41.897],
                indirizzo: 'Via di Prova 4',
            },
            note: 'Note di test 4',
        },
        {
            id: '5',
            stato: 'Chiamata',
            descrizioneOperatore: 'Maria Verde',
            codiceSedeOperatore: 'RM.1000',
            localita: {
                coordinate: [12.524, 41.892],
                indirizzo: 'Via di Prova 5',
            },
            note: 'Note di test 5',
        },
    ];

    ngOnInit(): any {
        // Initialize MapView and return an instance of MapView
        this.initializeMap().then(() => {
            this.addLayer().then();
            this.addWidget().then();
            this.displayPopUp().then();

            // this.calculateRoute();
        });
    }

    calculateRoute = () => {

        const pointPartenza = {
            type: 'point', // autocasts as new Point()
            x: this.markersDaStampare[1].localita.coordinate[0],
            y: this.markersDaStampare[1].localita.coordinate[1],
        };

        const pointDestinazione = {
            type: 'point', // autocasts as new Point()
            x: this.markersDaStampare[0].localita.coordinate[0],
            y: this.markersDaStampare[0].localita.coordinate[1],
        };

        const points = [pointPartenza, pointDestinazione];
        // Point the URL to a valid routing service
        const routeTask = new RouteTask({
            url: 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
        });

        // The stops and route result will be stored in this layer

        const routeLayer = new GraphicLayer();
        this.map.add(routeLayer);

        // Setup the route parameters
        const routeParams = new RouteParameters({
            // An authorization string used to access the routing service
            // @ts-ignore
            stops: new FeatureSet(),
            outSpatialReference: {
                // autocasts as new SpatialReference()
                wkid: 3857,
            },
        });

        // Define the symbology used to display the stops
        const stopSymbol = {
            type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
            style: 'cross',
            size: 15,
            outline: {
                // autocasts as new SimpleLineSymbol()
                width: 4,
            },
        };

        // Define the symbology used to display the route
        const routeSymbol = {
            type: 'simple-line', // autocasts as SimpleLineSymbol()
            color: [0, 0, 255, 0.5],
            width: 5,
        };

        // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
        // this.view.on('click', addStop);

        let index = 0;
        for (const p of points) {
            const element = points[index];

            // const stop = new Graphic({
            //     geometry: element,
            //     symbol: stopSymbol,
            // });
            // routeLayer.add(stop);

            // Execute the route task if 2 or more stops are input
            // @ts-ignore
            routeParams.stops.features.push(stop);
            // @ts-ignore
            if (routeParams.stops.features.length >= 2) {
                // @ts-ignore
                routeTask.solve(routeParams).then(showRoute);
            }
            index = index + 1;
        }

        // Adds the solved route to the map as a graphic
        function showRoute(data): void {
            const routeResult = data.routeResults[0].route;
            routeResult.symbol = routeSymbol;
            routeLayer.add(routeResult);
        }
    }

    initializeMap(): Promise<any> {
        const container = this.mapViewEl.nativeElement;

        this.map = new Map({
            basemap: 'streets-navigation-vector',
        });

        const view = new MapView({
            container,
            map: this.map,
            center: this.pCenter,
            zoom: 12,
            highlightOptions: {
                color: '#CDD6DD',
            },
        });

        this.view = view;
        return this.view.when();

        /*map: new WebMap({
            portalItem: {
              id: 'ID webmap creata sul portale',
            },
          }),*/
    }

    async changeCenter(center): Promise<any> {
        this.view.center = center;
    }

    async changeZoom(zoom): Promise<any> {
        this.view.zoom = zoom;
    }

    async addLayer(): Promise<any> {
        // configurazione del cluster
        const clusterConfig: FeatureReductionCluster = {
            // simbolo univoco del cluster, a prescindere dalle sue features
            symbol: {
                type: 'simple-marker',
                style: 'circle',
                color: 'green',
                size: '40px',
                outline: {
                    color: 'white',
                    width: 1,
                },
            },
            type: 'cluster',
            clusterRadius: 100,
            popupTemplate: {
                title: 'Cluster summary',
                content: 'This cluster represents {cluster_count} items.',
                fieldInfos: [
                    {
                        fieldName: 'cluster_count',

                        // @ts-ignore
                        format: {
                            places: 0,
                            digitSeparator: true,
                        },
                    },
                ],
            },
            clusterMinSize: 50,
            clusterMaxSize: 90,
            labelingInfo: [
                {
                    deconflictionStrategy: 'none',
                    labelExpressionInfo: {
                        expression: 'Text($feature.cluster_count, \'#,###\')',
                    },
                    symbol: {
                        type: 'text',
                        color: new Color('white'),
                        // @ts-ignore
                        font: {
                            weight: 'bold',
                            family: 'Noto Sans',
                            size: 12,
                        },
                    },
                    labelPlacement: 'center-center',
                },
            ],
        };

        // definisce come rappresentare graficamente ogni feature del layer in base ai types Presidiata o chiamata
        const renderer = {
            type: 'unique-value',
            field: 'codiceSedeOperatore',
            defaultSymbol: { type: 'simple-fill' },
            uniqueValueInfos: [
                {
                    value: 'RM.1000',
                    symbol: {
                        type: 'simple-marker',
                        style: 'circle',
                        color: new Color('#266DD3'),
                        size: '40px',
                        outline: {
                            color: 'white',
                            width: 1,
                        },
                    },
                },
                {
                    value: 'RM.1001',
                    symbol: {
                        type: 'picture-marker',
                        url: 'https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png',
                        width: '40px',
                        height: '40px',
                    },
                },
            ],
        };
        // creazione feature layer
        this.featureLayer = new FeatureLayer({
            title: 'Layer test',
            outFields: ['*'],
            source: [],
            objectIdField: 'ID',
            popupEnabled: true,
            labelsVisible: true,

            // @ts-ignore
            renderer,
            fields: [
                {
                    name: 'id',
                    alias: 'ID',
                    type: 'oid',
                },
                {
                    name: 'stato',
                    alias: 'Stato',
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
            popupTemplate: {
                title: 'Id: {id}',
                content:
                    '<ul><li>Stato: {stato} </li>' +
                    '<li>Note: {descrizioneOperatore} </li><ul>',
            },

            geometryType: 'point',
        });

        this.featureLayer.featureReduction = clusterConfig;

        for (const markerDaStampare of this.markersDaStampare) {
            const long = markerDaStampare.localita.coordinate[0];
            const lat = markerDaStampare.localita.coordinate[1];
            const p: any = [long, lat];
            const mp = new Point(p);
            const graphic = new Graphic({
                geometry: mp,
                attributes: {
                    ID: markerDaStampare.id,
                    STATO: markerDaStampare.stato,
                    descrizioneOperatore: markerDaStampare.descrizioneOperatore,
                    codiceSedeOperatore: markerDaStampare.codiceSedeOperatore,
                    note: markerDaStampare.note,
                },
            });

            await this.featureLayer.source.push(graphic);
        }

        /* this.featureLayer.when(async () => {
          await this.map.add(this.featureLayer);
          //qui il layer ha finito di caricarsi in mappa
        }); */
        const layerTest = new FeatureLayer({
            // URL to the service
            url: 'https://gis.dipvvf.it/portal/home/webmap/viewer.html?webmap=29744867f28e4a96ad3fdedf05482563&extent=5.7331,39.4932,21.9599,46.1473',
        });

        this.map.add(this.featureLayer);
        this.map.add(layerTest);

        // filtrare i layer in base ai suoi fields
        // this.featureLayer.definitionExpression = `descrizioneOperatore = 'Maria Verde'`;
    }

    displayPopUp(): Promise<any> {
        this.view.on('click', (event) => {
            const check = document.getElementById('idCheck');

            // @ts-ignore
            if (check && !check.checked) {
                return;
            }

            const locatorTask = new Locator({
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
            });
            this.view.popup.autoOpenEnabled = false;
            const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

            this.view.popup.open({
                title: 'Coordinate: [' + lon + ', ' + lat + ']',
                location: event.mapPoint,
            });

            const params = {
                location: event.mapPoint,
            };
            locatorTask
                .locationToAddress(params)
                .then((response) => {
                    const obj = response.attributes;
                    this.view.popup.content =
                        '<span class=\'controlSpan\'>AddNum:</span> ' +
                        obj.AddNum +
                        '<br>' +
                        '<span class=\'controlSpan\'>Addr_type:</span> ' +
                        obj.Addr_type +
                        '<br>' +
                        '<span class=\'controlSpan\'>Address:</span> ' +
                        obj.Address +
                        '<br>' +
                        '<span class=\'controlSpan\'>Block:</span> ' +
                        obj.Block +
                        '<br>' +
                        '<span class=\'controlSpan\'>City:</span> ' +
                        obj.City +
                        '<br>' +
                        '<span class=\'controlSpan\'>CountryCode:</span> ' +
                        obj.CountryCode +
                        '<br>' +
                        '<span class=\'controlSpan\'>District:</span> ' +
                        obj.District +
                        '<br>' +
                        '<span class=\'controlSpan\'>LongLabel:</span> ' +
                        obj.LongLabel +
                        '<br>' +
                        '<span class=\'controlSpan\'>Match_addr:</span> ' +
                        obj.Match_addr +
                        '<br>' +
                        '<span class=\'controlSpan\'>MetroArea:</span> ' +
                        obj.MetroArea +
                        '<br>' +
                        '<span class=\'controlSpan\'>Neighborhood:</span> ' +
                        obj.Neighborhood +
                        '<br>' +
                        '<span class=\'controlSpan\'>PlaceName:</span> ' +
                        obj.PlaceName +
                        '<br>' +
                        '<span class=\'controlSpan\'>Postal:</span> ' +
                        obj.Postal +
                        '<br>' +
                        '<span class=\'controlSpan\'>PostalExt:</span> ' +
                        obj.PostalExt +
                        '<br>' +
                        '<span class=\'controlSpan\'>Region:</span> ' +
                        obj.Region +
                        '<br>' +
                        '<span class=\'controlSpan\'>Sector:</span> ' +
                        obj.Sector +
                        '<br>' +
                        '<span class=\'controlSpan\'>ShortLabel:</span> ' +
                        obj.ShortLabel +
                        '<br>' +
                        '<span class=\'controlSpan\'>Subregion:</span> ' +
                        obj.Subregion +
                        '<br>' +
                        '<span class=\'controlSpan\'>Territory:</span> ' +
                        obj.Territory +
                        '<br>' +
                        '<span class=\'controlSpan\'>Type:</span> ' +
                        obj.Type +
                        '<br>';
                })
                .catch(() => {
                    this.view.popup.content = 'No address was found for this location';
                });
        });
        return this.view.when();
    }

    async addWidget(): Promise<any> {
        // Lista widget disponibili
        // https://developers.arcgis.com/javascript/latest/api-reference/ sotto widget

        // Utilizzo ed esempi su widget Expand
        // https://developers.arcgis.com/javascript/latest/sample-code/widgets-expand/

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

        // Utilizzo ed esempi su widget Directions
        // https://developers.arcgis.com/javascript/latest/sample-code/widgets-directions/

        // Maggiori dettagli sulla funzionalità scorporata
        // https://developers.arcgis.com/javascript/latest/find-a-route-and-directions/

        /*var directionsWidget = new Directions({
          view: this.view
        });

        var drExpand = new Expand({
          view: this.view,
          content: directionsWidget
        });*/

        // Utilizzo ed esempi su widget ScaleBar
        // https://developers.arcgis.com/javascript/latest/sample-code/widgets-scalebar/

        const scaleBar = new ScaleBar({
            view: this.view,
        });

        // Utilizzo ed esempi su widget Search
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html

        const search = new Search({
            view: this.view,
        });

        /*
        const sources = [{
          locator: new Locator({
             url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
          }),
          placeholder: "Darwin",
          maxResults: 3,
          filter: searchExtent
        }];

        const searchWidget = new Search({
          view: view,
          sources: sources
        });
         */

        const bgContentCheck = new Expand({
            expandIconClass: 'esri-icon-applications', // esempio icona https://developers.arcgis.com/javascript/latest/esri-icon-font/
            view: this.view,
            content: document.getElementById('idCheckBox'),
        });

        // Altre possibili posizioni standard o manuale
        // "bottom-leading"|"bottom-left"|"bottom-right"|"bottom-trailing"|"top-leading"|"top-left"|"top-right"|"top-trailing"|"manual"
        this.view.ui.add(llExpand, 'top-right');
        this.view.ui.add(leExpand, 'top-right');
        this.view.ui.add(bgExpand, 'top-right');
        this.view.ui.add(bgContentCheck, 'top-right');
        // this.view.ui.add(drExpand, "top-right");
        this.view.ui.add(scaleBar, 'bottom-left');
        this.view.ui.add(search, {
            position: 'top-left',
            index: 0, // cosi indico la posizione che deve avere nella ui
        });
    }

    ngOnDestroy(): void {
        if (this.view) {
            // destroy the map view
            this.view.destroy();
        }
    }


    // TEST SO115
    async onChangeIndirizzoNuovaChiamata(): Promise<void> {
        // https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=Via%2020%20sette&maxSuggestions=6

        // tslint:disable-next-line:max-line-length
        // https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=Via%2020%20Settembre%202%2C%2000184%2C%20Roma%2C%20ITA&f=json&outSR=%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D&outFields=*&magicKey=dHA9MCNsb2M9MjQ2MTg4MzcjbG5nPTY4I2huPTIjbGJzPTEwOTo0NDg5NzY3Njs3OjMwODI3ODgz&maxLocations=6

        // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-Locator.html#locationToAddress

        // @ts-ignore
        const locator = new Locator('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer');
        const indirizzo = {
            singleLine: ''
        };

        // @ts-ignore
        locator.outSpatialReference = this.map.spatialReference;
        // @ts-ignore
        console.log('outSpatialReference', this.map.spatialReference);
        // @ts-ignore
        locator.addressToLocations({ address: indirizzo }).then(async (response) => {
            this.pointFound = response;
        });
    }

    async confirmAddress(p: any): Promise<any> {
        const layer = new GraphicsLayer();
        await layer.removeAll();
        const mp = new Point(p.location);
        const graphic = new Graphic({
            geometry: mp,
        });
        layer.add(graphic);
        this.map.add(layer);
    }
}
