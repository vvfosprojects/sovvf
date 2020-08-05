import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { RubricaState } from '../../../features/rubrica/store/states/rubrica/rubrica.state';
import { CategoriaVoceRubrica } from '../../interface/rubrica.interface';
import { ClearFormVoceRubrica } from '../../../features/rubrica/store/actions/rubrica/rubrica.actions';

@Component({
    selector: 'app-voce-rubrica-modal',
    templateUrl: './voce-rubrica-modal.component.html',
    styleUrls: ['./voce-rubrica-modal.component.css']
})
export class VoceRubricaModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(RubricaState.categorieVoceRubrica) categorieVoceRubrica$: Observable<CategoriaVoceRubrica[]>;
    @Select(RubricaState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    voceRubricaForm: FormGroup;
    checkboxRicorsivoState: { id: string, status: boolean, label: string, disabled: boolean };
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
    }

    initForm() {
        this.voceRubricaForm = new FormGroup({
            descrizione: new FormControl(),
            ricorsivo: new FormControl(),
            codCategoria: new FormControl(),
            indirizzo: new FormControl(),
            cap: new FormControl(),
            noteEnte: new FormControl(),
            email: new FormControl(),
            telefono: new FormControl(),
            fax: new FormControl()
        });
        this.voceRubricaForm = this.fb.group({
            descrizione: [null, Validators.required],
            ricorsivo: [null, Validators.required],
            codCategoria: [null, Validators.required],
            indirizzo: [null, Validators.required],
            cap: [null, Validators.required],
            noteEnte: [null],
            email: [null],
            telefono: [null],
            fax: [null]
        });
        this.checkboxRicorsivoState = { id: 'ricorsivo', status: this.f.ricorsivo.value, label: 'Visibile ai Distaccamenti', disabled: false };
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getFormValid() {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    get f() {
        return this.voceRubricaForm.controls;
    }

    setRicorsivoValue(value: { id: string, status: boolean }) {
        this.checkboxRicorsivoState.status = value.status;
        this.f[value.id].patchValue(value.status);
        this.store.dispatch(new UpdateFormValue({
            value: {
                ...this.voceRubricaForm.value,
                ricorsivo: value.status
            },
            path: 'gestioneUtenti.voceRubricaForm'
        }));
    }

    onConferma() {
        this.submitted = true;

        if (!this.formValid) {
            return;
        }

        this.modal.close({ success: true });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }
}
