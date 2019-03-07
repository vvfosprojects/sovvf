import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapsFiltroService, Menu } from '../../maps/maps-ui/filtro/maps-filtro.service';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { MapsFiltroState } from '../../store/states/maps/maps-filtro.state';
import { SetFiltroMarker } from '../../store/actions/maps/maps-filtro.actions';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css']
})
export class FiltriMappaComponent implements OnInit, OnDestroy {
    subscription = new Subscription();

    @Select(MapsFiltroState.filtroMarker) filtroMarker$: Observable<Menu[]>;
    filtroMarker: Menu[];

    // markerMenu: Menu[] = [];

    constructor(private store: Store,
                private mapsFiltroService: MapsFiltroService) {
        this.subscription.add(this.filtroMarker$.subscribe((filtro: Menu[]) => this.filtroMarker = filtro));
    }

    ngOnInit() {
        // this.mapsFiltroService.getVociMenu().subscribe((res) => {
        //     this.markerMenu = res;
        // });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSelected(selected) {
        // const index = this.markerMenu.findIndex(obj => obj.id === selected);
        // this.markerMenu[index].isActive = !this.markerMenu[index].isActive;
        // this.mapsFiltroService.sendMenu(this.markerMenu);
        this.store.dispatch(new SetFiltroMarker(selected));
    }

}
