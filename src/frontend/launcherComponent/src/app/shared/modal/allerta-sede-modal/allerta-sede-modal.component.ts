import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { AllertaSedeModalState } from '../../store/states/allerta-sede-modal/allerta-sede-modal.state';
import { LoadingState } from '../../store/states/loading/loading.state';
import { DistaccamentiState } from '../../store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../model/sede.model';
import { AuthState } from '../../../features/auth/store/auth.state';
import { Utente } from '../../model/utente.model';
import { makeCopy } from '../../helper/function-generiche';

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
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    codiceSedeUser: any;

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
        this.getCodiceSedeUser();
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
        this.removeSedeUser();
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

    removeSedeUser(): void {
        const distaccamentiUnique = makeCopy(this.distaccamenti);
        const codiciDistaccamenti = [];
        distaccamentiUnique.forEach(x => codiciDistaccamenti.push(x.codice));
        const indexRemove = codiciDistaccamenti.indexOf(this.codiceSedeUser);
        distaccamentiUnique.splice(indexRemove, 1);
        this.distaccamenti = distaccamentiUnique;
    }

    getCodiceSedeUser(): void {
        this.subscriptions.add(
            this.user$.subscribe((user: any) => {
                this.codiceSedeUser = user.sede.codice;
            })
        );

    }

    onPatchSedi(event: Sede[]): void {
        if (event.length) {
            event.forEach(x => this.sediSelezionate.push(x.codice));
        }
        this.f.sedi.patchValue(event);
    }

    onClearSedi(): void {
        this.sediSelezionate = [];
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
