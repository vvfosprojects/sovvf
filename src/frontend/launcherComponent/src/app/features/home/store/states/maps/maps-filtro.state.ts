import { Selector, State, Action, StateContext } from '@ngxs/store';

// Model
import { BoxClickArrayInterface } from '../../../boxes/box-interface/box-click-interface';

// Interface
import { Menu } from '../../../maps/maps-ui/filtro/maps-filtro.service';

// Action
import { SetVociMenu } from '../../actions/maps/maps-filtro.actions';

export interface MapsFiltroStateModel {
    vociMenu: Menu[];
    filtroBoxes: BoxClickArrayInterface;
    filtroMarker: Menu[];
    filtroAttivo: string[];
}

export const meteoMarkerStateDefaults: MapsFiltroStateModel = {
    vociMenu: [],
    filtroBoxes: null,
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
    filtroAttivo: ['richiesta']
};

@State<MapsFiltroStateModel>({
    name: 'mapsFiltro',
    defaults: meteoMarkerStateDefaults
})
export class MapsFiltroState {

    constructor() { }

    @Selector()
    static vociMenu(state: MapsFiltroStateModel) {
        return state.vociMenu;
    }

    @Action(SetVociMenu)
    setVociMenu({ getState, patchState }: StateContext<MapsFiltroStateModel>, action: SetVociMenu) {
        const state = getState();

        patchState({
            ...state,
            vociMenu: action.vociMenu
        });
    }
}

