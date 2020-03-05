import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { EventiRichiestaService } from 'src/app/core/service/eventi-richiesta-service/eventi-richiesta.service';
import { EventoRichiesta } from '../../../../../shared/model/evento-richiesta.model';
import {
  ClearEventiRichiesta,
  GetEventiRichiesta,
  SetEventiRichiesta,
  SetIdRichiestaEventi,
  SetListaTarghe,
  SetFiltroTargaMezzo, FiltraEventiRichiesta, ToggleIconeNomeClasseEvento
} from '../../actions/eventi/eventi-richiesta.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { FiltroTargaMezzo } from '../../../eventi/filtro-targa-mezzo.interface';
import { RichiesteState } from '../richieste/richieste.state';
import { StartLoading, StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';

export interface EventiRichiestaStateModel {
  idRichiesta: string;
  codiceRichiesta: string;
  eventi: EventoRichiesta[];
  listaEventiFiltrata: EventoRichiesta[];
  listaTargaMezzo: FiltroTargaMezzo[];
  filtroTargaMezzo: string[];
  visualizzazioneIconeNomeClasseEvento: boolean;
}

export const eventiRichiestaStateDefaults: EventiRichiestaStateModel = {
  idRichiesta: null,
  codiceRichiesta: null,
  eventi: null,
  listaEventiFiltrata: null,
  listaTargaMezzo: null,
  filtroTargaMezzo: null,
  visualizzazioneIconeNomeClasseEvento: true
};

@State<EventiRichiestaStateModel>({
  name: 'eventiRichiesta',
  defaults: eventiRichiestaStateDefaults
})
export class EventiRichiestaState {

  constructor(private store: Store,
              private _eventiRichiesta: EventiRichiestaService) {
  }

  @Selector()
  static listaEventiFiltrata(state: EventiRichiestaStateModel) {
    return state.listaEventiFiltrata;
  }

  @Selector()
  static idRichiesta(state: EventiRichiestaStateModel) {
    return state.idRichiesta;
  }

  @Selector()
  static codiceRichiesta(state: EventiRichiestaStateModel) {
    return state.codiceRichiesta;
  }

  @Selector()
  static listaTargaMezzo(state: EventiRichiestaStateModel): FiltroTargaMezzo[] {
    return state.listaTargaMezzo;
  }

  @Selector()
  static targheSelezionate(state: EventiRichiestaStateModel): string[] {
    return state.filtroTargaMezzo;
  }

  @Selector()
  static visualizzazioneIconeNomeClasseEvento(state: EventiRichiestaStateModel): boolean {
    return state.visualizzazioneIconeNomeClasseEvento;
  }

  @Action(SetIdRichiestaEventi)
  setIdRichiesta({ patchState, dispatch }: StateContext<EventiRichiestaStateModel>, action: SetIdRichiestaEventi) {
    const richiesta = this.store.selectSnapshot(RichiesteState.richieste).filter(r => r.id === action.idRichiesta)[0];
    patchState({
      idRichiesta: action.idRichiesta,
      codiceRichiesta: richiesta && richiesta.codiceRichiesta ? richiesta.codiceRichiesta : richiesta.codice
    });
    dispatch(new GetEventiRichiesta());
  }

  @Action(GetEventiRichiesta)
  getEventiRichiesta({ getState, dispatch }: StateContext<EventiRichiestaStateModel>) {
    const idRichiesta = getState().idRichiesta;
    dispatch(new StartLoading());
    this._eventiRichiesta.getEventiRichiesta(idRichiesta).subscribe((data: EventoRichiesta[]) => {
      // console.log(`Get Eventi Richiesta: ${idRichiesta}`);
      dispatch(new SetEventiRichiesta(data));
      dispatch(new StopLoading());
    }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));

  }

  @Action(SetEventiRichiesta)
  setEventiRichiesta({ getState, patchState, dispatch }: StateContext<EventiRichiestaStateModel>, action: SetEventiRichiesta) {
    patchState({
      eventi: action.eventi,
      listaEventiFiltrata: action.eventi
    });
    dispatch(new SetListaTarghe());
    const state = getState();
    if (state.filtroTargaMezzo && state.filtroTargaMezzo.length > 0) {
      dispatch(new FiltraEventiRichiesta());
    }
  }

  @Action(SetListaTarghe)
  setListaTarghe({ getState, patchState }: StateContext<EventiRichiestaStateModel>) {
    const state = getState();
    const listaTarghe: FiltroTargaMezzo[] = [];
    if (state && state.eventi) {
      state.eventi.forEach(evento => {
        if (evento.targa && evento.targa.length > 0) {
          listaTarghe.push({ targa: evento.targa });
        }
      });
    }
    patchState({
      listaTargaMezzo: listaTarghe
    });
  }

  @Action(SetFiltroTargaMezzo)
  setFiltroTargaMezzo({ patchState, dispatch }: StateContext<EventiRichiestaStateModel>, action: SetFiltroTargaMezzo) {
    patchState({
      filtroTargaMezzo: action.filtroTargaMezzo
    });
    dispatch(new FiltraEventiRichiesta());
  }

  @Action(FiltraEventiRichiesta)
  filtraEventiRichiesta({ getState, patchState }: StateContext<EventiRichiestaStateModel>) {
    const state = getState();
    if (state.eventi && state.filtroTargaMezzo && state.filtroTargaMezzo.length > 0) {
      const listaEventiFiltrata: EventoRichiesta[] = [];
      state.eventi.forEach(evento => {
        if (evento.targa && evento.targa.length > 0) {
          if (state.filtroTargaMezzo.includes(evento.targa)) {
            listaEventiFiltrata.push(evento);
          }
        }
      });
      patchState({
        listaEventiFiltrata: listaEventiFiltrata
      });
    } else {
      patchState({
        listaEventiFiltrata: state.eventi
      });
    }
  }

  @Action(ClearEventiRichiesta)
  clearEventiRichiesta({ patchState }: StateContext<EventiRichiestaStateModel>) {
    patchState(eventiRichiestaStateDefaults);
  }

  @Action(ToggleIconeNomeClasseEvento)
  toggleIconeNomeClasseEvento({ getState, patchState }: StateContext<EventiRichiestaStateModel>) {
    const state = getState();
    patchState({
      visualizzazioneIconeNomeClasseEvento: !state.visualizzazioneIconeNomeClasseEvento
    });
  }

}
