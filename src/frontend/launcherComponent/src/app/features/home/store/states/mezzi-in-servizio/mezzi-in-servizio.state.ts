import { State, Selector, Action, StateContext, Select } from '@ngxs/store';
import {
    ClearFiltriMezziInServizio,
    ClearMezzoInServizioHover,
    ClearMezzoInServizioSelezionato, ClearRicercaMezziInServizio, FilterMezziInServizio,
    GetMezziInServizio, SetFiltroMezziInServizio,
    SetMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato, SetRicercaMezziInServizio
} from '../../actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { ClearMarkerMezzoHover, ClearMarkerMezzoSelezionato, SetMarkerMezzoHover, SetMarkerMezzoSelezionato } from '../../actions/maps/marker.actions';
import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { MezziInServizioService } from '../../../../../core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { MezziMarkersState } from '../maps/mezzi-markers.state';
import { Observable } from 'rxjs';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { StatoMezzo as Categoria } from '../../../../../shared/enum/stato-mezzo.enum';
import { makeCopy } from '../../../../../shared/helper/function';
import { resetFiltriSelezionati as _resetFiltriSelezionati, setFiltroSelezionato as _setFiltroSelezionato } from '../../../../../shared/helper/function-filtro';

export interface MezziInServizioStateModel {
    mezziInServizio: MezzoInServizio[];
    mezziInServizioFiltered: MezzoInServizio[];
    idMezzoInServizioHover: string;
    idMezzoInServizioSelezionato: string;
    filtriMezziInServizio: VoceFiltro[];
    ricerca: { mezzo: { mezzo: { descrizione: string } } };
}

export const MezziInServizioStateDefaults: MezziInServizioStateModel = {
    mezziInServizio: null,
    mezziInServizioFiltered: null,
    idMezzoInServizioHover: null,
    idMezzoInServizioSelezionato: null,
    filtriMezziInServizio: [
        new VoceFiltro('2', Categoria.InRientro, 'In Rientro', false),
        new VoceFiltro('3', Categoria.InSede, 'In Sede', false),
        new VoceFiltro('4', Categoria.InViaggio, 'In Viaggio', false),
        new VoceFiltro('6', Categoria.SulPosto, 'Sul Posto', false),
        new VoceFiltro('1', Categoria.FuoriServizio, 'Fuori Servizio', false),
        new VoceFiltro('5', Categoria.Istituto, 'Istituto', false),
    ],
    ricerca: { mezzo: { mezzo: { descrizione: '' } } }
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

    @Selector()
    static mezziInServizioFiltered(state: MezziInServizioStateModel) {
        return state.mezziInServizioFiltered;
    }

    @Selector()
    static filtriMezziInServizio(state: MezziInServizioStateModel) {
        return state.filtriMezziInServizio;
    }

    @Selector()
    static filtriSelezionati(state: MezziInServizioStateModel) {
        return state.filtriMezziInServizio.filter(f => f.selezionato === true);
    }


    @Selector()
    static ricercaMezziInServizio(state: MezziInServizioStateModel) {
        return state.ricerca;
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
            mezziInServizio: action.mezzi,
            mezziInServizioFiltered: action.mezzi
        });
    }

    @Action(FilterMezziInServizio)
    filterMezziInServizio({ getState, patchState }: StateContext<MezziInServizioStateModel>) {
        const state = getState();
        const mezziInServizio = makeCopy(state.mezziInServizio) as MezzoInServizio[];
        const filtriMezziInServizio = makeCopy(state.filtriMezziInServizio) as VoceFiltro[];
        const descFiltriMezziInServizio = filtriMezziInServizio.filter(f => f.selezionato).map(f => f.descrizione);
        const newArrayMezzi = mezziInServizio.filter((m: MezzoInServizio) => descFiltriMezziInServizio.includes(m.mezzo.mezzo.stato));
        if (filtriMezziInServizio.filter(f => f.selezionato).length > 0) {
            patchState({
                mezziInServizioFiltered: newArrayMezzi
            });
        } else {
            patchState({
                mezziInServizioFiltered: mezziInServizio
            });
        }
    }

    @Action(SetFiltroMezziInServizio)
    setFiltroMezziInServizio({ getState, patchState, dispatch }: StateContext<MezziInServizioStateModel>, action: SetFiltroMezziInServizio) {
        const state = getState();
        const filtriMezziInServizio = makeCopy(state.filtriMezziInServizio);
        const filtro = makeCopy(action.filtro);
        patchState({
            filtriMezziInServizio: _setFiltroSelezionato(filtriMezziInServizio, filtro)
        });
        dispatch(new FilterMezziInServizio());
    }

    @Action(ClearFiltriMezziInServizio)
    clearFiltriMezziInServizio({ getState, patchState, dispatch }: StateContext<MezziInServizioStateModel>) {
        const state = getState();
        const filtriMezziInServizio = makeCopy(state.filtriMezziInServizio);
        patchState({
            ...state,
            filtriMezziInServizio: _resetFiltriSelezionati(filtriMezziInServizio)
        });
        dispatch(new FilterMezziInServizio());
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

    @Action(SetRicercaMezziInServizio)
    setRicercaMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>, action: SetRicercaMezziInServizio) {
        patchState({
            ricerca: { mezzo: { mezzo: { descrizione: action.ricerca } } }
        });
    }

    @Action(ClearRicercaMezziInServizio)
    clearRicercaMezziInServizio({ patchState }: StateContext<MezziInServizioStateModel>) {
        patchState({
            ricerca: { mezzo: { mezzo: { descrizione: '' } } }
        });
    }
}
