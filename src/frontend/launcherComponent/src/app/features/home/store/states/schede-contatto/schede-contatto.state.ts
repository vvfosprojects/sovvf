import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
  SetListaSchedeContatto,
  SetSchedaContattoTelefonata,
  ClearSchedaContattoTelefonata,
  SetSchedaContattoHover, ClearSchedaContattoHover
} from '../../actions/schede-contatto/schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';

export interface SchedeContattoStateModel {
  schedeContatto: SchedaContatto[];
  schedeContattoCompetenza: SchedaContatto[];
  schedeContattoConoscenza: SchedaContatto[];
  schedeContattoDifferibili: SchedaContatto[];
  schedaContattoTelefonata: SchedaContatto;
  codiceSchedaContattoHover: string;
}

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
  schedeContatto: [],
  schedeContattoCompetenza: [],
  schedeContattoConoscenza: [],
  schedeContattoDifferibili: [],
  schedaContattoTelefonata: null,
  codiceSchedaContattoHover: null
};

@State<SchedeContattoStateModel>({
  name: 'schedeContatto',
  defaults: SchedeContattoStateDefaults
})
export class SchedeContattoState {

  @Selector()
  static schedeContatto(state: SchedeContattoStateModel) {
    return state.schedeContatto;
  }

  @Selector()
  static schedeContattoCompetenza(state: SchedeContattoStateModel) {
    return state.schedeContattoCompetenza;
  }

  @Selector()
  static schedeContattoConoscenza(state: SchedeContattoStateModel) {
    return state.schedeContattoConoscenza;
  }

  @Selector()
  static schedeContattoDifferibili(state: SchedeContattoStateModel) {
    return state.schedeContattoDifferibili;
  }

  @Selector()
  static schedaContattoTelefonata(state: SchedeContattoStateModel) {
    return state.schedaContattoTelefonata;
  }

  @Selector()
  static numeroSchedeContattoCompetenza(state: SchedeContattoStateModel) {
    return state.schedeContattoCompetenza.length;
  }

  @Selector()
  static codiceSchedaContattoHover(state: SchedeContattoStateModel) {
    return state.codiceSchedaContattoHover;
  }

  constructor() {
  }

  @Action(SetListaSchedeContatto)
  setListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto) {
    patchState({
      schedeContatto: action.schedeContatto,
      schedeContattoCompetenza: action.schedeContatto ? action.schedeContatto.filter(schedaContatto => schedaContatto.classificazione === ClassificazioneSchedaContatto.Competenza) : [],
      schedeContattoConoscenza: action.schedeContatto ? action.schedeContatto.filter(schedaContatto => schedaContatto.classificazione === ClassificazioneSchedaContatto.Conoscenza) : [],
      schedeContattoDifferibili: action.schedeContatto ? action.schedeContatto.filter(schedaContatto => schedaContatto.classificazione === ClassificazioneSchedaContatto.Differibile) : []
    });
  }

  @Action(SetSchedaContattoTelefonata)
  setSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoTelefonata) {
    patchState({
      schedaContattoTelefonata: action.schedaContatto
    });
  }

  @Action(ClearSchedaContattoTelefonata)
  clearSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>) {
    patchState({
      schedaContattoTelefonata: null
    });
  }

  @Action(SetSchedaContattoHover)
  setSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoHover) {
    patchState({
      codiceSchedaContattoHover: action.codiceSchedaContatto
    });
  }

  @Action(ClearSchedaContattoHover)
  clearSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>) {
    patchState({
      codiceSchedaContattoHover: null
    });
  }
}
