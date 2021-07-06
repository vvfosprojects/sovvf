import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Expand from '@arcgis/core/widgets/Expand';
import Search from '@arcgis/core/widgets/Search';
import WebMap from '@arcgis/core/WebMap';
import PortalItem from '@arcgis/core/portal/PortalItem';
import EsriConfig from '@arcgis/core/config';

@Component({
    selector: 'app-esri-map',
    templateUrl: './esri-map.component.html',
    styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit, OnDestroy {

    map: Map;
    view: any = null;
    pointFound: any[];

    @Output() mapIsLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

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
                this.mapIsLoaded.emit(true);
            });
        });
        // });
    }

    ngOnDestroy(): void {
        if (this.view) {
            this.view.destroy();
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

        const basemapGallery = new BasemapGallery({
            view: this.view,
        });

        const bgExpand = new Expand({
            view: this.view,
            content: basemapGallery,
        });

        const scaleBar = new ScaleBar({
            view: this.view,
        });

        const search = new Search({
            view: this.view,
        });

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
}
