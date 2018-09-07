import {Component, OnInit} from '@angular/core';
import {MeteoService} from '../../../shared/meteo/meteo-service.service';
import {Meteo} from '../../../shared/model/meteo.model';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {

    datimeteo: Meteo;
    /* Dati coordinate fake in attesa di quelle passate dal servizio località utente*/
    coordinate = {
        lat: '41.53',
        lon: '12.30'
    };
    // coordinate = {
    //     lat: '45.28',
    //     lon: '9.10'
    // };

    constructor(private meteoService: MeteoService) {
    }

    ngOnInit() {
        this.meteoService.getMeteoData(this.coordinate.lat, this.coordinate.lon)
            .subscribe(data => {
                this.datimeteo = new Meteo(
                    data.weather[0].description,
                    data.weather[0].icon,
                    data.main.humidity,
                    Math.floor(data.main['temp'] * 10) / 10,
                    Math.floor(data.wind.speed * 3.6), {
                        gradi: Math.floor(data.wind['deg']),
                        cardinali: this.degToCompass(Math.floor(data.wind['deg']))
                    }
                );
            });
    }

    degToCompass(num) {
        const val = Math.floor((num / 22.5) + 0.5);
        const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        // console.log(num);
        // console.log(val);
        // console.log(arr[(val % 16)]);
        return arr[(val % 16)];
    }
}
