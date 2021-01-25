import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ClearDettagliTipologie, ClearTriage, GetDettagliTipologieByCodTipologia, GetTriageByCodDettaglioTipologia, SetDettaglioTipologiaTriage } from '../../actions/triage/triage.actions';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';
import { TriageService } from '../../../../core/service/triage/triage.service';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettaglio-tipologia-dto.interface';

export interface TriageStateModel {
    dettagliTipologie: DettaglioTipologia[];
    dettaglioTipologia: DettaglioTipologia;
    triage: any;
}

export const TriageStateDefaults: TriageStateModel = {
    dettagliTipologie: null,
    dettaglioTipologia: null,
    triage: null
};

@Injectable()
@State<TriageStateModel>({
    name: 'triage',
    defaults: TriageStateDefaults
})

export class TriageState {

    constructor(private detttagliTipologieService: DetttagliTipologieService,
                private triageService: TriageService) {
    }

    @Selector()
    static dettagliTipologie(state: TriageStateModel): DettaglioTipologia[] {
        return state.dettagliTipologie;
    }

    @Selector()
    static dettaglioTipologia(state: TriageStateModel): DettaglioTipologia {
        return state.dettaglioTipologia;
    }

    @Action(GetDettagliTipologieByCodTipologia)
    getDettagliTipologieByCodTipologia({ patchState }: StateContext<TriageStateModel>, action: GetDettagliTipologieByCodTipologia): void {
        this.detttagliTipologieService.getDettaglioTipologiaByCodTipologia(action.codTipologia).subscribe((response: GetDettaglioTipologiaByCodTipologiaDto) => {
            patchState({
                dettagliTipologie: response.listaDettaglioTipologie
            });
        });
    }

    @Action(ClearDettagliTipologie)
    clearDettagliTipologie({ patchState }: StateContext<TriageStateModel>): void {
        patchState({
            dettagliTipologie: TriageStateDefaults.dettagliTipologie
        });
    }

    @Action(SetDettaglioTipologiaTriage)
    setDettaglioTipologiaTriage({ getState, patchState }: StateContext<TriageStateModel>, action: SetDettaglioTipologiaTriage): void {
        const dettaglioTipologia = getState().dettagliTipologie.filter((dT: DettaglioTipologia) => dT.codiceDettaglioTipologia === action.codDettaglioTipologia)[0];
        patchState({
            dettaglioTipologia
        });
    }

    @Action(GetTriageByCodDettaglioTipologia)
    getTriageByCodDettaglioTipologia({ patchState }: StateContext<TriageStateModel>, action: GetTriageByCodDettaglioTipologia): void {
        this.triageService.getTriage(action.codDettaglioTipologia).subscribe((triage: any) => {
            patchState({
                triage
            });
        });
    }

    @Action(ClearTriage)
    clearTriage({ patchState }: StateContext<TriageStateModel>): void {
        patchState({
            triage: null
        });
    }
}
