import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { AllertaSedeModalState } from '../../store/states/allerta-sede-modal/allerta-sede-modal.state';
import { LoadingState } from '../../store/states/loading/loading.state';
import { DistaccamentiState } from '../../store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../model/sede.model';

@Component({
    selector: 'app-allerta-sede-modal',
    templateUrl: './allerta-sede-modal.component.html',
    styleUrls: ['./allerta-sede-modal.component.css']
})
export class AllertaSedeModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(AllertaSedeModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(DistaccamentiState.distaccamenti) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];

    allertaSedeForm: FormGroup;
    submitted: boolean;
    sediSelezionate: string[] = [];

    codRichiesta: string;

    subscriptions: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                private modal: NgbActiveModal) {
        this.initForm();
        this.getFormValid();
        this.getSedi();
    }

    initForm(): void {
        this.allertaSedeForm = new FormGroup({
            codRichiesta: new FormControl(),
            sedi: new FormControl()
        });
        this.allertaSedeForm = this.fb.group({
            codRichiesta: [null, Validators.required],
            sedi: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.f.codRichiesta.patchValue(this.codRichiesta);
    }

    ngOnDestroy(): void {
        this.sediSelezionate = [];
        this.subscriptions.unsubscribe();
    }

    getFormValid(): void {
        this.subscriptions.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    get f(): any {
        return this.allertaSedeForm.controls;
    }

    getSedi(): void {
        this.subscriptions.add(
            this.distaccamenti$.subscribe((sedi: Sede[]) => {
                this.distaccamenti = sedi;
            })
        );
    }

    onPatchSedi(event: Sede[]): void {
        event.forEach(x => this.sediSelezionate.push(x.codice));
        this.f.sedi.patchValue(event);
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.allertaSedeForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.allertaSedeForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }
}
