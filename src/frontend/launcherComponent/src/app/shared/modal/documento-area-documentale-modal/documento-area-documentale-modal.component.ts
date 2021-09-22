import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentoInterface } from 'src/app/shared/interface/documento.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { DocumentoAreaDocumentaleState } from '../../store/states/documento-area-documentale-modal/documento-area-documentale-modal.state';

@Component({
    selector: 'app-documento-area-documentale-modal',
    templateUrl: './documento-area-documentale-modal.component.html',
    styleUrls: ['./documento-area-documentale-modal.component.css']
})
export class DocumentoAreaDocumentaleModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(DocumentoAreaDocumentaleState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    codSede: string;

    categorie = ['Tipo 1', 'Tipo 2', 'Tipo 3'];

    editDocumento: boolean;
    documento: DocumentoInterface;
    documentoFdFile: Blob;
    modifyFDFile: boolean;

    documentoAreaDocumentaleForm: FormGroup;
    formData: FormData;

    submitted: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getFormValid();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.documentoAreaDocumentaleForm = new FormGroup({
            codSede: new FormControl(),
            descrizioneDocumento: new FormControl(),
            descrizioneCategoria: new FormControl()
        });
        this.documentoAreaDocumentaleForm = this.fb.group({
            codSede: [null, Validators.required],
            descrizioneDocumento: [null, Validators.required],
            descrizioneCategoria: [null, Validators.required],
        });

        this.store.dispatch(new UpdateFormValue({
            value: {
                codSede: this.codSede,
                descrizioneCategoria: this.categorie[0]
            },
            path: 'documentoAreaDocumentaleModal.documentoAreaDocumentaleForm'
        }));

        if (this.editDocumento) {
            this.updateDocumentoAreaDocumentaleForm(this.documento);
        }
    }

    get f(): any {
        return this.documentoAreaDocumentaleForm.controls;
    }

    toggleModifyFDFile(): void {
        this.modifyFDFile = !this.modifyFDFile;
    }

    updateDocumentoAreaDocumentaleForm(editDocumento: DocumentoInterface): void {
        console.log('updateDocumentoAreaDocumentaleForm', editDocumento);
        this.documentoAreaDocumentaleForm.patchValue({
            descrizioneDocumento: editDocumento.descrizioneDocumento,
            categoria: editDocumento.descrizioneCategoria
        });

        if (!this.formData) {
            this.formData = new FormData();
            this.formData.append('FDFile', this.documentoFdFile, this.documento.fileName);
        }
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        this.formData = new FormData();
        this.formData.append('FDFile', file);
    }

    onConfirm(): void {
        this.submitted = true;

        if (!this.documentoAreaDocumentaleForm.valid) {
            return;
        }

        this.modal.close({ success: true, formData: this.formData });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(): void {
        this.modal.close({ success: false });
    }

    getTitle(): string {
        return !this.editDocumento ? 'Aggiungi nuovo Documento' : 'Modifica ' + this.documento.descrizioneDocumento;
    }
}
