import { Selector, State, Action, StateContext } from '@ngxs/store';

// Interface
import { Menu } from '../../../maps/maps-ui/filtro/maps-filtro.service';

// Action
import { SetFiltroMarker } from '../../actions/maps/maps-filtro.actions';
import { makeCopy } from '../../../../../shared/helper/function';

export interface MapsFiltroStateModel {
    filtroMarker: Menu[];
    filtroMarkerAttivo: string[];
}

export const meteoMarkerStateDefaults: MapsFiltroStateModel = {
    filtroMarker: [
        {
            'id': 'richiesta',
            'index': 1,
            'isActive': true,
            'picture': 'icon-fa-richieste',
            'name': 'Richieste'
        },
        {
            'id': 'sede',
            'index': 2,
            'isActive': false,
            'picture': 'icon-fa-sedi',
            'name': 'Sedi'
        },
        {
            'id': 'mezzo',
            'index': 3,
            'isActive': false,
            'picture': 'icon-truck-fire-q',
            'name': 'Mezzi'
        }
    ],
    filtroMarkerAttivo: ['richiesta']
};

@State<MapsFiltroStateModel>({
    name: 'mapsFiltro',
    defaults: meteoMarkerStateDefaults
})
export class MapsFiltroState {

    constructor() {
    }

    @Selector()
    static filtroMarker(state: MapsFiltroStateModel) {
        return state.filtroMarker;
    }

    @Selector()
    static filtroMarkerAttivo(state: MapsFiltroStateModel) {
        return state.filtroMarkerAttivo;
    }

    @Action(SetFiltroMarker)
    setFiltroMarker({ getState, patchState }: StateContext<MapsFiltroStateModel>, action: SetFiltroMarker) {
        const state = getState();
        const filtroMarkerCopy: Menu[] = makeCopy(state.filtroMarker);
        const filtroAttivo: string[] = [];
        const index = state.filtroMarker.findIndex(obj => obj.id === action.selected);
        filtroMarkerCopy[index].isActive = !filtroMarkerCopy[index].isActive;
        filtroMarkerCopy.forEach(r => {
            if (r.isActive) {
                filtroAttivo.push(r.id);
            }
        });
        if (filtroAttivo.length === 3) {
            filtroMarkerCopy.map(r => {
                r.isActive = false;
            });
        }
        patchState({
            ...state,
            filtroMarker: filtroMarkerCopy,
            filtroMarkerAttivo: filtroAttivo
        });
    }
}

