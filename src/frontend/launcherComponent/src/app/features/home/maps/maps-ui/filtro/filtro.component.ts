import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapsFiltroService, Menu } from './maps-filtro.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapsFiltroState } from '../../../store/states/maps/maps-filtro.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetFiltroMarker } from '../../../store/actions/maps/maps-filtro.actions';

@Component({
    selector: 'app-maps-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css']
})
export class MapsFiltroComponent implements OnInit, OnDestroy {
    subscription = new Subscription();

    @Select(MapsFiltroState.filtroMarker) filtroMarker$: Observable<Menu[]>;
    filtroMarker: Menu[];

    // markerMenu: Menu[] = [];

    constructor(private mapsFiltroService: MapsFiltroService,
                private store: Store,
                config: NgbDropdownConfig) {
        this.subscription.add(this.filtroMarker$.subscribe((filtro: Menu[]) => this.filtroMarker = filtro));
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnInit() {
        // this.mapsFiltroService.getVociMenu().subscribe((res: any) => {
        //     this.markerMenu = res;
        // });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSelected(selected: string) {
        // const index = this.markerMenu.findIndex((obj => obj.id === selected));
        // this.markerMenu[index].isActive = !this.markerMenu[index].isActive;
        // this.mapsFiltroService.sendMenu(this.markerMenu);
        this.store.dispatch(new SetFiltroMarker(selected));
    }

}
