import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import {
    AddFiltroSelezionatoComposizione,
    RemoveFiltriSelezionatiComposizione
} from '../../../store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../store/states/composizione-partenza/composizione-partenza.state';
import { MezziComposizioneState } from '../../../store/states/composizione-partenza/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../../store/states/composizione-partenza/squadre-composizione.state';
import { TurnOffComposizione, SwitchComposizione } from '../../../store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../store/states/view/view.state';
import { Observable } from 'rxjs';
import { FiltriComposizione } from '../../interface/filtri/filtri-composizione-interface';
import { iconaStatiClass } from '../functions/composizione-functions';
import { FilterListeComposizioneAvanzata } from '../../../store/actions/composizione-partenza/composizione-avanzata.actions';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent {

    @Input() filtri: any;

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;

    constructor(private store: Store) {
    }

    addFiltro(event: any, tipo: string) {
        if (event) {
            this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
            this.update();
            console.log('Filtro selezionato', event);
        }
    }

    /* removeFiltro(event: any, tipo: string) {
        this.store.dispatch(new RemoveFiltroSelezionatoComposizione(event.value.codice || event.value.id, tipo));
        this.update();
        console.log('Filtro deselezionato', event);
    } */

    clearFiltri(tipo: string) {
        this.store.dispatch(new RemoveFiltriSelezionatiComposizione(tipo));
        this.update();
        console.log('Filtri deselezionati', tipo);
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
            CodiceSquadra: codiceSquadra ? codiceSquadra : [],
            idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id
        };

        this.store.dispatch(new FilterListeComposizioneAvanzata(filtri));
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
