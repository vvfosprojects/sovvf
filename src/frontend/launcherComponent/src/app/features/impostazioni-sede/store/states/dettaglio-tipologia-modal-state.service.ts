import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DetttagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { DettaglioTipologiaDto } from '../../../../shared/interface/dto/dettaglio-tipologia-dto.interface';
import { ClearFormDettaglioTipologia, RequestAddDettaglioTipologia, RequestDeleteDettaglioTipologia, RequestUpdateDettaglioTipologia } from '../actions/add-dettaglio-tipologia-modal.actions';
import { ResponseInterface } from '../../../../shared/interface/response.interface';

export interface DettaglioTipologiaStateModel {
    dettaglioTipologiaForm: {
        model?: {
            codTipologia: string;
            descrizione: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const DettaglioTipologiaModalStateDefaults: DettaglioTipologiaStateModel = {
    dettaglioTipologiaForm: {
        model: {
            codTipologia: undefined,
            descrizione: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@Injectable()
@State<DettaglioTipologiaStateModel>({
    name: 'dettaglioTipologiaModal',
    defaults: DettaglioTipologiaModalStateDefaults
})

export class DettaglioTipologiaModalState {

    @Selector()
    static formValid(state: DettaglioTipologiaStateModel): boolean {
        return state.dettaglioTipologiaForm.status !== 'INVALID';
    }

    constructor(private detttagliTipologieService: DetttagliTipologieService) {
    }

    @Action(RequestAddDettaglioTipologia)
    requestAddDettaglioTipologia({ getState, dispatch }: StateContext<DettaglioTipologiaStateModel>): void {
        const form = getState().dettaglioTipologiaForm.model;
        const newDetttaglioTipologia = {
            codiceTipologia: +form.codTipologia,
            descrizione: form.descrizione,
        } as DettaglioTipologiaDto;

        this.detttagliTipologieService.addDettaglioTipologia(newDetttaglioTipologia).subscribe((response: ResponseInterface) => {
                dispatch(new ClearFormDettaglioTipologia());
            }, (error) => dispatch(new ClearFormDettaglioTipologia())
        );
    }


    @Action(RequestUpdateDettaglioTipologia)
    requestUpdateDettaglioTipologia({ getState, dispatch }: StateContext<DettaglioTipologiaStateModel>): void {
        const form = getState().dettaglioTipologiaForm.model;
        const updatedDetttaglioTipologia = {
            codiceTipologia: +form.codTipologia,
            descrizione: form.descrizione,
        } as DettaglioTipologiaDto;

        this.detttagliTipologieService.updateDettaglioTipologia(updatedDetttaglioTipologia).subscribe((response: ResponseInterface) => {
                dispatch(new ClearFormDettaglioTipologia());
            }, (error) => dispatch(new ClearFormDettaglioTipologia())
        );
    }

    @Action(RequestDeleteDettaglioTipologia)
    requestDeleteEnte({ setState, dispatch }: StateContext<DettaglioTipologiaStateModel>, action: RequestDeleteDettaglioTipologia): void {
        this.detttagliTipologieService.deleteDettagliTipologie(action.codDettaglioTipologia).subscribe((response: ResponseInterface) => {
        });
    }

    @Action(ClearFormDettaglioTipologia)
    clearFormEnte({ patchState }: StateContext<DettaglioTipologiaStateModel>): void {
        patchState({
            dettaglioTipologiaForm: DettaglioTipologiaModalStateDefaults.dettaglioTipologiaForm
        });
    }
}
