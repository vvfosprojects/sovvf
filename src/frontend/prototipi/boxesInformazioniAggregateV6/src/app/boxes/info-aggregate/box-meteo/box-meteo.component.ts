import {Component, OnInit} from '@angular/core';
import {BoxMeteoWeather} from '../../boxes-model/box-meteo-weather.model';
import {BoxMeteoService} from '../../boxes-services/box-meteo-service.service';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {

    meteoData: any;

    temperatura: number;

    constructor(private meteoService: BoxMeteoService) {
    }

    ngOnInit() {
        this.meteoService.getMeteoData().subscribe(data => {
            this.meteoData = data;
            console.log(this.meteoData);
            this.temperatura = Math.floor(this.meteoData.main.temp);
        });
    }
}
