import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrasferimentoChiamataModalState } from '../../store/states/trasferimento-chiamata-modal/trasferimento-chiamata-modal.state';
import { GetRichiesteTrasferibili } from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { DistaccamentiState } from '../../store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../model/sede.model';
import { UpdateFormValue } from '@ngxs/form-plugin';

@Component({
    selector: 'app-trasferimento-chiamata-modal',
    templateUrl: './trasferimento-chiamata-modal.component.html',
    styleUrls: ['./trasferimento-chiamata-modal.component.css']
})
export class TrasferimentoChiamataModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(TrasferimentoChiamataModalState.codiciRichiesteTrasferibili) codiciRichiesteTrasferibili$: Observable<string[]>;
    @Select(TrasferimentoChiamataModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(DistaccamentiState.sediTrasferimenti) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];

    codRichiesta: string;

    trasferimentoChiamataForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
        this.getSedi();
    }

    ngOnInit(): void {
        this.store.dispatch(
            new UpdateFormValue({
                path: 'trasferimentoChiamataModal.trasferimentoChiamataForm',
                value: {
                    codiceRichiesta: this.codRichiesta ? this.codRichiesta : null
                }
            })
        );
        if (!this.codRichiesta) {
            this.getCodiciRichiesteTrasferibili();
        } else {
            this.f.codiceRichiesta.disable();
        }
    }

    initForm(): void {
        this.trasferimentoChiamataForm = new FormGroup({
            codiceRichiesta: new FormControl(),
            sedeDa: new FormControl(),
            sedeA: new FormControl()
        });
        this.trasferimentoChiamataForm = this.fb.group({
            codiceRichiesta: [null, Validators.required],
            sedeDa: [null],
            sedeA: [null, Validators.required],
        });
    }

    get f(): any {
        return this.trasferimentoChiamataForm.controls;
    }

    ngOnDestroy(): void {
        this.trasferimentoChiamataForm.reset();
        this.subscription.unsubscribe();
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    getTitle(): string {
        let title = 'Trasferimento Chiamata';
        if (this.codRichiesta) {
            title = 'Trasferisci la Chiamata ' + this.codRichiesta;
        }
        return title;
    }

    getSedi(): void {
        this.subscription.add(
            this.distaccamenti$.subscribe((sedi: Sede[]) => {
                this.distaccamenti = sedi;
            })
        );
    }

    onPatchSedi(event: Sede): void {
        this.f.sedeA.patchValue(event);
    }

    getCodiciRichiesteTrasferibili(): void {
        this.store.dispatch(new GetRichiesteTrasferibili());
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.trasferimentoChiamataForm.valid) {
            return;
        }
        this.modal.close({ success: true, result: this.trasferimentoChiamataForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }
}
