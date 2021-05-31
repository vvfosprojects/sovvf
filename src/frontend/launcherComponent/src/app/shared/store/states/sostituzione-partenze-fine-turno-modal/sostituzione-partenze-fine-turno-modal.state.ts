import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SostituzioneInterface } from '../../../interface/sostituzione.interface';
import {
    SetSostituzioni,
    ClearSostituzioneFineTurno,
    SetListaPartenzeSostituzioneFineTurno,
    SetPartenzaMontante,
    UpdateSostituzione,
    ConfirmSostituzioni, SetIdRichiestaSostituzioneFineTurno
} from '../../actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';
import { Partenza } from '../../../model/partenza.model';
import { Squadra } from '../../../model/squadra.model';
import { SostituzionePartenzaFineTurnoDto } from '../../../interface/dto/partenze/sostituzione-partenza-fine-turno-dto.interface';
import { patch, updateItem } from '@ngxs/store/operators';
import { ModificaPartenzaService } from '../../../../core/service/modifica-partenza/modifica-partenza.service';

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

    constructor(private modificaPartenzService: ModificaPartenzaService) {
    }

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

    @Selector()
    static disableButtonConferma(state: ModificaPartenzeFineTurnoStateModel): boolean {
        return state.sostituzioni.filter((s: SostituzioneInterface) => !s.codMezzoSmontante)?.length > 0;
    }

    @Action(SetIdRichiestaSostituzioneFineTurno)
    setIdRichiestaSostituzioneFineTurno({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: SetIdRichiestaSostituzioneFineTurno): void {
        patchState({
            idRichiesta: action.idRichiesta
        });
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
                squadreMontanti: [s.nome]
            };
            sostituzioni.push(sostituzione);
        });
        patchState({
            sostituzioni
        });
    }

    @Action(UpdateSostituzione)
    updateSostituzione({ getState, setState }: StateContext<ModificaPartenzeFineTurnoStateModel>, action: UpdateSostituzione): void {
        const state = getState();
        const codMezzoMontante = state.partenzaMontante.mezzo.codice;
        const codMezzoSmontante = action.codMezzoSmontante;
        const squadraMontante = action.squadraMontante;
        const squadraSmontante = action.squadraSmontante;
        const nuovaSostituzione = {
            codMezzoMontante,
            codMezzoSmontante,
            squadreMontanti: squadraMontante ? [squadraMontante] : null,
            squadreSmontanti: squadraSmontante ? [squadraSmontante] : null
        } as SostituzioneInterface;
        setState(
            patch({
                sostituzioni: updateItem<SostituzioneInterface>((s: SostituzioneInterface) => s.squadreMontanti[0] === squadraMontante, nuovaSostituzione)
            })
        );
    }

    @Action(ConfirmSostituzioni)
    confirmSostituzioni({ getState, dispatch }: StateContext<ModificaPartenzeFineTurnoStateModel>): void {
        const state = getState();
        const idRichiesta = state.idRichiesta;
        const sostituzioni = state.sostituzioni;
        const obj = {
            idRichiesta,
            sostituzioni,
            dataOraOperazione: new Date()
        } as SostituzionePartenzaFineTurnoDto;
        this.modificaPartenzService.addSostituzioneFineTurno(obj).subscribe(() => {
            dispatch(new ClearSostituzioneFineTurno());
        }, () => dispatch(new ClearSostituzioneFineTurno()));
    }

    @Action(ClearSostituzioneFineTurno)
    clearSostituzioneFineTurno({ patchState }: StateContext<ModificaPartenzeFineTurnoStateModel>): void {
        patchState(ModificaPartenzeFineTurnoStateDefaults);
    }
}
