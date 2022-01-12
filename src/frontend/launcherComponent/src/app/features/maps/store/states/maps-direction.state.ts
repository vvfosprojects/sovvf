import { Selector, State, Action, StateContext } from '@ngxs/store';
import { DirectionInterface } from '../../maps-interface/direction.interface';
import { SetDirection, ClearDirection, SetDirectionTravelData } from '../actions/maps-direction.actions';
import { Injectable } from '@angular/core';
import { DirectionTravelDataInterface } from '../../maps-interface/direction-travel-data.interface';
import { SetZoomCentroMappaByKilometers } from '../actions/centro-mappa.actions';

export interface MapsDirectionStateModel {
    direction: DirectionInterface;
    travelDataNuovaPartenza: DirectionTravelDataInterface;
    travelDataRichiestaComposizione: DirectionTravelDataInterface;
}

export const mapsDirectionStateDefaults: MapsDirectionStateModel = {
    direction: null,
    travelDataNuovaPartenza: null,
    travelDataRichiestaComposizione: null,
};

@Injectable()
@State<MapsDirectionStateModel>({
    name: 'mapsDirection',
    defaults: mapsDirectionStateDefaults
})
export class MapsDirectionState {

    @Selector()
    static direction(state: MapsDirectionStateModel): DirectionInterface {
        return state.direction;
    }

    @Selector()
    static travelDataNuovaPartenza(state: MapsDirectionStateModel): DirectionTravelDataInterface {
        return state.travelDataNuovaPartenza;
    }

    @Action(SetDirection)
    setDirection({ patchState }: StateContext<MapsDirectionStateModel>, action: SetDirection): void {
        patchState({
            direction: action.direction
        });
    }

    @Action(SetDirectionTravelData)
    setDirectionTravelData({ patchState, dispatch }: StateContext<MapsDirectionStateModel>, action: SetDirectionTravelData): void {
        const totalKilometers = action.travelData.totalKilometers;
        dispatch(new SetZoomCentroMappaByKilometers(totalKilometers));
        if (action.idDirectionSymbols === 'nuovaPartenza') {
            patchState({
                travelDataNuovaPartenza: action.travelData
            });
        } else if (action.idDirectionSymbols === 'partenzeRichiestaComposizione') {
            patchState({
                travelDataRichiestaComposizione: action.travelData
            });
        }
    }

    @Action(ClearDirection)
    clearDirection({ patchState }: StateContext<MapsDirectionStateModel>): void {
        const mapsDirectionOff: DirectionInterface = {
            isVisible: false
        };
        patchState({
            direction: mapsDirectionOff,
            travelDataNuovaPartenza: mapsDirectionStateDefaults.travelDataNuovaPartenza,
            travelDataRichiestaComposizione: mapsDirectionStateDefaults.travelDataRichiestaComposizione
        });
    }
}
