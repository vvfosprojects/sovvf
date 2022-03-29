import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddDocumentoAreaDocumentale, DeleteDocumentoAreaDocumentale, EditDocumentoAreaDocumentale, ResetDocumentoAreaDocumentaleModal } from '../../actions/documento-area-documentale-modal/documento-area-documentale-modal.actions';
import { AreaDocumentaleService } from 'src/app/core/service/area-documentale-service/area-documentale.service';
import { GetDocumentiAreaDocumentale } from '../../../../features/area-documentale/store/actions/area-documentale/area-documentale.actions';

export interface DocumentoAreaDocumentaleModalStateModel {
    documentoAreaDocumentaleForm: {
        model?: {
            descrizioneDocumento: string;
            descrizioneCategoria: string;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const DocumentoAreaDocumentaleModalStateDefaults: DocumentoAreaDocumentaleModalStateModel = {
    documentoAreaDocumentaleForm: {
        model: {
            descrizioneDocumento: undefined,
            descrizioneCategoria: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    }
};

@Injectable()
@State<DocumentoAreaDocumentaleModalStateModel>({
    name: 'documentoAreaDocumentaleModal',
    defaults: DocumentoAreaDocumentaleModalStateDefaults
})

export class DocumentoAreaDocumentaleState {

    constructor(private areaDocumentaleService: AreaDocumentaleService) {
    }

    @Selector()
    static formValid(state: DocumentoAreaDocumentaleModalStateModel): boolean {
        return state.documentoAreaDocumentaleForm.status !== 'INVALID';
    }

    @Action(AddDocumentoAreaDocumentale)
    addDocumentoAreaDocumentale({ getState, dispatch }: StateContext<DocumentoAreaDocumentaleModalStateModel>, action: AddDocumentoAreaDocumentale): void {
        const state = getState();
        const formValue = state.documentoAreaDocumentaleForm.model;
        const formData = action.formData;
        formData.append('descrizioneDocumento', formValue.descrizioneDocumento);
        formData.append('descrizioneCategoria', formValue.descrizioneCategoria);
        this.areaDocumentaleService.add(formData).subscribe(() => {
            dispatch([
                new ResetDocumentoAreaDocumentaleModal(),
                new GetDocumentiAreaDocumentale()
            ]);
        }, () => dispatch(new ResetDocumentoAreaDocumentaleModal()));
    }

    @Action(EditDocumentoAreaDocumentale)
    editDocumentoAreaDocumentale({ getState, dispatch }: StateContext<DocumentoAreaDocumentaleModalStateModel>, action: EditDocumentoAreaDocumentale): void {
        const state = getState();
        const formValue = state.documentoAreaDocumentaleForm.model;
        let formData = action?.formData;
        if (!formData) {
            formData = new FormData();
        }
        formData.append('id', action.id);
        formData.append('descrizioneDocumento', formValue.descrizioneDocumento);
        formData.append('descrizioneCategoria', formValue.descrizioneCategoria);
        this.areaDocumentaleService.edit(formData).subscribe(() => {
            dispatch([
                new ResetDocumentoAreaDocumentaleModal(),
                new GetDocumentiAreaDocumentale()
            ]);
        }, () => dispatch(new ResetDocumentoAreaDocumentaleModal()));
    }

    @Action(DeleteDocumentoAreaDocumentale)
    deleteDocumentoAreaDocumentale({ dispatch }: StateContext<DocumentoAreaDocumentaleModalStateModel>, action: DeleteDocumentoAreaDocumentale): void {
        this.areaDocumentaleService.delete(action.id).subscribe(() => {
            dispatch([
                new ResetDocumentoAreaDocumentaleModal(),
                new GetDocumentiAreaDocumentale()
            ]);
        }, () => dispatch(new ResetDocumentoAreaDocumentaleModal()));
    }

    @Action(ResetDocumentoAreaDocumentaleModal)
    resetDocumentoAreaDocumentaleModal({ patchState }: StateContext<DocumentoAreaDocumentaleModalStateModel>): void {
        patchState(DocumentoAreaDocumentaleModalStateDefaults);
    }
}
