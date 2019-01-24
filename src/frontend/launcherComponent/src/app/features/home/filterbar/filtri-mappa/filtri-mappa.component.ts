import { Component, OnInit } from '@angular/core';
import { MapsFiltroService, Menu } from '../../maps/maps-ui/filtro/maps-filtro.service';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css']
})
export class FiltriMappaComponent implements OnInit {

    markerMenu: Menu[] = [];

    constructor(private mapsFiltroService: MapsFiltroService) {
    }

    ngOnInit() {
        this.mapsFiltroService.getVociMenu().subscribe((res) => {
            this.markerMenu = res;
        });
    }

    onSelected(selected) {
        const index = this.markerMenu.findIndex(obj => obj.id === selected);
        this.markerMenu[index].isActive =  !this.markerMenu[index].isActive;
        this.mapsFiltroService.sendMenu(this.markerMenu);
    }

}
