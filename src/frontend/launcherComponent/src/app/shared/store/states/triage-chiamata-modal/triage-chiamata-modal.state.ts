import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { TriageService } from '../../../../core/service/triage/triage.service';
import { GetDettagliTipologieByCodTipologia, ClearDettagliTipologie } from '../../actions/triage-modal/triage-modal.actions';
import { GetDettaglioTipologiaByCodTipologiaDto } from '../../../interface/dto/dettaglio-tipologia-dto.interface';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';

export interface TriageModalStateModel {
    dettagliTipologia: DettaglioTipologia[];
    triage: any;
}

export const TriageModalStateDefaults: TriageModalStateModel = {
    dettagliTipologia: null,
    triage: null
};

@Injectable()
@State<TriageModalStateModel>({
    name: 'triageChiamataModal',
    defaults: TriageModalStateDefaults
})

export class TriageChiamataModalState {

    constructor(private detttagliTipologieService: DetttagliTipologieService,
                private triageService: TriageService) {
    }

    @Selector()
    static dettagliTipologia(state: TriageModalStateModel): DettaglioTipologia[] {
        return state.dettagliTipologia;
    }

    @Selector()
    static triage(state: TriageModalStateModel): any {
        return state.triage;
    }

    @Action(GetDettagliTipologieByCodTipologia)
    getDettagliTipologieByCodTipologia({ patchState }: StateContext<TriageModalStateModel>, action: GetDettagliTipologieByCodTipologia): void {
        this.detttagliTipologieService.getDettaglioTipologiaByCodTipologia(action.codTipologia).subscribe((response: GetDettaglioTipologiaByCodTipologiaDto) => {
            patchState({
                dettagliTipologia: response.listaDettaglioTipologie
            });
        });
    }

    @Action(ClearDettagliTipologie)
    clearDettagliTipologie({ patchState }: StateContext<TriageModalStateModel>): void {
        patchState({
            dettagliTipologia: TriageModalStateDefaults.dettagliTipologia
        });
    }
}
