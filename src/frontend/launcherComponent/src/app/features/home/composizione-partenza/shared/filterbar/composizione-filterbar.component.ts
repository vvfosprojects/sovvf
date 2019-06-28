import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import {
    AddFiltroSelezionatoComposizione, GetFiltriComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione, UpdateListe
} from '../../../store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../store/states/composizione-partenza/composizione-partenza.state';
import { MezziComposizioneState } from '../../../store/states/composizione-partenza/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../../store/states/composizione-partenza/squadre-composizione.state';
import { HelperComposizione } from '../helper/_helper-composizione';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent {

    @Input() filtri: any;

    methods = new HelperComposizione();

    constructor(private store: Store) {
    }

    getFiltri() {
        this.store.dispatch(new GetFiltriComposizione());
    }

    addFiltro(event: any, tipo: string) {
        this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id, tipo));
        this.update();
        // console.log('Filtro deselezionato', event);
    }

    removeFiltro(event: any, tipo: string) {
        this.store.dispatch(new RemoveFiltroSelezionatoComposizione(event.value.id, tipo));
        this.update();
        // console.log('Filtro deselezionato', event);
    }

    clearFiltri(tipo: string) {
        this.store.dispatch(new RemoveFiltriSelezionatiComposizione(tipo));
        this.update();
        // console.log('Filtri deselezionati', tipo);
    }

    update() {
        const filtriSelezionati = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati);
        const codiceMezzo = this.store.selectSnapshot(MezziComposizioneState.idMezzoSelezionato);
        const codiceSquadra = this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate);
        const idRichiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id;
        const filtri = {
            'CodiceDistaccamento': filtriSelezionati ? filtriSelezionati.CodiceDistaccamento : [],
            'CodiceTipoMezzo': filtriSelezionati ? filtriSelezionati.CodiceTipoMezzo : [],
            'CodiceStatoMezzo': filtriSelezionati ? filtriSelezionati.CodiceStatoMezzo : [],
            'CodiceMezzo': codiceMezzo ? codiceMezzo : [],
            'CodiceSquadra': codiceSquadra ? codiceSquadra : [],
            'idRichiesta': idRichiesta
        };
        this.store.dispatch(new UpdateListe(filtri));
    }
}
