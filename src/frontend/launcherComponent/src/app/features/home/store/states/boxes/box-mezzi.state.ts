import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxMezzi } from '../../../boxes/boxes-model/box-mezzi.model';
import { SetBoxMezzi, ClearBoxMezzi, GetBoxMezzi } from '../../actions/boxes/box-mezzi.actions';
import { Injectable } from '@angular/core';
import { BoxMezziService } from '../../../../../core/service/box-service/box-mezzi.service';

export interface BoxMezziStateModel {
    mezzi: BoxMezzi;
}

export const boxMezziStateDefaults: BoxMezziStateModel = {
    mezzi: null,
};

@Injectable()
@State<BoxMezziStateModel>({
    name: 'boxMezzi',
    defaults: boxMezziStateDefaults
})
export class BoxMezziState {

    constructor(private boxMezziService: BoxMezziService) {
    }

    @Selector()
    static mezzi(state: BoxMezziStateModel): BoxMezzi {
        return state.mezzi;
    }

    @Action(GetBoxMezzi)
    getBoxMezzi({ dispatch }: StateContext<BoxMezziStateModel>): void {
        this.boxMezziService.getDataBoxMezzi().subscribe((data: any) => {
            dispatch([
                new SetBoxMezzi(data.boxMezzi),
            ]);
        });
    }

    @Action(SetBoxMezzi)
    setBoxMezzi({ patchState }: StateContext<BoxMezziStateModel>, action: SetBoxMezzi): void {
        patchState({
            mezzi: action.payload
        });
    }

    @Action(ClearBoxMezzi)
    clearBoxMezzi({ patchState }: StateContext<BoxMezziStateModel>): void {
        patchState(boxMezziStateDefaults);
    }
}
