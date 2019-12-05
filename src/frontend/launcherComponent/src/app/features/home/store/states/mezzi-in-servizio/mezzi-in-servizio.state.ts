import { State, Selector, Action, StateContext, Select } from '@ngxs/store';
import {
    ClearMezzoInServizioHover,
    ClearMezzoInServizioSelezionato,
    GetMezziInServizio,
    SetMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato
} from '../../actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { ClearMarkerMezzoHover, ClearMarkerMezzoSelezionato, SetMarkerMezzoHover, SetMarkerMezzoSelezionato } from '../../actions/maps/marker.actions';
import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { MezziInServizioService } from '../../../../../core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { MezziMarkersState } from '../maps/mezzi-markers.state';
import { Observable } from 'rxjs';
import { MezzoMarker } from '../../../maps/maps-model/mezzo-marker.model';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { SetMezzoMarkerById } from '../../actions/maps/mezzi-markers.actions';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';

export interface MezziInServizioStateModel {
    mezziInServizio: MezzoInServizio[];
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

    @Select(MezziMarkersState.mezziMarkersIds) mezziMarkersIds$: Observable<string[]>;

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
            let mezziMarkersIds = [] as string[];
            this.mezziMarkersIds$.subscribe((markers: string[]) => {
                mezziMarkersIds = markers;
            });
            if (mezziMarkersIds.filter(mId => mId === action.idMezzo).length <= 0) {
                const mezzoInServizio = state.mezziInServizio.filter(m => m.mezzo.mezzo.codice)[0];
                dispatch(new SetCentroMappa(new CentroMappa(mezzoInServizio.mezzo.mezzo.coordinate, MAPSOPTIONS.zoomSelezionato.richiesta)));
            }
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
