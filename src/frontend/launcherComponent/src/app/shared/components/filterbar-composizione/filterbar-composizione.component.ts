import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ReducerFilterListeComposizione, RichiestaComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { TurnOffComposizione, SwitchComposizione } from '../../../features/home/store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable } from 'rxjs';
import { iconaStatiClass } from '../../helper/composizione-functions';
import { AddFiltroSelezionatoComposizione, ResetFiltriComposizione } from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { SetMarkerRichiestaSelezionato } from 'src/app/features/home/store/actions/maps/marker.actions';

@Component({
    selector: 'app-filterbar-composizione',
    templateUrl: './filterbar-composizione.component.html',
    styleUrls: ['./filterbar-composizione.component.css']
})
export class FilterbarComposizioneComponent {

    @Input() filtri: any;
    @Input() disableComposizioneMode: boolean;
    @Input() nascondiTornaIndietro: boolean;
    @Input() nascondiCambiaComposizioneMode: boolean;

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;

    richiesta: SintesiRichiesta;
    notFoundText = 'Nessun Filtro Trovato';

    constructor(private store: Store) {
        this.richiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
    }

    addFiltro(event: any, tipo: string) {
        if (event) {
            this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
            this.nuovaPartenza(this.richiesta);
            this.update();
        } else {
            console.error('[addFiltro] Errore: nessun filtro selezionato');
        }
    }

    clearFiltri(tipo: string) {
        this.store.dispatch(new ResetFiltriComposizione(tipo));
        this.update();
    }

    update() {
        this.store.dispatch(new ReducerFilterListeComposizione());
    }

    turnOffComposizione() {
        this.store.dispatch(new TurnOffComposizione());
    }

    compPartenzaSwitch(event: Composizione) {
        this.store.dispatch(new SwitchComposizione(event));
    }

    _iconaStatiClass(statoMezzo: string): string {
        return iconaStatiClass(statoMezzo);
    }

    // richiamare la action
    nuovaPartenza(richiesta: SintesiRichiesta) {
        this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
        this.store.dispatch(new RichiestaComposizione(richiesta));
    }
}
