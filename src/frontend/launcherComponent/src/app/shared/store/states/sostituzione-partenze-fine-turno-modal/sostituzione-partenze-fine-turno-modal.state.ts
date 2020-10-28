import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SostituzioneInterface } from '../../../interface/sostituzione.interface';
import { AddSostituzione, ClearSostituzioneFineTurno, SetListaPartenzeSostituzioneFineTurno, SetPartenzaMontante } from '../../actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';
import { Partenza } from '../../../model/partenza.model';

export interface ModificaPartenzeFineTurnoStateModel {
    partenze: Partenza[];
    partenzaMontante: Partenza;
    sostituzioni: SostituzioneInterface[];
}

export const ModificaPartenzeFineTurnoStateDefaults: ModificaPartenzeFineTurnoStateModel = {
    partenze: null,
    partenzaMontante: null,
    sostituzioni: null
};

@Injectable()
@State<ModificaPartenzeFineTurnoStateModel>({
    name: 'modificaPartenzeFineTurno',
    defaults: ModificaPartenzeFineTurnoStateDefaults
})
export class SostituzionePartenzeFineTurnoModalState {

    @Selector()
    static partenze(state: ModificaPartenzeFineTurnoStateModel): Partenza[] {
        return state.partenze;
    }

    @Selector()
    static partenzaMontante(state: ModificaPartenzeFineTurnoStateModel): Partenza {
        return state.partenzaMontante;
    }

    @Selector()
    static sostituzioni(state: ModificaPartenzeFineTurnoStateModel): SostituzioneInterface[] {
        return state.sostituzioni;
    }

    @Action(SetListaPartenzeSostituzioneFineTurno)
    setListaPartenzeSostituzioneFineTurno({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: SetListaPartenzeSostituzioneFineTurno): void {
        patchState({
            partenze: action.partenze
        });
    }

    @Action(SetPartenzaMontante)
    setPartenzaMontante({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: SetPartenzaMontante): void {
        patchState({
            partenzaMontante: action.partenza
        });
    }

    @Action(AddSostituzione)
    addSostituzione({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: AddSostituzione): void {
        console.log('AddSostituzione', action.sostituzione);
        // TODO: implementare
        // patchState({
        //     sostituzioni: action.sostituzione
        // });
    }

    @Action(ClearSostituzioneFineTurno)
    clearSostituzioneFineTurno({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>): void {
        patchState(ModificaPartenzeFineTurnoStateDefaults);
    }
}
