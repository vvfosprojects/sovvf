import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ReducerFilterListeComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { MezziComposizioneState } from '../../store/states/mezzi-composizione/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../store/states/squadre-composizione/squadre-composizione.state';
import { TurnOffComposizione, SwitchComposizione } from '../../../features/home/store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable } from 'rxjs';
import { FiltriComposizione } from '../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { iconaStatiClass } from '../../helper/composizione-functions';
import { AddFiltroSelezionatoComposizione, RemoveFiltriSelezionatiComposizione } from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { FiltriComposizioneState } from '../../store/states/filtri-composizione/filtri-composizione.state';

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
        const filtriSelezionati = this.store.selectSnapshot(FiltriComposizioneState.filtriSelezionati);
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
