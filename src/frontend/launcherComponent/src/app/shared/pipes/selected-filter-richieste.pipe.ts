import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { FiltriRichiesteState } from '../../features/home/store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../../features/home/filterbar/ricerca-group/filtri-richieste/voce-filtro.model';

@Pipe({
    name: 'selectedFilterRichieste',
    pure: false
})
export class SelectedFilterRichiestePipe implements PipeTransform {

    constructor(private store: Store) {
    }

    transform(filtro: VoceFiltro, args?: any): any {
        const filtriSelezionati = this.store.selectSnapshot(FiltriRichiesteState.filtriRichiesteSelezionati);
        return filtriSelezionati && !!filtriSelezionati.filter(f => f.codice === filtro.codice)[0];
    }

}
