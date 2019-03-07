import { Component, OnDestroy } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapsFiltroState } from '../../../store/states/maps/maps-filtro.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetFiltroMarker } from '../../../store/actions/maps/maps-filtro.actions';
import { MarkerFiltro } from '../../../../../shared/interface/marker-filtro.interface';

@Component({
    selector: 'app-maps-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css']
})
export class MapsFiltroComponent implements OnDestroy {
    subscription = new Subscription();

    @Select(MapsFiltroState.filtroMarker) filtroMarker$: Observable<MarkerFiltro[]>;
    filtroMarker: MarkerFiltro[];


    constructor(private store: Store,
                config: NgbDropdownConfig) {
        this.subscription.add(this.filtroMarker$.subscribe((filtro: MarkerFiltro[]) => this.filtroMarker = filtro));
        config.placement = 'bottom-right';
        config.autoClose = false;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSelected(selected: string) {
        this.store.dispatch(new SetFiltroMarker(selected));
    }

}
