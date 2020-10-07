import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetRichiestaHover, ClearRichiestaHover } from '../../actions/richieste/richiesta-hover.actions';
import { Injectable } from '@angular/core';

export interface RichiestaHoverStateModel {
    idRichiestaHover: string;
}

export const RichiestaHoverStateDefaults: RichiestaHoverStateModel = {
    idRichiestaHover: null
};

@Injectable()
@State<RichiestaHoverStateModel>({
    name: 'richiestaHover',
    defaults: RichiestaHoverStateDefaults
})
export class RichiestaHoverState {

    @Selector()
    static idRichiestaHover(state: RichiestaHoverStateModel): string {
        return state.idRichiestaHover;
    }

    @Action(SetRichiestaHover)
    setRichiestaHover({ patchState }: StateContext<RichiestaHoverStateModel>, action: SetRichiestaHover): void {
        patchState({
            idRichiestaHover: action.idRichiesta
        });
    }

    @Action(ClearRichiestaHover)
    clearRichiestaHover({ patchState }: StateContext<RichiestaHoverStateModel>): void {
        patchState({
            idRichiestaHover: null
        });
    }
}
