import {Component, OnInit} from '@angular/core';
import {MapsFiltroService, Menu} from './maps-filtro.service';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-maps-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css']
})
export class MapsFiltroComponent implements OnInit {

    markerMenu: Menu[] = [];

    constructor(private mapsFiltroService: MapsFiltroService,
                config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.mapsFiltroService.getVociMenu().subscribe((res: any) => {
            this.markerMenu = res;
        });
    }

    onSelected(selected: any) {
        const index = this.markerMenu.findIndex((obj => obj.id === selected));
        this.markerMenu[index].isActive =  !this.markerMenu[index].isActive;
        this.mapsFiltroService.sendMenu(this.markerMenu);
    }

}
