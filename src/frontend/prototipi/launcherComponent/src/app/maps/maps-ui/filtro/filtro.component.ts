import {Component, OnInit} from '@angular/core';
import {DataService, Menu} from './maps-filtro.service';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';
import {MarkerService} from '../../service/marker-service/marker-service.service';

@Component({
    selector: 'app-maps-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css']
})
export class MapsFiltroComponent implements OnInit {

    markerMenu: Menu[] = [];
    selectedMarker = [];

    constructor(private markerService: MarkerService,
                private dataService: DataService,
                config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        this.dataService.getVociMarker()
            .pipe(map(x => x.filter(y => !y.disabled)))
            .subscribe((res) => {
                this.markerMenu = res;
                this.selectedMarker = [this.markerMenu[0].id];
            });
    }

    onSelected(selected) {
        const index = this.markerMenu.findIndex((obj => obj.id === selected));
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
        this.markerService.filtroMarker(this.selectedMarker);
    }

}
