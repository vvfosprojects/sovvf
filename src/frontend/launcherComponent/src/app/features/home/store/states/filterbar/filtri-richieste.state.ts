import { Action, Selector, State, StateContext } from '@ngxs/store';
import { makeCopy } from '../../../../../shared/helper/function';

// Model
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';

// Action
import { GetFiltriRichieste, SetFiltroSelezionato, ResetFiltriSelezionati } from '../../actions/filterbar/filtri-richieste.actions';

// Tipologie
import { APP_TIPOLOGIE } from 'src/app/core/settings/tipologie';


export interface FiltriRichiesteStateModel {
    filtriRichieste: VoceFiltro[];
}

export const filtriRichiesteStateDefaults: FiltriRichiesteStateModel = {
    filtriRichieste: [
        { codice: '1', categoria: 'Presidiato', descrizione: 'Presidiato', star: true, selezionato: false },
        { codice: '2', categoria: 'Presidiato', descrizione: 'Non Presidiato', star: true, selezionato: false },
        { codice: '3', categoria: 'Rilevante', descrizione: 'Rilevante', star: true, selezionato: false },
        { codice: '4', categoria: 'Rilevante', descrizione: 'Non Rilevante', star: true, selezionato: false },
    ]
};

@State<FiltriRichiesteStateModel>({
    name: 'filtriRichieste',
    defaults: filtriRichiesteStateDefaults
})
export class FiltriRichiesteState {

    constructor() {
    }

    // SELECTORS
    @Selector()
    static filtriTipologie(state: FiltriRichiesteStateModel) {
        return state.filtriRichieste;
    }

    @Selector()
    static filtriSelezionati(state: FiltriRichiesteStateModel) {
        return state.filtriRichieste.filter(f => f.selezionato === true);
    }

    // GET
    @Action(GetFiltriRichieste)
    getFiltriRichieste({ getState, patchState }: StateContext<FiltriRichiesteStateModel>) {
        const state = getState();

        const filtriRichieste: VoceFiltro[] = [];
        const filtriStatici: VoceFiltro[] = [
            new VoceFiltro('1', 'Presidiato', 'Presidiato', true),
            new VoceFiltro('2', 'Presidiato', 'Non Presidiato', true),
            new VoceFiltro('3', 'Rilevante', 'Rilevante', true),
            new VoceFiltro('4', 'Rilevante', 'Non Rilevante', true)
        ];
        filtriRichieste.push(...filtriStatici);
        APP_TIPOLOGIE.forEach(tipologie => {
            filtriRichieste.push(new VoceFiltro('' + tipologie.codice, tipologie.categoria, tipologie.descrizione, tipologie.star));
        });

        patchState({
            ...state,
            filtriRichieste: filtriRichieste
        });
    }

    // SET FILTRO SELEZIONATO (SELEZIONATO, NON-SELEZIONATO)
    @Action(SetFiltroSelezionato)
    setFiltroSelezionato({ getState, patchState }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroSelezionato) {
        const state = getState();

        const filtriRichieste = makeCopy(state.filtriRichieste);
        const filtro = makeCopy(action.filtro);

        patchState({
            ...state,
            filtriRichieste: setFiltroSelezionato(filtriRichieste, filtro)
        });
    }

    // RESET FILTRI SELEZIONATI
    @Action(ResetFiltriSelezionati)
    resetFiltriSelezionati({ getState, patchState }: StateContext<FiltriRichiesteStateModel>) {
        const state = getState();

        const filtriRichieste = makeCopy(state.filtriRichieste);

        patchState({
            ...state,
            filtriRichieste: resetFiltriSelezionati(filtriRichieste)
        });
    }
}

export function setFiltroSelezionato(filtriRichieste: VoceFiltro[], filtro: VoceFiltro) {
    filtriRichieste.forEach((fR: VoceFiltro, index: any) => {
        if (fR.codice === filtro.codice) {
            filtro = toggleFiltro(filtro);
            filtriRichieste[index] = filtro;
        }
    });

    return filtriRichieste;
}

export function toggleFiltro(filtro: VoceFiltro) {
    filtro.selezionato = !filtro.selezionato;

    return filtro;
}

export function resetFiltriSelezionati(filtriRichieste: VoceFiltro[]) {
    filtriRichieste.forEach((fR: VoceFiltro) => {
        fR.selezionato = false;
    });
    const newFiltriRichieste = filtriRichieste;

    return newFiltriRichieste;
}
