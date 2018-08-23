import {Component, OnInit} from '@angular/core';

import {SintesiRichiesta} from './model/sintesi-richiesta.model';
import {SintesiRichiesteService} from './sintesi-richieste-service/sintesi-richieste.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    mapLoaded: boolean;
    richieste: SintesiRichiesta[];

    // ESRI MAP
    // Set our map properties
    mapCenter = [12.492373, 41.890251];
    basemapType = 'streets';
    mapZoomLevel = 15;
    startMap = false;

    constructor() {
    }

    ngOnInit() {
    }

    showDettagliRicevuto(richiesta: SintesiRichiesta): void {
        console.log('Sono app.component. Vogliono vedere i dettagli di', richiesta.id);
    }

    // See app.component.html
    mapLoadedEvent(status: boolean) {
        this.mapLoaded = true;
        console.log('The map loaded: ' + status);
    }

    search(lat, long, startMapR, basemapTypeR?, mapZoomLevelR?) {
        this.mapCenter = [lat, long];
        this.basemapType = basemapTypeR ? basemapTypeR : 'streets';
        this.mapZoomLevel = mapZoomLevelR ? mapZoomLevelR : 15;
        this.startMap = startMapR ? startMapR : false;
    }

    parametriMappa(obj) {
        this.search(obj[0], obj[1], obj[2]);
    }

}
