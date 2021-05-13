import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PosModalState } from '../../store/states/pos-modal/pos-modal.state';

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
    formData: FormData;

    submitted: boolean;

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
            descrizionePos: new FormControl()
        });
        this.posForm = this.fb.group({
            descrizionePos: [null, Validators.required]
        });
    }

    get f(): any {
        return this.posForm.controls;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

        if (!this.posForm.valid) {
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
}
