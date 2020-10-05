import { Component, Input } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ReducerFilterListeComposizione, RichiestaComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
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

    richiesta: SintesiRichiesta;

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;

    notFoundText = 'Nessun Filtro Trovato';

    constructor(private store: Store) {
        this.richiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione)
    }

    addFiltro(event: any, tipo: string) {
        if (event) {
            this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
            this.update();
            this.nuovaPartenza(this.richiesta);
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
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        const filtri = {
            CodiceDistaccamento: filtriSelezionati ? filtriSelezionati.CodiceDistaccamento : [],
            TipoMezzo: filtriSelezionati ? filtriSelezionati.TipoMezzo : [],
            StatoMezzo: filtriSelezionati ? filtriSelezionati.StatoMezzo : [],
            CodiceMezzo: codiceMezzo ? codiceMezzo : '',
            CodiceSquadre: codiceSquadra ? codiceSquadra : [],
            idRichiesta: richiestaComposizione ? richiestaComposizione.id : null
        } as FiltriComposizione;

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

    // richiamare la action
    nuovaPartenza(richiesta: SintesiRichiesta) {
        this.store.dispatch(new SetMarkerRichiestaSelezionato(richiesta.id));
        this.store.dispatch(new RichiestaComposizione(richiesta)); //questo quiiiiii
    }
}
