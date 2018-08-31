import {Component, OnInit} from '@angular/core';
import {BoxMeteoService} from '../../boxes-services/box-meteo-service.service';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent implements OnInit {

    meteoData: any;
    coordinate = {
        lat: '42',
        lon: '50'
    };
    temperatura: number;
    degrease: number;

    constructor(private meteoService: BoxMeteoService) {
    }

    ngOnInit() {
        this.meteoService.getMeteoData(this.coordinate.lat, this.coordinate.lon)
            .subscribe(data => {
                this.meteoData = data;
                // console.log(this.meteoData);
                this.temperatura = Math.floor(this.meteoData.main.temp * 10 ) / 10;
                this.degrease = Math.floor(this.meteoData.wind.deg);
            });
    }
}
