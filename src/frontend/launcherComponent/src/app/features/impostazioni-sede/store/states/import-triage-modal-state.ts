import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable, NgZone } from '@angular/core';
import { DettagliTipologieService } from '../../../../core/service/dettagli-tipologie/dettagli-tipologie.service';
import { ResetForm } from '@ngxs/form-plugin';
import { ClearErroreImportTriage, ClearFormImportTriage, GetAllDettagliTipologiaImportTriage, ImportTriageByCodDettaglioTipologia } from '../actions/import-triage-modal.actions';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { ResponseInterface } from '../../../../shared/interface/response/response.interface';
import { StartLoading, StopLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { TreeviewItem } from 'ngx-treeview';
import { TriageService } from '../../../../core/service/triage/triage.service';
import { TriageCrudState } from '../../../../shared/store/states/triage-crud/triage-crud.state';
import { ItemTriageData } from '../../../../shared/interface/item-triage-data.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetTriageByCodDettaglioTipologia } from '../../../../shared/store/actions/triage-crud/triage-crud.actions';

export interface ImportTriageModalStateModel {
    importTriageForm: {
        model?: {
            dettaglioTipologia: DettaglioTipologia;
            codiceDettaglioTipologia: number;
            codTipologia: number;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
    dettagliTipologie: DettaglioTipologia[];
    errore: string;
}

export const ImportTriageModalStateDefaults: ImportTriageModalStateModel = {
    importTriageForm: {
        model: {
            dettaglioTipologia: undefined,
            codiceDettaglioTipologia: undefined,
            codTipologia: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    },
    dettagliTipologie: null,
    errore: undefined
};

@Injectable()
@State<ImportTriageModalStateModel>({
    name: 'importTriageModal',
    defaults: ImportTriageModalStateDefaults
})

export class ImportTriageModalState {

    @Selector()
    static formValid(state: ImportTriageModalStateModel): boolean {
        return state.importTriageForm.status !== 'INVALID';
    }

    @Selector()
    static dettagliTipologie(state: ImportTriageModalStateModel): DettaglioTipologia[] {
        return state.dettagliTipologie;
    }

    @Selector()
    static errore(state: ImportTriageModalStateModel): string {
        return state.errore;
    }

    constructor(private detttagliTipologieService: DettagliTipologieService,
                private triageService: TriageService,
                private store: Store,
                private modalService: NgbModal,
                private ngZone: NgZone) {
    }

    @Action(GetAllDettagliTipologiaImportTriage)
    getAllDettagliTipologiaImportTriage({ patchState, dispatch }: StateContext<ImportTriageModalStateModel>): void {
        dispatch(new StartLoading());
        this.detttagliTipologieService.getDettagliTipologie().subscribe((response: ResponseInterface) => {
            patchState({
                dettagliTipologie: response.dataArray
            });
            dispatch(new StopLoading());
        });
    }

    @Action(ImportTriageByCodDettaglioTipologia)
    importTriageByCodDettaglioTipologia({ getState, patchState, dispatch }: StateContext<ImportTriageModalStateModel>): void {
        const state = getState();
        const codDettaglioTipologia = state.importTriageForm.model?.codiceDettaglioTipologia;
        const codTipologia = state.importTriageForm.model?.codTipologia;
        const dettaglioTipologiaSelezionatoCrudTriage = this.store.selectSnapshot(TriageCrudState.dettaglioTipologia);
        if (codDettaglioTipologia && codTipologia) {
            this.triageService.get(codTipologia, codDettaglioTipologia).subscribe((response: { triage: { id: string, data: TreeviewItem }, triageData }) => {
                if (response.triage) {
                    response.triageData?.forEach((data: ItemTriageData) => {
                        data.id = null;
                        data.codiceTipologia = null;
                        data.codiceDettaglioTipologia = null;
                    });

                    this.triageService.add(dettaglioTipologiaSelezionatoCrudTriage.codiceTipologia, dettaglioTipologiaSelezionatoCrudTriage.codiceDettaglioTipologia, response.triage.data, response.triageData).subscribe(() => {
                        this.ngZone.run(() => this.modalService.dismissAll());
                        dispatch([
                            new ClearFormImportTriage(),
                            new ClearErroreImportTriage(),
                            new GetTriageByCodDettaglioTipologia(dettaglioTipologiaSelezionatoCrudTriage.codiceTipologia, dettaglioTipologiaSelezionatoCrudTriage.codiceDettaglioTipologia),
                            new StopLoading()
                        ]);
                    }, () => {
                        dispatch([
                            new ClearFormImportTriage(),
                            new ClearErroreImportTriage(),
                            new StopLoading()
                        ]);
                    });
                } else {
                    patchState({
                        errore: 'Triage non presente'
                    });
                }
            }, () => {
                dispatch([
                    new ClearFormImportTriage(),
                    new ClearErroreImportTriage(),
                    new StopLoading()
                ]);
            });
        }
    }

    @Action(ClearErroreImportTriage)
    clearErroreImportTriage({ patchState }: StateContext<ImportTriageModalStateModel>): void {
        patchState({
            errore: ImportTriageModalStateDefaults.errore
        });
    }

    @Action(ClearFormImportTriage)
    clearFormImportTriage({ dispatch }: StateContext<ImportTriageModalStateModel>): void {
        dispatch(new ResetForm({ path: 'importTriageModal.importTriageForm' }));
    }
}
