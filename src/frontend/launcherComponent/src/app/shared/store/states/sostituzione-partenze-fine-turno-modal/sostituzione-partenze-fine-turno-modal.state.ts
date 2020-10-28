import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SostituzioneInterface } from '../../../interface/sostituzione.interface';
import { SetSostituzioni, ClearSostituzioneFineTurno, SetListaPartenzeSostituzioneFineTurno, SetPartenzaMontante, UpdateSostituzione, ConfirmSostituzioni } from '../../actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';
import { Partenza } from '../../../model/partenza.model';
import { Squadra } from '../../../model/squadra.model';
import { SostituzionePartenzaFineTurnoDtoInterface } from '../../../interface/dto/sostituzione-partenza-fine-turno-dto.interface';

export interface ModificaPartenzeFineTurnoStateModel {
    idRichiesta: string;
    partenze: Partenza[];
    partenzaMontante: Partenza;
    sostituzioni: SostituzioneInterface[];
}

export const ModificaPartenzeFineTurnoStateDefaults: ModificaPartenzeFineTurnoStateModel = {
    idRichiesta: undefined,
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
    setPartenzaMontante({ patchState, dispatch }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: SetPartenzaMontante): void {
        patchState({
            partenzaMontante: action.partenza
        });
        dispatch(new SetSostituzioni());
    }

    @Action(SetSostituzioni)
    setSostituzioni({ getState, patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>): void {
        const state = getState();
        const partenzaMontate = state.partenzaMontante;
        const sostituzioni = [];
        partenzaMontate.squadre.forEach((s: Squadra) => {
            const sostituzione = {
                codMezzoSmontante: undefined,
                squadreSmontanti: null,
                codMezzoMontante: partenzaMontate.mezzo.codice,
                squadreMontanti: [s.id]
            };
            sostituzioni.push(sostituzione);
        });
        patchState({
            sostituzioni
        });
    }

    @Action(UpdateSostituzione)
    updateSostituzione({ getState, patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: UpdateSostituzione): void {
        console.log('UpdateSostituzione, squadra montante', action.codSquadraMontante);
        const codSquadraMontante = action.codSquadraMontante;
        const codSquadraSmontante = action.codSquadraSmontante;
        const codMezzoSmontante = action.codMezzoSmontante;
        const state = getState();
        const sostituzione = state.sostituzioni.filter((s: SostituzioneInterface) => s.squadreMontanti.includes(codSquadraMontante));
        console.log('Sostituzione da aggiornare', sostituzione);
    }

    @Action(ConfirmSostituzioni)
    confirmSostituzioni({ getState }: StateContext<ModificaPartenzeFineTurnoStateModel>): void {
        const state = getState();
        const idRichiesta = state.idRichiesta;
        const sostituzioni = state.sostituzioni;
        const obj = {
            idRichiesta,
            sostituzioni,
            dataOraOperazione: new Date()
        } as SostituzionePartenzaFineTurnoDtoInterface;
        console.log('ConfirmSostituzioni', obj);
        // TODO: creare service
    }

    @Action(ClearSostituzioneFineTurno)
    clearSostituzioneFineTurno({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>): void {
        patchState(ModificaPartenzeFineTurnoStateDefaults);
    }
}
