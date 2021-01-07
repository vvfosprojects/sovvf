import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  AddAzioniRichiesta, AddSoccorsoAereo, AddTipologieRichiesta,
  GetAzioniRichiesta, GetTipologieRichiesta,
  SetMotivazioneRichiesta
} from '../../actions/composizione-partenza/composizione-soccorso-aereo.actions';
import {CompPartenzaService} from '../../../../../core/service/comp-partenza-service/comp-partenza.service';

export interface ComposizioneSoccorsoAereoStateModel {
  azioniRichiesta: [{
    codice: string,
    descrizione: string,
    checked: boolean,
  }];
  motivazioneRichiesta: string;
  tipologieRichiesta: [{
    codice: string,
    tipo: string,
  }];
}

export const ComposizioneSoccorsoAereoStateDefaults: ComposizioneSoccorsoAereoStateModel = {
  azioniRichiesta: [{
    codice: null,
    descrizione: null,
    checked: false,
  }],
  motivazioneRichiesta: null,
  tipologieRichiesta: [{
    codice: null,
    tipo: null,
  }],
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

  @Action(GetTipologieRichiesta)
  getTipologieRichiesta({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>): void {
    this.compPartenzaService.getTipologieSoccorso().subscribe((action: any) => {
      dispatch(new AddTipologieRichiesta(action.dataArray));
    }, () => {});
  }

  @Action(AddAzioniRichiesta)
  setRichieste({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, azioniRichiesta: any): void {
    patchState({
      azioniRichiesta: azioniRichiesta.richieste.map(x => ({codice : x.categoryCode, descrizione: x.categoryName})),
    });
  }

  @Action(AddTipologieRichiesta)
  setTipologieRichieste({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, tipologieRichiesta: any): void {
    patchState({
      tipologieRichiesta: tipologieRichiesta.tipologieRichiesta.map(x => ({codice : x.requestTypeCode, tipo: x.requestType})),
    });
  }

  @Action(AddSoccorsoAereo)
  addSoccorsoAereo({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>, richiesta: any): void {
    this.compPartenzaService.addSoccorsoAereo(richiesta).subscribe((action: any) => {
      dispatch(new AddSoccorsoAereo(action.dataArray));
    }, () => {});
  }

  @Action(SetMotivazioneRichiesta)
  setMotivazioneRichiesta({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, action: string): void {
    patchState({
      motivazioneRichiesta: action
    });
  }
}
