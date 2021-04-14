import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Sede } from '../../../model/sede.model';
import { GetDistaccamenti, SetDistaccamenti } from '../../actions/distaccamenti/distaccamenti.actions';
import { DistaccamentiService } from '../../../../core/service/distaccamenti-service/distaccamenti-service';

export interface DistaccamentiStateModel {
    distaccamenti: Sede[];
}

export const DistaccamentiStateDefaults: DistaccamentiStateModel = {
    distaccamenti: null
};

@Injectable()
@State<DistaccamentiStateModel>({
    name: 'distaccamenti',
    defaults: DistaccamentiStateDefaults
})

export class DistaccamentiState {

    constructor(private distaccamentiService: DistaccamentiService) {
    }

    @Selector()
    static distaccamenti(state: DistaccamentiStateModel): Sede[] {
        return state.distaccamenti;
    }

    @Action(GetDistaccamenti)
    getDistaccamenti({ dispatch }: StateContext<DistaccamentiStateModel>): void {
        this.distaccamentiService.getDistaccamenti().subscribe((data: Sede[]) => {
            dispatch(new SetDistaccamenti(data));
        });
    }

    @Action(SetDistaccamenti)
    setDistaccamenti({ patchState }: StateContext<DistaccamentiStateModel>, action: SetDistaccamenti): void {
        patchState({
            distaccamenti: action.distaccamenti
        });
    }
}
