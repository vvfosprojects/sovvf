import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import {
    AddFiltroSelezionatoComposizione,
    ReducerFilterListeComposizione,
    RemoveFiltriSelezionatiComposizione
} from '../../../store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../store/states/composizione-partenza/composizione-partenza.state';
import { MezziComposizioneState } from '../../../../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../../../../shared/store/states/squadre-composizione/squadre-composizione.state';
import { TurnOffComposizione, SwitchComposizione } from '../../../store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../store/states/view/view.state';
import { Observable } from 'rxjs';
import { FiltriComposizione } from '../../interface/filtri/filtri-composizione-interface';
import { iconaStatiClass } from '../../../../../shared/helper/composizione-functions';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent {

    @Input() filtri: any;
    @Input() disableComposizioneMode: boolean;

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;

    notFoundText = 'Nessun Filtro Trovato';

    constructor(private store: Store) {
    }

    addFiltro(event: any, tipo: string) {
        if (event) {
            this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
            this.update();
        }
    }

    clearFiltri(tipo: string) {
        this.store.dispatch(new RemoveFiltriSelezionatiComposizione(tipo));
        this.update();
    }

    update() {
        const filtriSelezionati = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati);
        const codiceMezzo = this.store.selectSnapshot(MezziComposizioneState.idMezzoSelezionato);
        const codiceSquadra = this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate);
        const filtri: FiltriComposizione = {
            CodiceDistaccamento: filtriSelezionati ? filtriSelezionati.CodiceDistaccamento : [],
            TipoMezzo: filtriSelezionati ? filtriSelezionati.TipoMezzo : [],
            StatoMezzo: filtriSelezionati ? filtriSelezionati.StatoMezzo : [],
            CodiceMezzo: codiceMezzo ? codiceMezzo : '',
            CodiceSquadre: codiceSquadra ? codiceSquadra : [],
            idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id
        };

        this.store.dispatch(new ReducerFilterListeComposizione(filtri));
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

}
