import { Component, OnInit } from '@angular/core';
import { MapsFiltroService, Menu } from '../../maps/maps-ui/filtro/maps-filtro.service';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css']
})
export class FiltriMappaComponent implements OnInit {

    markerMenu: Menu[] = [];
    selectedMarker = [];

    constructor(private markerService: MarkerService,
                private mapsFiltroService: MapsFiltroService) {
    }

    ngOnInit() {
        this.mapsFiltroService.getVociMenu()
            .pipe(map(x => x.filter(y => !y.disabled)))
            .subscribe((res) => {
                this.markerMenu = res;
                this.selectedMarker = [this.markerMenu[0].id];
            });
    }

    onSelected(selected) {
        const index = this.markerMenu.findIndex(obj => obj.id === selected);
        if (this.selectedMarker.includes(selected)) {
            this.markerMenu[index].isActive = false;
            this.selectedMarker.splice(this.selectedMarker.indexOf(selected), 1);
        } else {
            this.markerMenu[index].isActive = true;
            this.selectedMarker.push(selected);
            if (this.markerMenu.length === this.selectedMarker.length) {
                this.selectedMarker = [];
                this.markerMenu.forEach(r => r.isActive = false);
            }
        }
        // console.log(this.selectedMarker);
        this.mapsFiltroService.sendMenu(this.selectedMarker);
    }

}
