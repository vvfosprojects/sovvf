import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  AddAzioniRichiesta,
  AddSoccorsoAereo,
  AddTipologieRichiesta,
  GetAzioniRichiesta,
  GetDettaglioSoccorsoAereo, GetEventiSoccorsoAereo,
  RemoveSoccorsoAereo,
  SetDettaglioSoccorsoAereo,
  SetEventiSoccorsoAereo,
  SetMotivazioneRichiesta
} from '../../actions/composizione-partenza/composizione-soccorso-aereo.actions';
import {CompPartenzaService} from '../../../../../core/service/comp-partenza-service/comp-partenza.service';

export interface EventiAFM {
  areReliableCoordinates: boolean;
  datetime: string;
  description: string;
  events: [{
    activityID: number;
    activityStatusType: string;
    aircraft: string;
    department: string;
    event: string;
    operatorName: string;
    operatorSurname: string;
    statusDatetime: string;
  }];
  lat: number;
  lng: number;
  locality: string;
  onSiteContact: string;
  onSiteContactPhoneNumber: string;
  operatorFiscalCode: string;
  operatorName: string;
  operatorSurname: string;
  progressiveNumber: string;
  remarks: any;
  requestKey: string;
  requestType: string;
  venueInCharge: string;
}

export interface DettaglioAFM {
  activities: [{
    acceptanceDatetime: string;
    activityID: number;
    activityStatusType: string;
    aircraft: {
      regMark: string;
      distance: number,
      estimatedFlightTime: number,
      rescueCategories: string;
    }
    department: string;
    landingDatetime: string;
    rescueArriveDatetime: string;
    rescueLeaveDatetime: string;
    statusDatetime: string;
    takeoffDatetime: string;
  }];
  areReliableCoordinates: boolean;
  datetime: string;
  description: string;
  lat: number;
  lng: number;
  locality: string;
  onSiteContact: string;
  onSiteContactPhoneNumber: string;
  operatorFiscalCode: string;
  operatorName: string;
  operatorSurname: string;
  progressiveNumber: string;
  remarks: string;
  requestKey: string;
  requestType: string;
  venueInCharge: string;
}

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
  dettaglioAFM: DettaglioAFM;
  eventiAFM: EventiAFM;
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
  dettaglioAFM: null,
  eventiAFM: null,
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

  @Selector()
  static dettaglioAFM(state: ComposizioneSoccorsoAereoStateModel): DettaglioAFM {
    return state.dettaglioAFM;
  }

  @Selector()
  static eventiAFM(state: ComposizioneSoccorsoAereoStateModel): EventiAFM {
    return state.eventiAFM;
  }


  constructor(private compPartenzaService: CompPartenzaService) {
  }


  @Action(GetAzioniRichiesta)
  getAzioniRichiesta({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>): void {
    this.compPartenzaService.getCategorieSoccorso().subscribe((action: any) => {
      dispatch(new AddAzioniRichiesta(action.dataArray));
    }, () => {});
  }

  /*
  @Action(GetTipologieRichiesta)
  getTipologieRichiesta({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>): void {
    this.compPartenzaService.getTipologieSoccorso().subscribe((action: any) => {
      dispatch(new AddTipologieRichiesta(action.dataArray));
    }, () => {});
  }
  */

  @Action(GetDettaglioSoccorsoAereo)
  getDettaglioSoccorsoAereo({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>, codRichiesta: string): void {
    this.compPartenzaService.getDettaglioSoccorsoAereo(codRichiesta).subscribe((action: any) => {
      dispatch(new SetDettaglioSoccorsoAereo(action.data));
    }, () => {});
  }

  @Action(GetEventiSoccorsoAereo)
  getEventiSoccorsoAereo({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>, codRichiesta: string): void {
    this.compPartenzaService.getEventiSoccorsoAereo(codRichiesta).subscribe((action: any) => {
      dispatch(new SetEventiSoccorsoAereo(action.data));
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

  @Action(SetDettaglioSoccorsoAereo)
  setDettaglioSoccorsoAereo({ patchState, getState }: StateContext<ComposizioneSoccorsoAereoStateModel>, action: any): void {
    patchState({
      dettaglioAFM: action.dettaglioAFM
    });
    const state = getState();
    console.log('***state.dettaglioAFM AFTER CHANGE ', state.dettaglioAFM);
  }

  @Action(SetEventiSoccorsoAereo)
  setEventiSoccorsoAereo({ patchState, getState }: StateContext<ComposizioneSoccorsoAereoStateModel>, action: any): void {
    patchState({
      eventiAFM: action.eventiAFM
    });
    const state = getState();
    console.log('***state.eventiAFM AFTER CHANGE ', state.eventiAFM);
  }

  @Action(AddSoccorsoAereo)
  addSoccorsoAereo({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>, richiesta: any): void {
    this.compPartenzaService.addSoccorsoAereo(richiesta).subscribe(() => {
    });
  }

  @Action(RemoveSoccorsoAereo)
  removeSoccorsoAereo({ dispatch }: StateContext<ComposizioneSoccorsoAereoStateModel>, richiesta: any): void {
    this.compPartenzaService.removeSoccorsoAereo(richiesta).subscribe(() => {
    });
  }

  @Action(SetMotivazioneRichiesta)
  setMotivazioneRichiesta({ patchState }: StateContext<ComposizioneSoccorsoAereoStateModel>, action: string): void {
    patchState({
      motivazioneRichiesta: action
    });
  }
}
