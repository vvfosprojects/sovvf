import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { _isStatico } from '../../../../../shared/helper/function-filtro';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { GetListaRichieste } from '../../actions/richieste/richieste.actions';
import {
    ApplyFiltriTipologiaSelezionatiRichieste,
    ClearFiltriTipologiaSelezionatiRichieste,
    ClearFiltroSelezionatoRichieste,
    ClearFiltroSenzaEsecuzione,
    ClearFiltroTipologiaSelezionatoRichieste,
    GetFiltriRichieste,
    RemoveChiuseRichiesta,
    RemovePeriodoChiuse,
    RemoveSelezioneStatoRichiesta,
    ResetFiltriSelezionatiRichieste,
    SetChiuseRichiesta,
    SetFiltroBoxRichieste,
    SetFiltroSelezionatoRichieste,
    SetFiltroTipologiaSelezionatoRichieste,
    SetPeriodoChiuse,
    SetSelezioneStatoRichiesta
} from '../../actions/filterbar/filtri-richieste.actions';
import { Injectable } from '@angular/core';
import produce from 'immer';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import { TipologiaRichiesta } from '../../../../../shared/enum/tipologiaRichiesta.enum';
import { TipologieState } from '../../../../../shared/store/states/tipologie/tipologie.state';
import { FiltroPeriodoChiuse } from '../../../../../shared/interface/filtro-chiuse-dettaglio.interface';

export interface FiltriRichiesteStateModel {
    filtriStaticiRichieste: VoceFiltro[];
    statiRichiesta: VoceFiltro[];
    selezioneStatoRichiesta: string[];
    filtriRichiesteChiuse: VoceFiltro[];
    chiuse: string[];
    periodoChiuseChiamate: FiltroPeriodoChiuse;
    periodoChiusiInterventi: FiltroPeriodoChiuse;
    altriFiltri: VoceFiltro[];
    filtriRichieste: VoceFiltro[];
    filtriRichiesteSelezionati: VoceFiltro[];
    categoriaFiltriRichieste: string[];
    filtriTipologiaSelezionati: VoceFiltro[];
    filtriStatoRichiesteSelezionati: StatoRichiesta[];
    disableFiltri: boolean;
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
        },
    ],
    statiRichiesta: [
        {
            categoria: 'StatiRichiesta',
            codice: 'Assegnata',
            descrizione: 'Assegnati',
            name: 'assegnati',
            star: true,
            statico: true,
        },
        {
            categoria: 'StatiRichiesta',
            codice: 'Sospesa',
            descrizione: 'Sospesi',
            name: 'sospesi',
            star: true,
            statico: true,
        },
        {
            categoria: 'StatiRichiesta',
            codice: 'Presidiata',
            descrizione: 'Presidiati',
            name: 'presidiati',
            star: true,
            statico: true,
        }],
    selezioneStatoRichiesta: [],
    filtriRichiesteChiuse: [
        {
            categoria: 'Chiuse',
            codice: 'Chiamate chiuse',
            descrizione: 'Chiamate Chiuse',
            name: 'chiamate',
            star: true,
            statico: true,
        },
        {
            categoria: 'Chiuse',
            codice: 'Interventi chiusi',
            descrizione: 'Interventi Chiusi',
            name: 'interventi',
            star: true,
            statico: true,
        },
    ],
    periodoChiuseChiamate: {
        da: null,
        a: null,
        data: null,
        turno: null,
    },
    periodoChiusiInterventi: {
        da: null,
        a: null,
        data: null,
        turno: null,
    },
    altriFiltri: [
        {
            categoria: 'AltriFiltri',
            codice: 'ZonaEmergenza',
            descrizione: 'Zona Emergenza',
            name: 'zonaEmergenza',
            star: true,
            statico: true,
        }
    ],
    chiuse: [],
    filtriRichieste: [],
    filtriRichiesteSelezionati: [],
    categoriaFiltriRichieste: [],
    filtriTipologiaSelezionati: [],
    filtriStatoRichiesteSelezionati: [],
    disableFiltri: false,
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
        return state.filtriStaticiRichieste;
    }

    @Selector()
    static filtriStatiRichiesta(state: FiltriRichiesteStateModel): VoceFiltro[] {
        return state.statiRichiesta;
    }

    @Selector()
    static filtriRichiesteChiuse(state: FiltriRichiesteStateModel): VoceFiltro[] {
        return state.filtriRichiesteChiuse;
    }

    @Selector()
    static altriFiltri(state: FiltriRichiesteStateModel): VoceFiltro[] {
        return state.altriFiltri;
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

    @Selector()
    static periodoChiuseChiamate(state: FiltriRichiesteStateModel): any {
        return state.periodoChiuseChiamate;
    }

    @Selector()
    static periodoChiusiInterventi(state: FiltriRichiesteStateModel): any {
        return state.periodoChiusiInterventi;
    }

    @Selector()
    static disableFiltri(state: FiltriRichiesteStateModel): boolean {
        let value;
        if (state.chiuse.length) {
            state.chiuse.forEach(x => x === 'Chiamate chiuse' ? value = true : value = false);
        }
        return value;
    }

    @Selector()
    static chiuse(state: FiltriRichiesteStateModel): string[] {
        return state.chiuse;
    }

    @Selector()
    static selezioneStatoRichiesta(state: FiltriRichiesteStateModel): string[] {
        return state.selezioneStatoRichiesta;
    }

    @Action(GetFiltriRichieste)
    getFiltriRichieste({ getState, patchState }: StateContext<FiltriRichiesteStateModel>): void {
        const state = getState();

        const filtriStatici: VoceFiltro[] = state.filtriStaticiRichieste;
        const tipologie: Tipologia[] = this.store.selectSnapshot(TipologieState.tipologie);
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

    @Action(ClearFiltroSenzaEsecuzione)
    clearFiltroSenzaEsecuzione({ getState, setState }: StateContext<FiltriRichiesteStateModel>, action: ClearFiltroSelezionatoRichieste): void {
        const state = getState();
        const filtroStaticoSelezionato = state.filtriRichiesteSelezionati && state.filtriRichiesteSelezionati.filter((f: VoceFiltro) => f.categoria !== 'AltriFiltri' && f.categoria !== 'StatiRichiesta' && f.categoria !== 'Chiuse')[0];
        if (filtroStaticoSelezionato && filtroStaticoSelezionato.categoria) {
            setState(
                patch({
                    filtriRichiesteSelezionati: removeItem<VoceFiltro>(filtro => filtro.categoria === filtroStaticoSelezionato.categoria),
                })
            );
        }
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

    @Action(SetPeriodoChiuse)
    setPeriodoChiuse({ patchState }: StateContext<FiltriRichiesteStateModel>, action: any): void {
        const periodoChiuse = {
            da: action.periodo.da,
            a: action.periodo.a,
            data: action.periodo.data,
            turno: action.periodo.turno,
        };
        if (action.tipologiaRichiesta === 'Chiamate Chiuse') {
            patchState({
                periodoChiuseChiamate: periodoChiuse
            });
        } else if (action.tipologiaRichiesta === 'Interventi Chiusi') {
            patchState({
                periodoChiusiInterventi: periodoChiuse
            });
        }
    }

    @Action(RemovePeriodoChiuse)
    removePeriodoChiuse({ patchState }: StateContext<FiltriRichiesteStateModel>, action: any): void {
        const periodoChiuse = {
            da: null,
            a: null,
            data: null,
            turno: null,
        };
        if (action.tipologiaRichiesta === 'Chiamate Chiuse') {
            patchState({
                periodoChiuseChiamate: periodoChiuse
            });
        } else if (action.tipologiaRichiesta === 'Interventi Chiusi') {
            patchState({
                periodoChiusiInterventi: periodoChiuse
            });
        } else {
            patchState({
                periodoChiuseChiamate: filtriRichiesteStateDefaults.periodoChiuseChiamate,
                periodoChiusiInterventi: filtriRichiesteStateDefaults.periodoChiusiInterventi
            });
        }
    }

    @Action(SetChiuseRichiesta)
    setChiuseRichiesta({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.chiuse;
        const arrayStati = [...state.chiuse];
        if (!arrayStati.includes(singleValue)) {
            arrayStati.push(singleValue);
        }
        patchState({
            chiuse: arrayStati,
        });
    }

    @Action(RemoveChiuseRichiesta)
    removeChiuseRichiesta({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.chiuse;
        const arrayStati = [...state.chiuse];
        const arrayStatiFiltrati = arrayStati.filter(x => x !== singleValue);
        patchState({
            chiuse: arrayStatiFiltrati,
        });
    }

    @Action(SetSelezioneStatoRichiesta)
    setSelezioneStatoRichiesta({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.statoRichiesta;
        const arrayStati = [...state.selezioneStatoRichiesta];
        arrayStati.push(singleValue);
        patchState({
            selezioneStatoRichiesta: arrayStati,
        });
    }

    @Action(RemoveSelezioneStatoRichiesta)
    removeSelezioneStatoRichiesta({ getState, setState, patchState, dispatch }: StateContext<FiltriRichiesteStateModel>, action: any): void {
        const state = getState();
        const singleValue = action.statoRichiesta;
        const arrayStati = [...state.selezioneStatoRichiesta];
        const arrayStatiFiltrati = arrayStati.filter(x => x !== singleValue);
        patchState({
            selezioneStatoRichiesta: arrayStatiFiltrati,
        });
    }
}
