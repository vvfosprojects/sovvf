import {Component, Input, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { MapsFiltroState } from '../../store/states/maps/maps-filtro.state';
import { SetFiltroMarker } from '../../store/actions/maps/maps-filtro.actions';
import { MarkerFiltro } from '../../../../shared/interface/marker-filtro.interface';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css']
})
export class FiltriMappaComponent implements OnDestroy {

    @Input() nightMode: boolean;

    subscription = new Subscription();

    @Select(MapsFiltroState.filtroMarker) filtroMarker$: Observable<MarkerFiltro[]>;
    filtroMarker: MarkerFiltro[];


    constructor(private store: Store) {
        this.getFiltroMarker();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getFiltroMarker(): void {
        this.subscription.add(this.filtroMarker$.subscribe((filtro: MarkerFiltro[]) => {
            this.filtroMarker = filtro;
        }));
    }

    onSelected(selected): void {
        this.store.dispatch(new SetFiltroMarker(selected));
    }

}
