import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapsFiltroService } from '../../maps/maps-ui/filtro/maps-filtro.service';

@Component({
    selector: 'app-marker-meteo-switch',
    templateUrl: './marker-meteo-switch.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./marker-meteo-switch.component.css']
})
export class MarkerMeteoSwitchComponent implements OnInit {

    stateSwitch: boolean;

    constructor(private mapsFiltroService: MapsFiltroService) {
        this.stateSwitch = this.mapsFiltroService.meteoSwitchDefault;
        this.mapsFiltroService.getMeteoSwitch().subscribe((res) => {
            this.stateSwitch = res;
        });
    }

    ngOnInit() {
    }

    onChange(event) {
        this.mapsFiltroService.sendMeteoSwitch(event);
    }

    returnColor(): string {
        return this.stateSwitch ? '#007bff' : '#fff';
    }

}
