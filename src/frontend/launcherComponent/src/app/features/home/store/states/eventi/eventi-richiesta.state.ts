import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { EventiRichiestaService } from 'src/app/core/service/eventi-richiesta-service/eventi-richiesta.service';

// Model
import { EventoRichiesta } from '../../../../../shared/model/evento-richiesta.model';

// Action
import { ClearEventiRichiesta, GetEventiRichiesta, SetEventiRichiesta, SetIdRichiestaEventi, SetRicercaTargaMezzo } from '../../actions/eventi/eventi-richiesta.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';

export interface EventiRichiestaStateModel {
    idRichiesta: string;
    eventi: EventoRichiesta[];
    filtroTargaMezzo: any;
}

export const eventiRichiestaStateDefaults: EventiRichiestaStateModel = {
    idRichiesta: null,
    eventi: null,
    filtroTargaMezzo: { targa: '' }
};

@State<EventiRichiestaStateModel>({
    name: 'eventiRichiesta',
    defaults: eventiRichiestaStateDefaults
})
export class EventiRichiestaState {

    constructor(private _eventiRichiesta: EventiRichiestaService) {
    }

    @Selector()
    static eventi(state: EventiRichiestaStateModel) {
        return state.eventi;
    }

    @Selector()
    static idRichiesta(state: EventiRichiestaStateModel) {
        return state.idRichiesta;
    }

    @Selector()
    static filtroTargaMezzo(state: EventiRichiestaStateModel) {
        return state.filtroTargaMezzo;
    }

    @Action(SetIdRichiestaEventi)
    setIdRichiesta({ patchState, dispatch }: StateContext<EventiRichiestaStateModel>, action: SetIdRichiestaEventi) {

        patchState({
            eventi: null, idRichiesta: action.idRichiesta
        });

        dispatch(new GetEventiRichiesta(action.idRichiesta));
    }

    @Action(GetEventiRichiesta)
    getEventiRichiesta({ dispatch }: StateContext<EventiRichiestaStateModel>, action: GetEventiRichiesta) {

        this._eventiRichiesta.getEventiRichiesta(action.idRichiesta).subscribe((data: EventoRichiesta[]) => {
            console.log(`Get Eventi Richiesta: ${action.idRichiesta}`);
            dispatch(new SetEventiRichiesta(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));

    }

    @Action(SetEventiRichiesta)
    setEventiRichiesta({ patchState }: StateContext<EventiRichiestaStateModel>, action: SetEventiRichiesta) {
        patchState({
            eventi: action.eventi
        });
    }

    @Action(ClearEventiRichiesta)
    clearEventiRichiesta({ patchState }: StateContext<EventiRichiestaStateModel>) {
        patchState(eventiRichiestaStateDefaults);
    }


    @Action(SetRicercaTargaMezzo)
    setRicerca({ getState, patchState }: StateContext<EventiRichiestaStateModel>, action: SetRicercaTargaMezzo) {
        const state = getState();
        patchState({
            ...state,
            filtroTargaMezzo: action.ricercaTargaMezzo
        });
    }
}
