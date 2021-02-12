import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { MapsFiltroState } from '../../store/states/maps/maps-filtro.state';
import { SetFiltroMarker } from '../../store/actions/maps/maps-filtro.actions';
import { MarkerFiltro } from '../../../../shared/interface/marker-filtro.interface';
import {ImpostazioniState} from '../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css']
})
export class FiltriMappaComponent implements OnDestroy {
    subscription = new Subscription();

    @Select(MapsFiltroState.filtroMarker) filtroMarker$: Observable<MarkerFiltro[]>;
    filtroMarker: MarkerFiltro[];
    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    constructor(private store: Store) {
        this.getFiltroMarker();
        this.getNightMode();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getNightMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.nightMode = nightMode;
        })
      );
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
