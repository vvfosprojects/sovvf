import {Component, OnInit} from '@angular/core';
import {BoxMeteoService} from '../../boxes-services/box-meteo-service.service';
import {BoxMeteo} from '../../boxes-model/box-meteo.model';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {

    datimeteo: BoxMeteo;
    /* Dati coordinate fake in attesa di quelle passate dal servizio località utente*/
    coordinate = {
        lat: '42.5646',
        lon: '50.4646'
    };

    constructor(private meteoService: BoxMeteoService) {
    }

    ngOnInit() {
        this.meteoService.getMeteoData(this.coordinate.lat, this.coordinate.lon)
            .subscribe(data => {
                this.datimeteo = new BoxMeteo(
                    data.weather[0].description,
                    data.weather[0].icon,
                    data.main.humidity,
                    Math.floor(data.main['temp'] * 10 ) / 10,
                    data.wind.speed,
                    Math.floor(data.wind['deg']));
            });
    }
}
