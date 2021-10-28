import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxInterventi } from '../../../boxes/boxes-model/box-interventi.model';
import { ClearBoxRichieste, GetBoxRichieste, SetBoxRichieste } from '../../actions/boxes/box-richieste.actions';
import { Injectable } from '@angular/core';
import { BoxRichiesteService } from '../../../../../core/service/box-service/box-richieste.service';

export interface BoxRichiesteStateModel {
    richieste: BoxInterventi;
}

export const boxRichiesteStateDefaults: BoxRichiesteStateModel = {
    richieste: null,
};

@Injectable()
@State<BoxRichiesteStateModel>({
    name: 'boxRichieste',
    defaults: boxRichiesteStateDefaults
})
export class BoxRichiesteState {

    constructor(private boxRichiesteService: BoxRichiesteService) {
    }

    @Selector()
    static richieste(state: BoxRichiesteStateModel): BoxInterventi {
        return state.richieste;
    }

    @Action(GetBoxRichieste)
    getBoxMezzi({ dispatch }: StateContext<BoxRichiesteStateModel>): void {
        this.boxRichiesteService.getDataBoxRichieste().subscribe((data: any) => {
            dispatch([
                new SetBoxRichieste(data.boxRichieste),
            ]);
        });
    }

    @Action(SetBoxRichieste)
    setBoxRichieste({ patchState }: StateContext<BoxRichiesteStateModel>, action: SetBoxRichieste): void {
        patchState({
            richieste: action.payload
        });
    }

    @Action(ClearBoxRichieste)
    clearBoxRichieste({ patchState }: StateContext<BoxRichiesteStateModel>): void {
        patchState(boxRichiesteStateDefaults);
    }
}
