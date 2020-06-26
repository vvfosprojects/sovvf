import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import {
    AddFiltroSelezionatoComposizione,
    ClearFiltriAffini,
    ClearPartenza,
    ConfirmPartenze,
    GetFiltriComposizione,
    ReducerFilterListeComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione,
    RichiestaComposizione,
    SetComposizioneMode,
    SetFiltriComposizione,
    SetListaFiltriAffini,
    StartInvioPartenzaLoading,
    StartListaComposizioneLoading,
    StopInvioPartenzaLoading,
    StopListaComposizioneLoading,
    TerminaComposizione,
    ToggleComposizioneMode,
    UpdateListeComposizione,
    UpdateRichiestaComposizione
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ComposizioneMarker } from '../../../maps/maps-model/composizione-marker.model';
import {
    ClearComposizioneVeloce,
    ClearPreaccoppiati,
    ClearPreAccoppiatiSelezionatiComposizione,
    FilterListaPreAccoppiati,
    GetListaIdPreAccoppiati
} from '../../actions/composizione-partenza/composizione-veloce.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import {
    ClearComposizioneAvanzata,
    FilterListeComposizioneAvanzata,
    GetListeComposizioneAvanzata,
    UnselectMezziAndSquadreComposizioneAvanzata
} from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ClearListaMezziComposizione, ClearMezzoComposizione, ClearSelectedMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { ClearListaSquadreComposizione, ClearSelectedSquadreComposizione, ClearSquadraComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { AddInLavorazione, DeleteInLavorazione } from '../../actions/richieste/richiesta-attivita-utente.actions';
import { ClearDirection } from '../../actions/maps/maps-direction.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ClearMarkerMezzoSelezionato, ClearMarkerState } from '../../actions/maps/marker.actions';
import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { DescrizioneTipologicaMezzo } from '../../../composizione-partenza/interface/filtri/descrizione-filtro-composizione-interface';
import { ClearBoxPartenze } from '../../actions/composizione-partenza/box-partenza.actions';
import { GetMarkersMappa, StartLoadingAreaMappa, StopLoadingAreaMappa } from '../../actions/maps/area-mappa.actions';

export interface ComposizionePartenzaStateModel {
    filtriAffini: ListaTipologicheMezzi;
    codiceDistaccamento: any[];
    codiceTipoMezzo: any[];
    codiceStatoMezzo: any[];
    richiesta: SintesiRichiesta;
    composizioneMode: Composizione;
    loadingListe: boolean;
    loadingInvioPartenza: boolean;
    loaded: boolean;
}

export const ComposizioneStateDefaults: ComposizionePartenzaStateModel = {
    filtriAffini: {
        distaccamenti: [],
        generiMezzi: [],
        stati: []
    },
    codiceDistaccamento: [],
    codiceTipoMezzo: [],
    codiceStatoMezzo: [],
    richiesta: null,
    composizioneMode: Composizione.Avanzata,
    loadingListe: false,
    loadingInvioPartenza: false,
    loaded: null
};


@State<ComposizionePartenzaStateModel>({
    name: 'composizionePartenza',
    defaults: ComposizioneStateDefaults
})

export class ComposizionePartenzaState {

    @Selector()
    static filtriAffini(state: ComposizionePartenzaStateModel) {
        return state.filtriAffini;
    }

    @Selector()
    static filtriSelezionati(state: ComposizionePartenzaStateModel): ComposizioneFilterbar {
        return {
            CodiceDistaccamento: state.codiceDistaccamento,
            TipoMezzo: state.codiceTipoMezzo,
            StatoMezzo: state.codiceStatoMezzo
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

    @Selector()
    static loadingListe(state: ComposizionePartenzaStateModel) {
        return state.loadingListe;
    }

    @Selector()
    static loadingInvioPartenza(state: ComposizionePartenzaStateModel) {
        return state.loadingInvioPartenza;
    }

    @Selector()
    static loaded(state: ComposizionePartenzaStateModel) {
        return state.loaded;
    }

    constructor(private store: Store,
                private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const filtri = this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche);
        dispatch(new SetFiltriComposizione(filtri));
    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ getState, dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        const composizioneMode = state.composizioneMode;
        const objFiltriSelezionati: ComposizioneFilterbar = {
            CodiceDistaccamento: state.codiceDistaccamento,
            TipoMezzo: state.codiceTipoMezzo,
            StatoMezzo: state.codiceStatoMezzo
        };
        dispatch(new GetListeComposizioneAvanzata(objFiltriSelezionati));
        if (composizioneMode === Composizione.Veloce) {
            dispatch([
                new GetListaIdPreAccoppiati()
            ]);
        }
    }

    @Action(SetListaFiltriAffini)
    setListaFiltriAffini({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: SetListaFiltriAffini) {
        const filtri = this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche);
        let composizioneMezzi = null as MezzoComposizione[];
        composizioneMezzi = action.composizioneMezzi ? action.composizioneMezzi : this.store.selectSnapshot(state => state.composizioneAvanzata.listaMezziSquadre.composizioneMezzi);
        const filtriDistaccamento = [] as DescrizioneTipologicaMezzo[];
        const filtriStato = [] as DescrizioneTipologicaMezzo[];
        const generiMezzi = [] as DescrizioneTipologicaMezzo[];
        if (composizioneMezzi) {
            if (filtri.distaccamenti) {
                filtri.distaccamenti.forEach((distaccamento: DescrizioneTipologicaMezzo) => {
                    if (checkDistaccamento(distaccamento)) {
                        filtriDistaccamento.push(distaccamento);
                    }
                });
            }
            if (filtri.stati) {
                filtri.stati.forEach((stato: DescrizioneTipologicaMezzo) => {
                    if (checkStato(stato)) {
                        filtriStato.push(stato);
                    }
                });
            }
            if (filtri.generiMezzi) {
                filtri.generiMezzi.forEach((genereMezzi: DescrizioneTipologicaMezzo) => {
                    if (checkGenereMezzo(genereMezzi)) {
                        generiMezzi.push(genereMezzi);
                    }
                });
            }
        }

        function checkDistaccamento(distaccamento: DescrizioneTipologicaMezzo) {
            let _return = false;
            composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.distaccamento.codice === distaccamento.id) {
                    _return = true;
                }
            });
            return _return;
        }

        function checkStato(stato: DescrizioneTipologicaMezzo) {
            let _return = false;
            composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.stato === stato.descrizione) {
                    _return = true;
                }
            });
            return _return;
        }

        function checkGenereMezzo(genereMezzo: DescrizioneTipologicaMezzo) {
            let _return = false;
            composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.genere === genereMezzo.descrizione) {
                    _return = true;
                }
            });
            return _return;
        }

        patchState({
            filtriAffini: {
                distaccamenti: filtriDistaccamento,
                generiMezzi: generiMezzi,
                stati: filtriStato
            }
        });
    }

    @Action(ClearFiltriAffini)
    clearFiltriAffini({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState({
            filtriAffini: ComposizioneStateDefaults.filtriAffini
        });
    }

    @Action(UpdateListeComposizione)
    updateListe({ dispatch }: StateContext<ComposizionePartenzaStateModel>, action: UpdateListeComposizione) {
        console.warn('UpdateListeComposizione');
        dispatch(new GetListeComposizioneAvanzata(action.filtri));
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: AddFiltroSelezionatoComposizione) {
        console.log('Filtro selezionato => #ID = ' + action.id + ' - TIPO = ' + action.tipo);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: insertItem(action.id)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: insertItem(action.id)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: insertItem(action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltroSelezionatoComposizione)
    removeFiltroSelezionatoComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: RemoveFiltroSelezionatoComposizione) {
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltriSelezionatiComposizione)
    removeFiltriSelezionatiComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: RemoveFiltriSelezionatiComposizione) {
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

    @Action(ReducerFilterListeComposizione)
    reducerFilterListeComposizione({ getState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: ReducerFilterListeComposizione) {
        const state = getState();
        const compMode = state.composizioneMode;
        if (compMode === Composizione.Avanzata) {
            dispatch(new FilterListeComposizioneAvanzata(action.filtri));
        } else if (compMode === Composizione.Veloce) {
            dispatch(new FilterListaPreAccoppiati(action.filtri));
        }
    }

    @Action(RichiestaComposizione)
    richiestaComposizione({ patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: RichiestaComposizione) {
        patchState({
            richiesta: action.richiesta
        });
        dispatch(new AddInLavorazione(action.richiesta));
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
            dispatch(new ClearPreaccoppiati());
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
    confirmPartenze({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: ConfirmPartenze) {
        dispatch(new StartInvioPartenzaLoading());
        this.compPartenzaService.confermaPartenze(action.partenze).subscribe(() => {
            const state = getState();
            if (state.composizioneMode === Composizione.Avanzata) {
                dispatch([
                    new ClearBoxPartenze(),
                    new ClearSelectedMezziComposizione(),
                    new ClearSelectedSquadreComposizione(),
                    new UnselectMezziAndSquadreComposizioneAvanzata(),
                    new ClearListaMezziComposizione(),
                    new ClearListaSquadreComposizione()
                ]);
            } else if (state.composizioneMode === Composizione.Veloce) {
                dispatch([
                    new ClearPreAccoppiatiSelezionatiComposizione(),
                    new ClearPreaccoppiati()
                ]);
            }
            dispatch([
                new StopInvioPartenzaLoading(),
                new ClearMarkerMezzoSelezionato(),
                new ClearDirection(),
                new GetListeComposizioneAvanzata()
            ]);
        }, () => {
            dispatch(new StopInvioPartenzaLoading());
        });
    }

    @Action(TerminaComposizione)
    terminaComposizione({ getState, dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        dispatch([
            new DeleteInLavorazione(state.richiesta),
            new ClearDirection(),
            new GetInitCentroMappa(),
            new ClearComposizioneVeloce(),
            new ClearComposizioneAvanzata(),
            new ClearMezzoComposizione(),
            new ClearSquadraComposizione(),
            new ClearPartenza(),
            new ClearMarkerState(),
        ]);
    }

    @Action(ClearPartenza)
    clearPartenza({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState(ComposizioneStateDefaults);
    }

    @Action(StartListaComposizioneLoading)
    startListaComposizioneLoading({ dispatch, patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState({
            loadingListe: true,
            loaded: false
        });
        dispatch(new StartLoadingAreaMappa());
    }

    @Action(StopListaComposizioneLoading)
    stopListaComposizioneLoading({ dispatch, patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState({
            loadingListe: false,
            loaded: true
        });
        dispatch([new StopLoadingAreaMappa(), new GetMarkersMappa()]);
    }

    @Action(StartInvioPartenzaLoading)
    startInvioPartenzaLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState({
            loadingInvioPartenza: true
        });
    }

    @Action(StopInvioPartenzaLoading)
    stopInvioPartenzaLoading({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState({
            loadingInvioPartenza: false
        });
    }
}
