import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';
import { GetFiltriRichieste, SetFiltroSelezionatoRichieste, ResetFiltriSelezionatiRichieste, ClearFiltroSelezionatoRichieste } from '../../actions/filterbar/filtri-richieste.actions';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { HomeState } from '../home.state';
import { _isStatico } from '../../../../../shared/helper/function-filtro';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { GetListaRichieste } from '../../actions/richieste/richieste.actions';

export interface FiltriRichiesteStateModel {
    filtriStaticiRichieste: VoceFiltro[];
    filtriRichieste: VoceFiltro[];
    categoriaFiltriRichieste: string[];
    filtriRichiesteSelezionati: VoceFiltro[];
}

export const filtriRichiesteStateDefaults: FiltriRichiesteStateModel = {
    filtriStaticiRichieste: [
        { codice: '1', categoria: 'Aperte', descrizione: 'Aperte', name: 'includiRichiesteAperte', star: true },
        { codice: '2', categoria: 'Chiuse', descrizione: 'Chiuse', name: 'includiRichiesteChiuse', star: true }
    ],
    filtriRichieste: [],
    categoriaFiltriRichieste: [],
    filtriRichiesteSelezionati: [
        { codice: '1', categoria: 'Aperte', descrizione: 'Aperte', name: 'includiRichiesteAperte', star: true },
        { codice: '2', categoria: 'Chiuse', descrizione: 'Chiuse', name: 'includiRichiesteChiuse', star: true }
    ]
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

    @Action(GetFiltriRichieste)
    getFiltriRichieste({ getState, patchState }: StateContext<FiltriRichiesteStateModel>) {
        const state = getState();

        const filtriStatici: VoceFiltro[] = state.filtriStaticiRichieste;
        const tipologie: Tipologia[] = this.store.selectSnapshot(HomeState.tipologie);
        const filtriRichieste: VoceFiltro[] = [...filtriStatici];

        if (tipologie && tipologie.length > 0) {
            tipologie.forEach(tipologia => {
                filtriRichieste.push(new VoceFiltro(tipologia.codice + filtriStatici.length, tipologia.categoria, tipologia.descrizione, tipologia.star));
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

    @Action(ResetFiltriSelezionatiRichieste)
    resetFiltriSelezionati({ setState, dispatch }: StateContext<FiltriRichiesteStateModel>) {
        setState(filtriRichiesteStateDefaults);
        dispatch([
            new GetFiltriRichieste(),
            new GetListaRichieste()
        ]);
    }
}
