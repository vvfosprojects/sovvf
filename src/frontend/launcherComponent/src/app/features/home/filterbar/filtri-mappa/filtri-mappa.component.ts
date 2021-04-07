import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetFiltroMarker } from '../../store/actions/maps/maps-filtro.actions';
import { MarkerFiltro } from '../../../../shared/interface/marker-filtro.interface';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltriMappaComponent {

    @Input() filtroMarker: MarkerFiltro[];

    constructor(private store: Store) {
    }

    onSelected(selected): void {
        this.store.dispatch(new SetFiltroMarker(selected));
    }
}
