import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import {
    GetFiltriRichieste,
    SetFiltroSelezionatoRichieste,
    ResetFiltriSelezionatiRichieste,
    ClearFiltroSelezionatoRichieste,
    SetFiltroTipologiaSelezionatoRichieste,
    ClearFiltroTipologiaSelezionatoRichieste,
    ClearAllFiltriTipologiaSelezionatiRichieste,
    ApplyFiltriTipologiaSelezionatiRichieste
} from '../../actions/filterbar/filtri-richieste.actions';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { HomeState } from '../home.state';
import { _isStatico } from '../../../../../shared/helper/function-filtro';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { GetListaRichieste } from '../../actions/richieste/richieste.actions';
import produce from 'immer';
import { VociFiltroDefault } from '../../../../../shared/enum/voci-filtro-default.enum';

export interface FiltriRichiesteStateModel {
    filtriStaticiRichieste: VoceFiltro[];
    filtriRichieste: VoceFiltro[];
    filtriRichiesteSelezionati: VoceFiltro[];
    categoriaFiltriRichieste: string[];
    filtriTipologiaSelezionati: VoceFiltro[];
}

export const filtriRichiesteStateDefaults: FiltriRichiesteStateModel = {
    filtriStaticiRichieste: [
        { codice: VociFiltroDefault.Aperte, categoria: 'Aperte', descrizione: 'Aperte', name: 'includiRichiesteAperte', star: true, statico: true },
        { codice: VociFiltroDefault.Chiuse, categoria: 'Chiuse', descrizione: 'Chiuse', name: 'includiRichiesteChiuse', star: true, statico: true }
    ],
    filtriRichieste: [],
    filtriRichiesteSelezionati: [
        { codice: VociFiltroDefault.Aperte, categoria: 'Aperte', descrizione: 'Aperte', name: 'includiRichiesteAperte', star: true, statico: true }
    ],
    categoriaFiltriRichieste: [],
    filtriTipologiaSelezionati: []
};

@State<FiltriRichiesteStateModel>({
    name: 'filtriRichieste',
    defaults: filtriRichiesteStateDefaults
})
export class FiltriRichiesteState {

    constructor(private store: Store) {
    }

    @Selector()
    static filtriTipologie(state: FiltriRichiesteStateModel) {
        return state.filtriRichieste;
    }

    @Selector()
    static categoriaFiltriTipologie(state: FiltriRichiesteStateModel) {
        return state.categoriaFiltriRichieste;
    }

    @Selector()
    static filtriRichiesteSelezionati(state: FiltriRichiesteStateModel) {
        return state.filtriRichiesteSelezionati;
    }

    @Selector()
    static filtriTipologiaSelezionati(state: FiltriRichiesteStateModel) {
        return state.filtriTipologiaSelezionati;
    }

    @Action(GetFiltriRichieste)
    getFiltriRichieste({ getState, patchState }: StateContext<FiltriRichiesteStateModel>) {
        const state = getState();

        const filtriStatici: VoceFiltro[] = state.filtriStaticiRichieste;
        const tipologie: Tipologia[] = this.store.selectSnapshot(HomeState.tipologie);
        const filtriRichieste: VoceFiltro[] = [...filtriStatici];

        if (tipologie && tipologie.length > 0) {
            tipologie.forEach(tipologia => {
                filtriRichieste.push(new VoceFiltro(tipologia.codice, tipologia.categoria, tipologia.descrizione, tipologia.star));
            });
        }

        const categorie: string[] = [];
        filtriRichieste.forEach(filtro => {
            if (categorie.indexOf(filtro.categoria) < 0 && !filtro.star) {
                categorie.push(filtro.categoria);
            }
        });

        patchState({
            ...state,
            filtriRichieste: filtriRichieste,
            categoriaFiltriRichieste: categorie
        });
    }

    @Action(SetFiltroSelezionatoRichieste)
    setFiltroSelezionato({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroSelezionatoRichieste) {
        const state = getState();
        if (_isStatico(state.filtriStaticiRichieste, action.filtro)) {
            const filtroStaticoSelezionato = state.filtriRichiesteSelezionati && state.filtriRichiesteSelezionati.filter((f: VoceFiltro) => f.categoria === action.filtro.categoria)[0];
            if (filtroStaticoSelezionato) {
                setState(
                    patch({
                        filtriRichiesteSelezionati: removeItem<VoceFiltro>(filtro => filtro.codice === filtroStaticoSelezionato.codice)
                    })
                );
            }
            setState(
                patch({
                    filtriRichiesteSelezionati: insertItem<VoceFiltro>(action.filtro)
                })
            );
        } else {
            setState(
                patch({
                    filtriRichiesteSelezionati: insertItem<VoceFiltro>(action.filtro)
                })
            );
        }
        dispatch(new GetListaRichieste());
    }

    @Action(ClearFiltroSelezionatoRichieste)
    clearFiltroSelezionatoRichieste({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: ClearFiltroSelezionatoRichieste) {
        setState(
            patch({
                filtriRichiesteSelezionati: removeItem<VoceFiltro>(filtro => filtro.codice === action.filtro.codice)
            })
        );
        dispatch(new GetListaRichieste());
    }

    @Action(SetFiltroTipologiaSelezionatoRichieste)
    setFiltroTipologiaSelezionatoRichieste({ setState }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroTipologiaSelezionatoRichieste) {
        setState(
            patch({
                filtriTipologiaSelezionati: insertItem<VoceFiltro>(action.filtro)
            })
        );
    }

    @Action(ClearFiltroTipologiaSelezionatoRichieste)
    clearFiltroTipologiaSelezionatoRichieste({ setState }: StateContext<FiltriRichiesteStateModel>, action: ClearFiltroTipologiaSelezionatoRichieste) {
        setState(
            patch({
                filtriTipologiaSelezionati: removeItem<VoceFiltro>(filtro => filtro.codice === action.filtro.codice)
            })
        );
    }

    @Action(ApplyFiltriTipologiaSelezionatiRichieste)
    applyFiltriTipologiaSelezionatiRichieste({ getState, setState, dispatch }: StateContext<FiltriRichiesteStateModel>) {
        const filtriTipologiaSelezionati = getState().filtriTipologiaSelezionati;
        setState(
            produce(getState(), draft => {
                draft.filtriRichiesteSelezionati = draft.filtriRichiesteSelezionati.filter((f: VoceFiltro) => f.statico);
                for (const filtroTipologia of filtriTipologiaSelezionati) {
                    draft.filtriRichiesteSelezionati.push(filtroTipologia);
                }
            })
        );
        dispatch(new GetListaRichieste());
    }

    @Action(ClearAllFiltriTipologiaSelezionatiRichieste)
    clearAllFiltriTipologiaSelezionatiRichieste({ patchState }: StateContext<FiltriRichiesteStateModel>) {
        patchState({
            filtriTipologiaSelezionati: []
        });
    }

    @Action(ResetFiltriSelezionatiRichieste)
    resetFiltriSelezionati({ setState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: ResetFiltriSelezionatiRichieste) {
        setState(filtriRichiesteStateDefaults);
        dispatch([
            new GetFiltriRichieste()
        ]);
        if (!action.options || !action.options.preventGetList) {
            dispatch([
                new GetListaRichieste()
            ]);
        }
    }
}
