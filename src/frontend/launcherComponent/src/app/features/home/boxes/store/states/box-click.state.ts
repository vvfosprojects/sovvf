import { Action, Selector, State, StateContext } from '@ngxs/store';

// Interface
import { BoxClickInterface } from '../../info-aggregate/box-service/box-click-interface';

// Action
import { InitBoxFiltri, UpdateBoxRichieste, ResetBoxRichieste, UpdateBoxMezzi, ResetBoxMezzi, Reducer, ResetAllBoxes } from '../actions/box-click.actions';
import { BoxClickService } from '../../info-aggregate/box-service/box-click.service';

export interface BoxClickStateModel {
  boxClick: BoxClickInterface;
}

export const boxClickStateDefaults: BoxClickStateModel = {
  boxClick: {
    richieste: {
      chiamate: false,
      assegnati: false,
      sospesi: false,
      presidiati: false,
      chiusi: false
    },
    mezzi: {
      inSede: false,
      inRientro: false,
      inViaggio: false,
      sulPosto: false,
      istituto: false
    }
  }
};

@State<BoxClickStateModel>({
  name: 'boxClick',
  defaults: boxClickStateDefaults
})
export class BoxClickState {

  constructor() { }

  @Selector()
  static boxClick(state: BoxClickStateModel) {
    return state.boxClick;
  }

  @Action(Reducer)
  reducer({ dispatch }: StateContext<BoxClickStateModel>, action: Reducer) {
    switch (action.cat) {
      case 'richieste':
        if (action.tipo === 'tutti') {
          dispatch(new ResetBoxRichieste);
        } else {
          dispatch(new UpdateBoxRichieste(action.tipo));
        }
        break;
      case 'mezzi':
        if (action.tipo === 'tutti') {
          dispatch(new ResetBoxMezzi);
        } else {
          dispatch(new UpdateBoxMezzi(action.tipo));
        }
        break;
    }
  }

  @Action(InitBoxFiltri)
  initBoxClick({ getState, patchState }: StateContext<BoxClickStateModel>) {
    const state = getState();

    patchState({
      ...state,
      boxClick: {
        richieste: {
          chiamate: false,
          assegnati: false,
          sospesi: false,
          presidiati: false,
          chiusi: false
        },
        mezzi: {
          inSede: false,
          inRientro: false,
          inViaggio: false,
          sulPosto: false,
          istituto: false
        }
      }
    });
  }

  @Action(UpdateBoxRichieste)
  updateBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>, action: UpdateBoxRichieste) {
    const state = getState();

    patchState({
      ...state,
      boxClick: update(copyObj(state.boxClick), 'richieste', action.tipo)
    });
  }

  @Action(ResetBoxRichieste)
  resetBoxRichieste({ getState, patchState }: StateContext<BoxClickStateModel>) {
    const state = getState();

    patchState({
      ...state,
      boxClick: reset(copyObj(state.boxClick), 'richieste')
    });
  }

  @Action(UpdateBoxMezzi)
  updateBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>, action: UpdateBoxMezzi) {
    const state = getState();

    patchState({
      ...state,
      boxClick: update(copyObj(state.boxClick), 'mezzi', action.tipo)
    });
  }

  @Action(ResetBoxMezzi)
  resetBoxMezzi({ getState, patchState }: StateContext<BoxClickStateModel>) {
    const state = getState();

    patchState({
      ...state,
      boxClick: reset(copyObj(state.boxClick), 'mezzi')
    });
  }

  @Action(ResetAllBoxes)
  resetAllBoxes({ dispatch }: StateContext<BoxClickStateModel>) {
    dispatch(new ResetBoxRichieste);
    dispatch(new ResetBoxMezzi);
  }
}

export function update(obj: BoxClickInterface, cat: string, tipo: string) {
  obj[cat][tipo] = !obj[cat][tipo];
  return obj;
}

export function reset(obj: BoxClickInterface, cat: string) {
  Object.keys(obj[cat]).map(r => {
    obj[cat][r] = false;
  });
  return obj;
}

export function copyObj(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
