import { Component, OnInit } from '@angular/core';
import { MeteoService } from '../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../shared/model/meteo.model';
import { Coordinate } from '../../../shared/model/coordinate.model';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {

    datimeteo: Meteo;
    /* Dati coordinate fake in attesa di quelle passate dal servizio località utente*/
    coordinate = new Coordinate(41.899940, 12.491270);
    interval: any;

    constructor(private meteoService: MeteoService) {
    }

    ngOnInit() {
        this.getMeteoData();
        this.interval = setInterval(() => {
            this.datimeteo = undefined;
            this.getMeteoData();
        }, 300000);
    }

    getMeteoData() {
        setTimeout(() => {
            this.meteoService.getMeteoData(this.coordinate)
                .subscribe(data => {
                    this.datimeteo = data;
                });
        }, 500);
    }
}
