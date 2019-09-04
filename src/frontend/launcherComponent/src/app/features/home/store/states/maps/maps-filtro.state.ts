import { Selector, State, Action, StateContext, Store, Select } from '@ngxs/store';
import { makeCopy } from '../../../../../shared/helper/function';
import {
    ClearCopiaFiltroAttivo,
    CopiaFiltroAttivo,
    SetFiltriMarker,
    SetFiltroMarker
} from '../../actions/maps/maps-filtro.actions';
import { MarkerFiltro } from '../../../../../shared/interface/marker-filtro.interface';
import { BoxClickInterface } from '../../../boxes/box-interface/box-click-interface';
import { Observable, Subscription } from 'rxjs';
import { BoxClickState } from '../boxes/box-click.state';
import { OpacizzaMezziMarkers } from '../../actions/maps/mezzi-markers.actions';
import { OpacizzaRichiesteMarkers } from '../../actions/maps/richieste-markers.actions';
import { ClearMarkerOpachiMezzi, ClearMarkerOpachiRichieste } from '../../actions/maps/marker-opachi.actions';

export interface MapsFiltroStateModel {
    filtroMarker: MarkerFiltro[];
    filtroMarkerAttivo: string[];
    filtroMarkerAttivoCopy: string[];
}

export const MapsFiltroStateDefaults: MapsFiltroStateModel = {
    filtroMarker: [
        {
            id: 'richiesta',
            index: 1,
            isActive: true,
            picture: 'icon-fa-richieste',
            name: 'Richieste'
        },
        {
            id: 'sede',
            index: 2,
            isActive: false,
            picture: 'icon-fa-sedi',
            name: 'Sedi'
        },
        {
            id: 'mezzo',
            index: 3,
            isActive: false,
            picture: 'icon-truck-fire-q',
            name: 'Mezzi'
        }
    ],
    filtroMarkerAttivo: ['richiesta'],
    filtroMarkerAttivoCopy: null
};

@State<MapsFiltroStateModel>({
    name: 'mapsFiltro',
    defaults: MapsFiltroStateDefaults
})
export class MapsFiltroState {

    private subscription = new Subscription();
    @Select(BoxClickState.boxClick) boxClick$: Observable<BoxClickInterface>;

    constructor(private store: Store) {
        this.subscription.add(
            this.boxClick$.subscribe((boxClick: BoxClickInterface) => {
                if (boxClick) {
                    this.checkBoxClick(boxClick);
                }
            }));
    }

    @Selector()
    static filtroMarker(state: MapsFiltroStateModel): MarkerFiltro[] {
        return state.filtroMarker;
    }

    @Selector()
    static filtroMarkerAttivo(state: MapsFiltroStateModel): string[] {
        return state.filtroMarkerAttivo;
    }

    @Selector()
    static filtroMarkerAttivoCopy(state: MapsFiltroStateModel): string[] {
        return state.filtroMarkerAttivoCopy;
    }

    @Action(SetFiltroMarker)
    setFiltroMarker({ getState, patchState }: StateContext<MapsFiltroStateModel>, action: SetFiltroMarker) {
        const state = getState();
        const filtroMarkerCopy: MarkerFiltro[] = makeCopy(state.filtroMarker);
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

    @Action(SetFiltriMarker)
    setFiltriMarker({ getState, patchState }: StateContext<MapsFiltroStateModel>, action: SetFiltriMarker) {
        const state = getState();
        const filtroMarkerCopy: MarkerFiltro[] = makeCopy(state.filtroMarker);
        filtroMarkerCopy.forEach(r => {
            if (action.selected) {
                action.selected.includes(r.id) ? r.isActive = true : r.isActive = false;
            }
        });
        patchState({
            ...state,
            filtroMarker: filtroMarkerCopy,
            filtroMarkerAttivo: action.selected
        });
        console.log('SetFiltriMarker');
    }

    @Action(CopiaFiltroAttivo)
    copiaFiltroAttivo({ getState, patchState }: StateContext<MapsFiltroStateModel>) {
        const state = getState();
        patchState({
            ...state,
            filtroMarkerAttivoCopy: state.filtroMarkerAttivo
        });
    }

    @Action(ClearCopiaFiltroAttivo)
    clearCopiaFiltroAttivo({ patchState }: StateContext<MapsFiltroStateModel>) {
        patchState({
            filtroMarkerAttivoCopy: MapsFiltroStateDefaults.filtroMarkerAttivoCopy
        });
    }

    checkBoxClick(boxClick: BoxClickInterface) {
        const filtroAttivoCopy: string[] = this.store.selectSnapshot(MapsFiltroState.filtroMarkerAttivoCopy);
        if (boxClick) {
            const filtroCheckBox = [];
            if (Object.values(boxClick.mezzi).indexOf(true) >= 0) {
                pushFiltro('mezzo', filtroCheckBox);
                const mezziState = Object.keys(boxClick.mezzi).filter(key => {
                    return boxClick.mezzi[key];
                });
                this.store.dispatch(new OpacizzaMezziMarkers(mezziState));
            } else {
                this.store.dispatch(new OpacizzaMezziMarkers());
                this.store.dispatch(new ClearMarkerOpachiMezzi());
            }

            if (Object.values(boxClick.richieste).indexOf(true) >= 0) {
                pushFiltro('richiesta', filtroCheckBox);
                const richiesteState = Object.keys(boxClick.richieste).filter(key => {
                    return boxClick.richieste[key];
                });
                this.store.dispatch(new OpacizzaRichiesteMarkers(richiesteState));
            } else {
                this.store.dispatch(new ClearMarkerOpachiRichieste());
                this.store.dispatch(new OpacizzaRichiesteMarkers());
            }

            if (filtroCheckBox.length !== 0) {
                if (!filtroAttivoCopy) {
                    this.store.dispatch(new CopiaFiltroAttivo());
                }
                this.store.dispatch(new SetFiltriMarker(filtroCheckBox));
            } else {
                if (filtroAttivoCopy) {
                    this.store.dispatch(new SetFiltriMarker(filtroAttivoCopy));
                    this.store.dispatch(new ClearCopiaFiltroAttivo());
                }
            }
        }

        function pushFiltro(string: string, array: any[]) {
            if (!array.includes(string)) {
                array.push(string);
            }
        }
    }
}
