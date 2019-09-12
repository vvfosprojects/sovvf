import { State, Selector, Action, StateContext } from '@ngxs/store';
import {
    ClearMezzoInServizioHover,
    ClearMezzoInServizioSelezionato,
    GetMezziInServizio,
    SetMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato
} from '../../actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { MezziInServizioService } from 'src/app/core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { ClearMarkerMezzoHover, ClearMarkerMezzoSelezionato, SetMarkerMezzoHover, SetMarkerMezzoSelezionato } from '../../actions/maps/marker.actions';

export interface MezziInServizioStateModel {
    mezziInServizio: Mezzo[];
    idMezzoInServizioHover: string;
    idMezzoInServizioSelezionato: string;
}

export const MezziInServizioStateDefaults: MezziInServizioStateModel = {
    mezziInServizio: null,
    idMezzoInServizioHover: null,
    idMezzoInServizioSelezionato: null
};

@State<MezziInServizioStateModel>({
    name: 'mezziInServizio',
    defaults: MezziInServizioStateDefaults
})

export class MezziInServizioState {

    constructor(private mezziInServizioService: MezziInServizioService) {
    }

    @Selector()
    static idMezzoInServizioHover(state: MezziInServizioStateModel) {
        return state.idMezzoInServizioHover;
    }

    @Selector()
    static idMezzoInServizioSelezionato(state: MezziInServizioStateModel) {
        return state.idMezzoInServizioSelezionato;
    }

    @Selector()
    static mezziInServizio(state: MezziInServizioStateModel) {
        return state.mezziInServizio;
    }

    @Action(GetMezziInServizio)
    getMezziInServizio({ dispatch }: StateContext<MezziInServizioStateModel>) {
        this.mezziInServizioService.getMezziInServizio().subscribe(data => {
            console.log('Mezzi In Servizio Controller', data);
            dispatch(new SetMezziInServizio(data.listaMezzi));
        });
    }

    @Action(SetMezziInServizio)
    setMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>, action: SetMezziInServizio) {
        patchState({
            'mezziInServizio': action.mezzi
        });
    }

    @Action(SetMezzoInServizioHover)
    setMezzoInServizioHover({ patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: SetMezzoInServizioHover) {
        patchState({
            'idMezzoInServizioHover': action.idMezzo
        });
        dispatch(new SetMarkerMezzoHover(action.idMezzo));
    }

    @Action(ClearMezzoInServizioHover)
    clearMezzoInServizioHover({ patchState, dispatch }: StateContext<MezziInServizioStateModel>) {
        patchState({
            'idMezzoInServizioHover': null
        });
        dispatch(new ClearMarkerMezzoHover());
    }

    @Action(SetMezzoInServizioSelezionato)
    setMezzoInServizioSelezionato({ getState, patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: SetMezzoInServizioSelezionato) {
        const state = getState();
        if (state.idMezzoInServizioSelezionato !== action.idMezzo) {
            patchState({
                'idMezzoInServizioSelezionato': action.idMezzo
            });
            dispatch(new SetMarkerMezzoSelezionato(action.idMezzo));
        } else {
            dispatch(new ClearMezzoInServizioSelezionato());
        }
    }

    @Action(ClearMezzoInServizioSelezionato)
    clearMezzoInServizioSelezionato({ patchState, dispatch }: StateContext<MezziInServizioStateModel>) {
        patchState({
            'idMezzoInServizioSelezionato': null
        });
        dispatch(new ClearMarkerMezzoSelezionato());
    }
}
