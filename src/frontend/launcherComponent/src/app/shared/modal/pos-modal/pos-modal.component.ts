import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PosModalState } from '../../store/states/pos-modal/pos-modal.state';
import { environment } from '../../../../environments/environment';
import { LSNAME } from '../../../core/settings/config';
import { AngularFileUploaderConfig } from 'angular-file-uploader';

@Component({
    selector: 'app-pos-modal',
    templateUrl: './pos-modal.component.html',
    styleUrls: ['./pos-modal.component.css']
})
export class PosModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(PosModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    posForm: FormGroup;
    submitted: boolean;

    uploadVisible: boolean;

    api = environment.baseUrl + environment.apiUrl.pos as string;
    token = sessionStorage.getItem(LSNAME.token) as string;
    afuConfig = {
        multiple: false,
        formatsAllowed: '.pdf,.doc,.docx',
        uploadAPI: {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
                Authorization: `Bearer ${this.token}`
            },
            url: this.api,
            responseType: 'blob',
        },
        fileNameIndex: true,
        hideProgressBar: true,
        hideResetBtn: true,
        replaceTexts: {
            selectFileBtn: 'Seleziona documento',
            resetBtn: 'Reset',
            uploadBtn: 'Carica P.O.S',
            attachPinBtn: 'Allega P.O.S',
            afterUploadMsg_success: 'Caricamento P.O.S. completato!',
            afterUploadMsg_error: 'Caricamento P.O.S. fallito!',
            sizeLimit: 'Limite Documento'
        }
    } as AngularFileUploaderConfig;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
    }

    ngOnInit(): void {
    }

    initForm(): void {
        this.posForm = new FormGroup({
            descrizione: new FormControl()
        });
        this.posForm = this.fb.group({
            descrizione: [null, Validators.required]
        });
    }

    get f(): any {
        return this.posForm.controls;
    }

    ngOnDestroy(): void {
        this.posForm.reset();
        this.subscription.unsubscribe();
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    onProsegui(): void {
        this.submitted = true;

        if (!this.posForm.valid) {
            return;
        }

        this.uploadVisible = true;
    }

    onDocUploaded($event: any): void {
        console.log('onDocUploaded', $event);
        if ($event.ok) {
            this.modal.close({ success: true, result: this.posForm.value });
        }
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }
}
