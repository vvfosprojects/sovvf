import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SetMotivazioneRichiesta} from '../../actions/composizione-partenza/composizione-soccorso-aereo.actions';

export interface ComposizioneSoccorsoAereoStateModel {
  azioniRichiesta: string[];
  motivazioneRichiesta: string;
}

export const ComposizioneSoccorsoAereoStateDefaults: ComposizioneSoccorsoAereoStateModel = {
  azioniRichiesta: [],
  motivazioneRichiesta: null,
};

@Injectable()
@State<ComposizioneSoccorsoAereoStateModel>({
  name: 'composizioneSoccorsoAereo',
  defaults: ComposizioneSoccorsoAereoStateDefaults
})
export class ComposizioneSoccorsoAereoState {

  @Selector()
  static azioniRichieste(state: ComposizioneSoccorsoAereoStateModel): string[] {
    return state.azioniRichiesta;
  }

  @Selector()
  static motivazione(state: ComposizioneSoccorsoAereoStateModel): string {
    return state.motivazioneRichiesta;
  }

  @Action(SetMotivazioneRichiesta)
  setMotivazioneRichiesta({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, action: string): void {
    patchState({
      motivazioneRichiesta: action
    });
  }
}
