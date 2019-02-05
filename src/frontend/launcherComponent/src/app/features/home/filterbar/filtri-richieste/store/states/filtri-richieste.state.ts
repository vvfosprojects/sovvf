import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { VoceFiltro } from '../../voce-filtro.model';

// Action
import { GetFiltriRichieste, AddFiltroSelezionato, RemoveFiltroSelezionato, SetFiltroSelezionato, ResetFiltriSelezionati } from '../actions/filtri-richieste.actions';

// Tipologie
import { APP_TIPOLOGIE } from 'src/app/core/settings/tipologie';


export interface FiltriRichiesteStateModel {
  filtriRichieste: VoceFiltro[];
  filtriSelezionati: VoceFiltro[];
}

export const filtriRichiesteStateDefaults: FiltriRichiesteStateModel = {
  filtriRichieste: [],
  filtriSelezionati: []
};

@State<FiltriRichiesteStateModel>({
  name: 'filtriRichieste',
  defaults: filtriRichiesteStateDefaults
})
export class FiltriRichiesteState {

  constructor() { }

  // SELECTORS
  @Selector()
  static filtriTipologie(state: FiltriRichiesteStateModel) {
    return state.filtriRichieste;
  }

  @Selector()
  static filtriSelezionati(state: FiltriRichiesteStateModel) {
    return state.filtriSelezionati;
  }

  // GET
  @Action(GetFiltriRichieste)
  getFiltriRichieste({ getState, patchState }: StateContext<FiltriRichiesteStateModel>) {
    const state = getState();

    const filtriTipologie: VoceFiltro[] = [];
    const filtriStatici: VoceFiltro[] = [
      new VoceFiltro('1', 'Presidiato', 'Presidiato', true),
      new VoceFiltro('2', 'Presidiato', 'Non Presidiato', true),
      new VoceFiltro('3', 'Rilevante', 'Rilevante', true),
      new VoceFiltro('4', 'Rilevante', 'Non Rilevante', true)
    ];
    filtriTipologie.push(...filtriStatici);
    APP_TIPOLOGIE.forEach(tipologie => {
      filtriTipologie.push(new VoceFiltro('' + tipologie.codice, tipologie.categoria, tipologie.descrizione, tipologie.star));
    });

    patchState({
      ...state,
      filtriRichieste: filtriTipologie
    });
  }

  // SET FILTRO SELEZIONATO (SELEZIONATO, NON-SELEZIONATO)
  @Action(SetFiltroSelezionato)
  setFiltroSelezionato({ getState, patchState }: StateContext<FiltriRichiesteStateModel>, action: SetFiltroSelezionato) {
    const state = getState();

    const filtriRichieste = copyObj(state.filtriRichieste);
    const filtro = copyObj(action.filtro);

    patchState({
      ...state,
      filtriRichieste: setFiltroSelezionato(filtriRichieste, filtro)
    });
  }

  // ADD FILTRO SELEZIONATO
  @Action(AddFiltroSelezionato)
  addFiltroSelezionato({ getState, patchState }: StateContext<FiltriRichiesteStateModel>, action: AddFiltroSelezionato) {
    const state = getState();

    const filtriSelezionati = copyObj(state.filtriSelezionati);
    const filtro = copyObj(action.filtro);

    patchState({
      ...state,
      filtriSelezionati: addFiltroSelezionato(filtriSelezionati, filtro)
    });
  }

  // REMOVE FILTRO SELEZIONATO
  @Action(RemoveFiltroSelezionato)
  removeFiltroSelezionato({ getState, patchState }: StateContext<FiltriRichiesteStateModel>, action: RemoveFiltroSelezionato) {
    const state = getState();

    const filtriSelezionati = copyObj(state.filtriSelezionati);
    const filtro = copyObj(action.filtro);

    patchState({
      ...state,
      filtriSelezionati: removeFiltroSelezionato(filtriSelezionati, filtro)
    });
  }

  // RESET FILTRI SELEZIONATI
  @Action(ResetFiltriSelezionati)
  resetFiltriSelezionati({ getState, patchState }: StateContext<FiltriRichiesteStateModel>) {
    const state = getState();

    const filtriRichieste = copyObj(state.filtriRichieste);
    const filtriSelezionati = copyObj(state.filtriSelezionati);

    patchState({
      ...state,
      filtriRichieste: resetFiltriSelezionati(filtriRichieste, filtriSelezionati).filtriRichieste,
      filtriSelezionati: resetFiltriSelezionati(filtriRichieste, filtriSelezionati).filtriSelezionati
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

export function addFiltroSelezionato(filtriSelezionati: VoceFiltro[], filtro: VoceFiltro) {
  toggleFiltro(filtro);
  filtriSelezionati.push(filtro);

  return filtriSelezionati;
}

export function removeFiltroSelezionato(filtriSelezionati: VoceFiltro[], filtro: VoceFiltro) {
  filtriSelezionati.forEach((fS: VoceFiltro, index: any) => {
    if (fS.codice === filtro.codice) {
      filtriSelezionati.splice(index, 1);
    }
  });

  return filtriSelezionati;
}

export function toggleFiltro(filtro: VoceFiltro) {
  filtro.selezionato = !filtro.selezionato;

  return filtro;
}

export function resetFiltriSelezionati(filtriRichieste: VoceFiltro[], filtriSelezionati: VoceFiltro[]) {
  filtriRichieste.forEach((fR: VoceFiltro) => {
    fR.selezionato = false;
  });
  const newFiltriRichieste = filtriRichieste;

  filtriSelezionati = [];
  const newFiltriSelezionati = filtriSelezionati;

  return {'filtriRichieste': newFiltriRichieste, 'filtriSelezionati': newFiltriSelezionati};
}

export function copyObj(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
