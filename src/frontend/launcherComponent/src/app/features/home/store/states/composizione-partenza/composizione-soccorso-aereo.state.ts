import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  AddAzioniRichiesta,
  GetAzioniRichiesta,
  SetMotivazioneRichiesta
} from '../../actions/composizione-partenza/composizione-soccorso-aereo.actions';
import {CompPartenzaService} from '../../../../../core/service/comp-partenza-service/comp-partenza.service';

export interface ComposizioneSoccorsoAereoStateModel {
  azioniRichiesta: [{
    cod: string,
    descrizione: string,
    checked: boolean,
  }];
  motivazioneRichiesta: string;
}

export const ComposizioneSoccorsoAereoStateDefaults: ComposizioneSoccorsoAereoStateModel = {
  azioniRichiesta: [{
    cod: null,
    descrizione: null,
    checked: false,
  }],
  motivazioneRichiesta: null,
};

@Injectable()
@State<ComposizioneSoccorsoAereoStateModel>({
  name: 'composizioneSoccorsoAereo',
  defaults: ComposizioneSoccorsoAereoStateDefaults
})
export class ComposizioneSoccorsoAereoState {

  @Selector()
  static azioniRichieste(state: ComposizioneSoccorsoAereoStateModel): any {
    return state.azioniRichiesta;
  }

  @Selector()
  static motivazione(state: ComposizioneSoccorsoAereoStateModel): string {
    return state.motivazioneRichiesta;
  }


  constructor(private compPartenzaService: CompPartenzaService) {
  }


  @Action(GetAzioniRichiesta)
  getAzioniRichiesta({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>): void {
    this.compPartenzaService.getCategorieSoccorso().subscribe((action: any) => {
      dispatch(new AddAzioniRichiesta(action.dataArray));
    }, () => {});
  }

  @Action(AddAzioniRichiesta)
  setRichieste({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, azioniRichiesta: any): void {
    patchState({
      azioniRichiesta: azioniRichiesta.richieste,
    });
  }

  @Action(SetMotivazioneRichiesta)
  setMotivazioneRichiesta({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, action: string): void {
    patchState({
      motivazioneRichiesta: action
    });
  }
}
