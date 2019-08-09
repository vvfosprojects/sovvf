import { Action, Selector, State, StateContext } from '@ngxs/store';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import {
    AddFiltroSelezionatoComposizione, ClearPartenza, ConfirmPartenze,
    GetFiltriComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione, RichiestaComposizione, SetComposizioneMode,
    SetFiltriComposizione, TerminaComposizione,
    ToggleComposizioneMode,
    UpdateListe, UpdateRichiestaComposizione
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ComposizionePartenzaStateModel } from './composizione-partenza.state';
import { FilterbarService } from '../../../../../core/service/comp-partenza-service/filterbar-composizione-service/filterbar.service';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ComposizioneMarker } from '../../../maps/maps-model/composizione-marker.model';
import { ClearComposizioneVeloce, ClearListaComposizioneVeloce, GetListaComposizioneVeloce } from '../../actions/composizione-partenza/composizione-veloce.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { ClearComposizioneAvanzata, GetListeComposizioneAvanzata, UnselectMezziAndSquadreComposizioneAvanzata } from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ClearListaMezziComposizione, ClearMezzoComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { ClearListaSquadreComposizione, ClearSquadraComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { TurnOffComposizione } from '../../actions/view/view.actions';
import { AddInLavorazione, DeleteInLavorazione } from '../../actions/richieste/richiesta-attivita-utente.actions';
import { ClearDirection } from '../../actions/maps/maps-direction.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ClearMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';

export interface ComposizionePartenzaStateModel {
    filtri: any;
    codiceDistaccamento: any[];
    codiceTipoMezzo: any[];
    codiceStatoMezzo: any[];
    richiesta: SintesiRichiesta;
    composizioneMode: Composizione;
}

export const ComposizioneStateDefaults: ComposizionePartenzaStateModel = {
    filtri: null,
    codiceDistaccamento: [],
    codiceTipoMezzo: [],
    codiceStatoMezzo: [],
    richiesta: null,
    composizioneMode: Composizione.Avanzata
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
    static richiestaComposizioneMarker(state: ComposizionePartenzaStateModel): ComposizioneMarker[] {
        let composizioneMarkers: ComposizioneMarker[] = [];
        if (state.richiesta !== ComposizioneStateDefaults.richiesta) {
            const composizioneMarker = new ComposizioneMarker(
                state.richiesta.id, state.richiesta.localita, state.richiesta.tipologie, null,
                state.richiesta.prioritaRichiesta, state.richiesta.stato, true, false);
            composizioneMarkers.push(composizioneMarker);
        } else {
            composizioneMarkers = [];
        }
        return composizioneMarkers;
    }

    constructor(private filterbar: FilterbarService,
        private compPartenzaSevice: CompPartenzaService) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        this.filterbar.getFiltri().subscribe((filtri: any) => {
            dispatch(new SetFiltriComposizione(filtri));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore GetFiltriComposizione', 'Il server web non risponde', 5)));
    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: SetFiltriComposizione) {
        patchState({
            filtri: action.filtri
        });

        const state = getState();
        const composizioneMode = state.composizioneMode;
        if (composizioneMode === Composizione.Avanzata) {
            const objFiltriSelezionati = {
                'CodiceDistaccamento': state.codiceDistaccamento,
                'CodiceTipoMezzo': state.codiceTipoMezzo,
                'CodiceStatoMezzo': state.codiceStatoMezzo
            };
            dispatch(new GetListeComposizioneAvanzata(objFiltriSelezionati));
        } else if (composizioneMode === Composizione.Veloce) {
            const objFiltriSelezionati = {
                'CodiceDistaccamento': state.codiceDistaccamento,
                'CodiceTipoMezzo': state.codiceTipoMezzo,
                'CodiceStatoMezzo': state.codiceStatoMezzo
            };
            dispatch(new GetListaComposizioneVeloce(objFiltriSelezionati));
        }
    }


    @Action(UpdateListe)
    updateListe({ getState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: UpdateListe) {
        const state = getState();
        const composizioneMode = state.composizioneMode;
        if (composizioneMode === Composizione.Avanzata) {
            dispatch(new GetListeComposizioneAvanzata(action.filtri));
        } else {
            dispatch(new GetListaComposizioneVeloce(action.filtri));
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
    richiestaComposizione({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: RichiestaComposizione) {
        const state = getState();
        dispatch(new AddInLavorazione(action.richiesta));
        patchState({
            ...state,
            richiesta: action.richiesta
        });
    }

    @Action(ToggleComposizioneMode)
    toggleComposizioneMode({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        if (state.composizioneMode === Composizione.Avanzata) {
            dispatch(new ClearListaMezziComposizione());
            dispatch(new ClearListaSquadreComposizione());
            dispatch(new UnselectMezziAndSquadreComposizioneAvanzata());
            patchState({
                composizioneMode: Composizione.Veloce
            });
        } else {
            dispatch(new ClearListaComposizioneVeloce());
            patchState({
                composizioneMode: Composizione.Avanzata
            });
        }
    }

    @Action(SetComposizioneMode)
    setComposizioneMode({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: SetComposizioneMode) {
        patchState({
            composizioneMode: action.compMode
        });
    }

    @Action(UpdateRichiestaComposizione)
    updateRichiestaComposizione({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: UpdateRichiestaComposizione) {
        patchState({
            richiesta: action.richiesta
        });
    }

    @Action(ConfirmPartenze)
    confirmPartenze({ patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: ConfirmPartenze) {
        // console.log('Request confirm partenze', action.partenze);
        this.compPartenzaSevice.confermaPartenze(action.partenze).subscribe(() => {
            // console.log('Richiesta aggiornata con le partenze', action.partenze);
            dispatch(new ClearMarkerRichiestaSelezionato());
        });
    }

    @Action(TerminaComposizione)
    terminaComposizione({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        dispatch([
            new DeleteInLavorazione(state.richiesta),
            new ClearDirection(),
            new GetInitCentroMappa(),
            new ClearComposizioneVeloce(),
            new ClearComposizioneAvanzata(),
            new ClearMezzoComposizione(),
            new ClearSquadraComposizione(),
            new ClearPartenza()
        ]);
        patchState({
            richiesta: ComposizioneStateDefaults.richiesta
        });
    }

    @Action(ClearPartenza)
    clearPartenza({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState(ComposizioneStateDefaults);
    }
}
