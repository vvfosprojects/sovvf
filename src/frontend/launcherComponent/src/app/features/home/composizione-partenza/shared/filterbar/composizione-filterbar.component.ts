import { Component, Input } from '@angular/core';
import { FilterbarService } from '../../../../../core/service/comp-partenza-service/filterbar-composizione-service/filterbar.service';
import { Store } from '@ngxs/store';
import {
    AddFiltroSelezionatoComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione
} from '../../../store/actions/composizione-partenza/filterbar-composizione.actions';
import { ComposizionePartenzaState } from '../../../store/states/composizione-partenza/composizione-partenza-state';
import { MezziComposizioneState } from '../../../store/states/composizione-partenza/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../../store/states/composizione-partenza/squadre-composizione.state';
import { GetListeCoposizioneAvanzata } from '../../../store/actions/composizione-partenza/composizione-avanzata.actions';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent {

    @Input() filtri: any;

    constructor(private filterbarService: FilterbarService,
                private store: Store) {
        this.getFiltri();
    }

    iconaStatiClass(stato: string) {
        let returnClass = '';

        switch (stato) {
            case 'In Sede':
                returnClass = 'text-secondary';
                break;
            case 'In Viaggio':
                returnClass = 'text-info';
                break;
            case 'In Rientro':
                returnClass = 'text-primary';
                break;
            case 'Sul Posto':
                returnClass = 'text-success';
                break;

            default:
                break;
        }

        return returnClass;
    }

    getFiltri() {
        this.filterbarService.getFiltri().subscribe(() => {
        });
    }

    addFiltro(event: any, tipo: string) {
        this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id, tipo));
        // console.log('Filtro deselezionato', event);
    }

    removeFiltro(event: any, tipo: string) {
        this.store.dispatch(new RemoveFiltroSelezionatoComposizione(event.value.id, tipo));
        // console.log('Filtro deselezionato', event);
    }

    clearFiltri(tipo: string) {
        this.store.dispatch(new RemoveFiltriSelezionatiComposizione(tipo));
        // console.log('Filtri deselezionati', tipo);
    }

    dropdownClosed() {
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
        this.store.dispatch(new GetListeCoposizioneAvanzata(filtri));
    }
}
