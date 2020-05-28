import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { FiltriRichiesteState } from '../../features/home/store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../../features/home/filterbar/filtri-richieste/voce-filtro.model';

@Pipe({
    name: 'selectedFilterTipologiaRichieste',
    pure: false
})
export class SelectedFilterTipologiaRichiestePipe implements PipeTransform {

    constructor(private store: Store) {
    }

    transform(filtro: VoceFiltro, args?: any): any {
        const filtriTipologiaSelezionati = this.store.selectSnapshot(FiltriRichiesteState.filtriTipologiaSelezionati);
        return filtriTipologiaSelezionati && !!filtriTipologiaSelezionati.filter(f => f.codice === filtro.codice)[0];
    }

}
