import { State, Selector, Action, StateContext, Select } from '@ngxs/store';
import {
    ClearFiltriMezziInServizio,
    ClearMezzoInServizioHover,
    ClearMezzoInServizioSelezionato, FilterMezziInServizio,
    GetMezziInServizio, SetFiltroMezziInServizio,
    SetMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato
} from '../../actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { ClearMarkerMezzoHover, ClearMarkerMezzoSelezionato, SetMarkerMezzoHover, SetMarkerMezzoSelezionato } from '../../actions/maps/marker.actions';
import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { MezziInServizioService } from '../../../../../core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { MezziMarkersState } from '../maps/mezzi-markers.state';
import { Observable } from 'rxjs';
import { SetCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { CentroMappa } from '../../../maps/maps-model/centro-mappa.model';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';
import { StatoMezzo as Categoria } from '../../../../../shared/enum/stato-mezzo.enum';
import { SchedeContattoStateModel } from '../schede-contatto/schede-contatto.state';

export interface MezziInServizioStateModel {
    mezziInServizio: MezzoInServizio[];
    idMezzoInServizioHover: string;
    idMezzoInServizioSelezionato: string;
    filtriMezziInServizio: VoceFiltro[];
    filtriSelezionati: VoceFiltro[];
}

export const MezziInServizioStateDefaults: MezziInServizioStateModel = {
    mezziInServizio: null,
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
    filtriSelezionati: []
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
    static filtriMezziInServizio(state: MezziInServizioStateModel) {
        return state.filtriMezziInServizio;
    }

    @Selector()
    static filtriSelezionati(state: MezziInServizioStateModel) {
        return state.filtriMezziInServizio.filter(f => f.selezionato === true);
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

    @Action(FilterMezziInServizio)
    filterMezziInServizio({ getState }: StateContext<MezziInServizioStateModel>) {
        // TODO: implementare logica mancante
        const state = getState();
        console.log('FilterMezziInServizio');
    }

    @Action(SetFiltroMezziInServizio)
    setFiltroMezziInServizio({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroMezziInServizio) {
        // TODO: implementare logica mancante
        const state = getState();
        dispatch(new FilterMezziInServizio());
        console.log('SetFiltroMezziInServizio', action);
    }

    @Action(ClearFiltriMezziInServizio)
    clearFiltriMezziInServizio({ getState, dispatch }: StateContext<SchedeContattoStateModel>) {
        // TODO: implementare logica mancante
        const state = getState();
        dispatch(new FilterMezziInServizio());
        console.log('ClearFiltriMezziInServizio');
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
