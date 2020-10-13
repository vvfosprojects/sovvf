import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetRichiestaFissata, ClearRichiestaFissata, SetEspanso, UpdateRichiestaFissata } from '../../actions/richieste/richiesta-fissata.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../../../../../core/service/lista-richieste-service/lista-richieste.service';
import { Injectable } from '@angular/core';

export interface RichiestaFissataStateModel {
    idRichiestaFissata: string;
    richiestaFissata: SintesiRichiesta;
    espanso: boolean;
}

export const RichiestaFissataStateDefaults: RichiestaFissataStateModel = {
    idRichiestaFissata: null,
    richiestaFissata: null,
    espanso: false
};

@Injectable()
@State<RichiestaFissataStateModel>({
    name: 'richiestaFissata',
    defaults: RichiestaFissataStateDefaults
})
export class RichiestaFissataState {

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    @Selector()
    static idRichiestaFissata(state: RichiestaFissataStateModel): string {
        return state.idRichiestaFissata;
    }

    @Selector()
    static richiestaFissata(state: RichiestaFissataStateModel): SintesiRichiesta {
        return state.richiestaFissata;
    }

    @Selector()
    static espanso(state: RichiestaFissataStateModel): boolean {
        return state.espanso;
    }

    @Action(SetRichiestaFissata)
    setRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>, action: SetRichiestaFissata): void {
        this.richiesteService.getRichiestaById(action.codiceRichiesta).subscribe((r: SintesiRichiesta) => {
            patchState({
                idRichiestaFissata: action.idRichiesta,
                richiestaFissata: r
            });
        });
    }

    @Action(UpdateRichiestaFissata)
    updateRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>, action: UpdateRichiestaFissata): void {
        patchState({
            richiestaFissata: action.richiesa
        });
    }

    @Action(ClearRichiestaFissata)
    clearRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>): void {
        patchState(RichiestaFissataStateDefaults);
    }

    @Action(SetEspanso)
    setEspanso({ getState, patchState }: StateContext<RichiestaFissataStateModel>, action: SetEspanso): void {
        const state = getState();
        patchState({
            espanso: action.espanso === undefined ? !state.espanso : action.espanso
        });
    }
}
