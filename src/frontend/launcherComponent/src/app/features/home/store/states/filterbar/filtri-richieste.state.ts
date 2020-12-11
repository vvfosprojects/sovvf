import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { HomeState } from '../home.state';
import { _isStatico } from '../../../../../shared/helper/function-filtro';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { GetListaRichieste } from '../../actions/richieste/richieste.actions';
import {
  ApplyFiltriTipologiaSelezionatiRichieste,
  ClearFiltriTipologiaSelezionatiRichieste,
  ClearFiltroSelezionatoRichieste,
  ClearFiltroTipologiaSelezionatoRichieste,
  GetFiltriRichieste,
  ResetFiltriSelezionatiRichieste,
  SetFiltroBoxRichieste,
  SetFiltroSelezionatoRichieste,
  SetFiltroTipologiaSelezionatoRichieste
} from '../../actions/filterbar/filtri-richieste.actions';
import { Injectable } from '@angular/core';
import produce from 'immer';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import {TipologiaRichiesta} from '../../../../../shared/enum/tipologiaRichiesta.enum';

export interface FiltriRichiesteStateModel {
    filtriStaticiRichieste: VoceFiltro[];
    filtriRichieste: VoceFiltro[];
    filtriRichiesteSelezionati: VoceFiltro[];
    categoriaFiltriRichieste: string[];
    filtriTipologiaSelezionati: VoceFiltro[];
    filtriStatoRichiesteSelezionati: StatoRichiesta[];
}

export const filtriRichiesteStateDefaults: FiltriRichiesteStateModel = {
    filtriStaticiRichieste: [
        {
            codice: TipologiaRichiesta.Chiamate,
            categoria: 'Chiamate',
            descrizione: 'Chiamate',
            name: 'includiChiamate',
            star: true,
            statico: true
        },
        {
            codice: TipologiaRichiesta.Interventi,
            categoria: 'Interventi',
            descrizione: 'Interventi',
            name: 'includiInterventi',
            star: true,
            statico: true
        },
        {
          codice: TipologiaRichiesta.InterventiChiamate,
          categoria: 'InterventiChiamate',
          descrizione: 'Interventi + Chiamate',
          name: 'includiInterventiChiamate',
          star: true,
          statico: true
        }
    ],
    filtriRichieste: [],
    filtriRichiesteSelezionati: [
        {
            codice: TipologiaRichiesta.InterventiChiamate,
            categoria: 'InterventiChiamate',
            descrizione: 'Interventi + Chiamate',
            name: 'includiInterventiChiamate',
            star: true,
            statico: true
        }
    ],
    categoriaFiltriRichieste: [],
    filtriTipologiaSelezionati: [],
    filtriStatoRichiesteSelezionati: [],
};

@Injectable()
@State<FiltriRichiesteStateModel>({
    name: 'filtriRichieste',
    defaults: filtriRichiesteStateDefaults
})
export class FiltriRichiesteState {

    constructor(private store: Store) {
    }

    @Selector()
    static filtriTipologie(state: FiltriRichiesteStateModel): VoceFiltro[] {
        return state.filtriRichieste;
    }

    @Selector()
    static categoriaFiltriTipologie(state: FiltriRichiesteStateModel): string[] {
        return state.categoriaFiltriRichieste;
    }

    @Selector()
    static filtriRichiesteSelezionati(state: FiltriRichiesteStateModel): VoceFiltro[] {
        return state.filtriRichiesteSelezionati;
    }

    @Selector()
    static filtriTipologiaSelezionati(state: FiltriRichiesteStateModel): VoceFiltro[] {
        return state.filtriTipologiaSelezionati;
    }

    @Selector()
    static filtriStatoRichiestaSelezionati(state: FiltriRichiesteStateModel): StatoRichiesta[] {
        return state.filtriStatoRichiesteSelezionati;
    }

    @Action(GetFiltriRichieste)
    getFiltriRichieste({ getState, patchState }: StateContext<FiltriRichiesteStateModel>): void {
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
            filtriRichieste,
            categoriaFiltriRichieste: categorie
        });
    }

    @Action(SetFiltroSelezionatoRichieste)
    setFiltroSelezionatoRichieste({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroSelezionatoRichieste): void {
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
            if (action && action.filtro) {
              this.store.dispatch(new SetFiltroBoxRichieste(action.filtro.name));
            }
        }
        dispatch(new GetListaRichieste());
    }

    @Action(ClearFiltroSelezionatoRichieste)
    clearFiltroSelezionatoRichieste({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: ClearFiltroSelezionatoRichieste): void {
        setState(
            patch({
                filtriRichiesteSelezionati: removeItem<VoceFiltro>(filtro => filtro.codice === action.filtro.codice),
            })
        );
        dispatch(new GetListaRichieste());
    }

    @Action(SetFiltroBoxRichieste)
    setFiltroBoxRichieste({ getState, setState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroBoxRichieste): void {
        const state = getState();
        let statoRichiestaEnum: StatoRichiesta = null;
        switch (action.statoRichiesta) {
            case 'chiamate':
                statoRichiestaEnum = StatoRichiesta.Chiamata;
                break;
            case 'presidiati':
                statoRichiestaEnum = StatoRichiesta.Presidiata;
                break;
            case 'assegnati':
                statoRichiestaEnum = StatoRichiesta.Assegnata;
                break;
            case 'chiusi':
                statoRichiestaEnum = StatoRichiesta.Chiusa;
                break;
          case 'sospesi':
            statoRichiestaEnum = StatoRichiesta.Sospesa;
            break;
        }
        const included = state.filtriStatoRichiesteSelezionati.includes(statoRichiestaEnum);
        if (!included) {
            setState(
                patch({
                    filtriStatoRichiesteSelezionati: insertItem<StatoRichiesta>(statoRichiestaEnum)
                })
            );
        } else {
            setState(
                patch({
                    filtriStatoRichiesteSelezionati: removeItem<StatoRichiesta>(x => x === statoRichiestaEnum)
                })
            );
        }
        // dispatch(new GetListaRichieste());
    }

    @Action(SetFiltroTipologiaSelezionatoRichieste)
    setFiltroTipologiaSelezionatoRichieste({ setState }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroTipologiaSelezionatoRichieste): void {
        setState(
            patch({
                filtriTipologiaSelezionati: insertItem<VoceFiltro>(action.filtro)
            })
        );
    }

    @Action(ClearFiltroTipologiaSelezionatoRichieste)
    clearFiltroTipologiaSelezionatoRichieste({ setState }: StateContext<FiltriRichiesteStateModel>, action: ClearFiltroTipologiaSelezionatoRichieste): void {
        setState(
            patch({
                filtriTipologiaSelezionati: removeItem<VoceFiltro>(filtro => filtro.codice === action.filtro.codice)
            })
        );
    }

    @Action(ApplyFiltriTipologiaSelezionatiRichieste)
    applyFiltriTipologiaSelezionatiRichieste({ getState, setState, dispatch }: StateContext<FiltriRichiesteStateModel>): void {
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

    @Action(ClearFiltriTipologiaSelezionatiRichieste)
    clearFiltriTipologiaSelezionatiRichieste({ patchState }: StateContext<FiltriRichiesteStateModel>): void {
        patchState({
            filtriTipologiaSelezionati: []
        });
    }

    @Action(ResetFiltriSelezionatiRichieste)
    resetFiltriSelezionatiRichieste({ setState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: ResetFiltriSelezionatiRichieste): void {
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
