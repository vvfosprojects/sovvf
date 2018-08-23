import {Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {loadModules} from 'esri-loader';
import esri = __esri;

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

    @Output() mapLoaded = new EventEmitter<boolean>();
    @ViewChild('mapViewNode') private mapViewEl: ElementRef;

    private _localizzazioneIntervento: Array<number>;

    @Input()
    set localizzazioneIntervento(localizzazioneIntervento: Array<number>) {
        this._localizzazioneIntervento = localizzazioneIntervento;
    }

    /**
     * @private _zoom sets map zoom
     * @private _center sets map center
     * @private _basemap sets type of map
     */
    private _zoom = 10;
    private _center: Array<number>;
    private _basemap = 'dark-gray';
    private _start = false;

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
        // console.log(this.basemap);
    }

    get basemap(): string {
        return this._basemap;
    }

    @Input()
    set start(start: boolean) {
        this._start = start;
        if (this._start) {
            this.initializeMap();
        }
    }

    constructor() {
    }

    async initializeMap() {
        try {
            const [EsriMap, EsriMapView] = await loadModules([
                'esri/Map',
                'esri/views/MapView'
            ]);

            // Set type of map
            const mapProperties: esri.MapProperties = {
                basemap: this._basemap
            };

            const map: esri.Map = new EsriMap(mapProperties);

            // Set type of map view
            const mapViewProperties: esri.MapViewProperties = {
                container: this.mapViewEl.nativeElement,
                center: this._center,
                zoom: this._zoom,
                map: map
            };

            const mapView: esri.MapView = new EsriMapView(mapViewProperties);

            // All resources in the MapView and the map have loaded.
            // Now execute additional processes
            mapView.when(() => {
                this.mapLoaded.emit(true);
            });

        } catch (error) {
            console.log('We have an error: ' + error);
        }

    }

    ngOnInit() {
        this.initializeMap();
    }

}
