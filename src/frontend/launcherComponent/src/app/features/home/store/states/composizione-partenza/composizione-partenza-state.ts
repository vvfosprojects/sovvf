import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import {
    AddFiltroSelezionatoComposizione,
    GetFiltriComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione,
    SetFiltriComposizione
} from '../../actions/composizione-partenza/filterbar-composizione.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ComposizionePartenzaStateModel } from './composizione-partenza-state';
import { FilterbarService } from '../../../../../core/service/comp-partenza-service/filterbar-composizione-service/filterbar.service';
import { RichiestaComposizione, TerminaComposizione } from '../../actions/composizione-partenza/richiesta-composizione.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ComposizioneMarker } from '../../../maps/maps-model/composizione-marker.model';
import { GetListeCoposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ViewComponentState } from '../view/view.state';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { GetPreAccoppiati } from '../../actions/composizione-partenza/pre-accoppiati.actions';

export interface ComposizionePartenzaStateModel {
    filtri: any;
    codiceDistaccamento: any[];
    codiceTipoMezzo: any[];
    codiceStatoMezzo: any[];
    richiesta: SintesiRichiesta;
}

export const ComposizioneStateDefaults: ComposizionePartenzaStateModel = {
    filtri: null,
    codiceDistaccamento: [],
    codiceTipoMezzo: [],
    codiceStatoMezzo: [],
    richiesta: null
};


@State<ComposizionePartenzaStateModel>({
    name: 'composizionePartenza',
    defaults: ComposizioneStateDefaults
})

export class ComposizionePartenzaState {

    @Selector()
    static filtri(state: ComposizionePartenzaStateModel) {
        return state.filtri;
    }

    @Selector()
    static filtriSelezionati(state: ComposizionePartenzaStateModel) {
        return {
            'CodiceDistaccamento': state.codiceDistaccamento,
            'CodiceTipoMezzo': state.codiceTipoMezzo,
            'CodiceStatoMezzo': state.codiceStatoMezzo
        };
    }

    @Selector()
    static richiestaComposizione(state: ComposizionePartenzaStateModel): SintesiRichiesta {
        return state.richiesta;
    }

    @Selector()
    // Todo: verificare se serve
    static richiestaComposizioneMarker(state: ComposizionePartenzaStateModel): ComposizioneMarker[] {
        let composizioneMarkers: ComposizioneMarker[] = [];
        if (state.richiesta !== ComposizioneStateDefaults.richiesta) {
            const composizioneMarker = new ComposizioneMarker(
                state.richiesta.id, state.richiesta.localita, state.richiesta.tipologie, null,
                state.richiesta.priorita, state.richiesta.stato, true, false);
            composizioneMarkers.push(composizioneMarker);
        } else {
            composizioneMarkers = [];
        }
        return composizioneMarkers;
    }

    constructor(private filterbar: FilterbarService,
                private store: Store) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<ComposizionePartenzaStateModel>) {

        this.filterbar.getFiltri().subscribe((filtri: any) => {
            dispatch(new SetFiltriComposizione(filtri));

        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));

    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: SetFiltriComposizione) {
        patchState({
            filtri: action.filtri
        });

        const state = getState();
        // TODO: aggiungere composizioneMode allo stato
        const composizioneMode = Composizione.Avanzata;
        if (composizioneMode === Composizione.Avanzata) {
            const objFiltriSelezionati = {
                'CodiceDistaccamento': state.codiceDistaccamento,
                'CodiceTipoMezzo': state.codiceTipoMezzo,
                'CodiceStatoMezzo': state.codiceStatoMezzo
            };
            dispatch(new GetListeCoposizioneAvanzata(objFiltriSelezionati));
        } else if (composizioneMode === Composizione.Veloce) {
            // TODO: da rivedere
            // dispatch(new GetPreAccoppiati());
        }
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: AddFiltroSelezionatoComposizione) {
        console.log('Filtro selezionato', action.filtro);
        // const state = ctx.getState();
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: insertItem(action.filtro)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: insertItem(action.filtro)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: insertItem(action.filtro)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltroSelezionatoComposizione)
    removeFiltroSelezionatoComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: RemoveFiltroSelezionatoComposizione) {
        console.log('Filtro deselezionato', action.filtro);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(filtro => filtro === action.filtro)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: removeItem(filtro => filtro === action.filtro)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: removeItem(filtro => filtro === action.filtro)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltriSelezionatiComposizione)
    removeFiltriSelezionatiComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: RemoveFiltriSelezionatiComposizione) {
        console.log('Filtro deselezionati', action.tipo);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: []
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: []
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: []
                    })
                );
                break;
        }
    }

    @Action(RichiestaComposizione)
    richiestaComposizione({ getState, patchState }: StateContext<ComposizionePartenzaStateModel>, action: RichiestaComposizione) {
        const state = getState();
        patchState({
            ...state,
            richiesta: action.richiesta
        });
    }

    @Action(TerminaComposizione)
    terminaComposizione({ getState, patchState }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        patchState({
            ...state,
            richiesta: ComposizioneStateDefaults.richiesta
        });
    }
}
