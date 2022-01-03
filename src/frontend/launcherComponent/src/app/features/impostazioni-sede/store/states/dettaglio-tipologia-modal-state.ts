import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { DeleteDettaglioTipologiaDto, DettaglioTipologiaDto, UpdateDettaglioTipologiaDto } from '../../../../shared/interface/dto/dettagli-tipologie/dettaglio-tipologia-dto.interface';
import { ClearFormDettaglioTipologia, RequestAddDettaglioTipologia, RequestDeleteDettaglioTipologia, RequestUpdateDettaglioTipologia } from '../actions/dettaglio-tipologia-modal.actions';

export interface DettaglioTipologiaModalStateModel {
    dettaglioTipologiaForm: {
        model?: {
            codTipologia: string;
            descrizione: string;
            codiceDettaglioTipologia: string;
            id: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const DettaglioTipologiaModalStateDefaults: DettaglioTipologiaModalStateModel = {
    dettaglioTipologiaForm: {
        model: {
            codTipologia: undefined,
            descrizione: undefined,
            codiceDettaglioTipologia: undefined,
            id: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@Injectable()
@State<DettaglioTipologiaModalStateModel>({
    name: 'dettaglioTipologiaModal',
    defaults: DettaglioTipologiaModalStateDefaults
})

export class DettaglioTipologiaModalState {

    @Selector()
    static formValid(state: DettaglioTipologiaModalStateModel): boolean {
        return state.dettaglioTipologiaForm.status !== 'INVALID';
    }

    constructor(private store: Store,
                private detttagliTipologieService: DetttagliTipologieService) {
    }

    @Action(RequestAddDettaglioTipologia)
    requestAddDettaglioTipologia({ getState, dispatch }: StateContext<DettaglioTipologiaModalStateModel>): void {
        const form = getState().dettaglioTipologiaForm.model;
        const newDetttaglioTipologia = {
            codiceTipologia: +form.codTipologia,
            descrizione: form.descrizione,
        } as DettaglioTipologiaDto;

        this.detttagliTipologieService.addDettaglioTipologia(newDetttaglioTipologia).subscribe(() => {
                dispatch(new ClearFormDettaglioTipologia());
            }, () => dispatch(new ClearFormDettaglioTipologia())
        );
    }


    @Action(RequestUpdateDettaglioTipologia)
    requestUpdateDettaglioTipologia({ getState, dispatch }: StateContext<DettaglioTipologiaModalStateModel>): void {
        const form = getState().dettaglioTipologiaForm.model;
        const updatedDetttaglioTipologia = {
            id: form.id,
            codiceTipologia: +form.codTipologia,
            descrizione: form.descrizione,
            codiceDettaglioTipologia: +form.codiceDettaglioTipologia
        } as UpdateDettaglioTipologiaDto;

        this.detttagliTipologieService.updateDettaglioTipologia(updatedDetttaglioTipologia).subscribe(() => {
                dispatch(new ClearFormDettaglioTipologia());
            }, () => dispatch(new ClearFormDettaglioTipologia())
        );
    }

    @Action(RequestDeleteDettaglioTipologia)
    requestDeleteDettaglioTipologia({ setState, dispatch }: StateContext<DettaglioTipologiaModalStateModel>, action: RequestDeleteDettaglioTipologia): void {
        const updatedDetttaglioTipologia = {
            codDettaglio: action.codDettaglioTipologia
        } as DeleteDettaglioTipologiaDto;
        this.detttagliTipologieService.deleteDettagliTipologie(updatedDetttaglioTipologia).subscribe(() => {
        });
    }

    @Action(ClearFormDettaglioTipologia)
    clearFormDettaglioTipologia({ patchState }: StateContext<DettaglioTipologiaModalStateModel>): void {
        patchState({
            dettaglioTipologiaForm: DettaglioTipologiaModalStateDefaults.dettaglioTipologiaForm
        });
    }
}
