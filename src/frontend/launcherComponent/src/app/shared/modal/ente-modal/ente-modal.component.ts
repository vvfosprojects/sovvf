import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { CategoriaEnte, Ente } from '../../interface/ente.interface';
import { EntiState } from '../../store/states/enti/enti.state';
import { GetCategorieEnti } from '../../store/actions/enti/enti.actions';

@Component({
    selector: 'app-ente-rubrica-modal',
    templateUrl: './ente-modal.component.html',
    styleUrls: ['./ente-modal.component.css']
})
export class EnteModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(EntiState.categorieEnti) categorieEnti$: Observable<CategoriaEnte[]>;
    @Select(EntiState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    editEnte: Ente;

    enteForm: FormGroup;
    checkboxRicorsivoState: { id: string, status: boolean, label: string, disabled: boolean };
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.getCategorieEnte();
        this.initForm();
        this.getFormValid();
    }

    initForm() {
        this.enteForm = new FormGroup({
            id: new FormControl(),
            codice: new FormControl(),
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
        this.enteForm = this.fb.group({
            id: [null],
            codice: [null],
            descrizione: [null, Validators.required],
            ricorsivo: [null, Validators.required],
            codCategoria: [null, Validators.required],
            indirizzo: [null],
            cap: [null],
            noteEnte: [null],
            email: [null],
            telefono: [null],
            fax: [null]
        });
        this.checkboxRicorsivoState = { id: 'ricorsivo', status: this.f.ricorsivo.value, label: 'Visibile ai Distaccamenti', disabled: false };
    }

    ngOnInit(): void {
        if (this.editEnte) {
            this.updateEnteForm(this.editEnte);
        }
    }

    ngOnDestroy(): void {
        this.enteForm.reset();
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
        return this.enteForm.controls;
    }

    updateEnteForm(editEnte: Ente) {
        console.log('updateEnteForm', editEnte);
        this.store.dispatch(new UpdateFormValue({
            value: {
                id: editEnte.id,
                codice: editEnte.codice,
                descrizione: editEnte.descrizione,
                ricorsivo: editEnte.ricorsivo,
                codCategoria: editEnte.categoria ? editEnte.categoria.codice : null,
                indirizzo: editEnte.indirizzo,
                cap: editEnte.cap,
                noteEnte: editEnte.noteEnte,
                email: editEnte.email,
                telefono: editEnte.telefoni[0] ? editEnte.telefoni[0].numero : undefined,
                fax: editEnte.telefoni[1] ? editEnte.telefoni[1].numero : undefined
            },
            path: 'enti.enteForm'
        }));
        this.checkboxRicorsivoState.status = editEnte.ricorsivo;
    }

    setRicorsivoValue(value: { id: string, status: boolean }) {
        this.checkboxRicorsivoState.status = value.status;
        this.f[value.id].patchValue(value.status);
        this.store.dispatch(new UpdateFormValue({
            value: {
                ...this.enteForm.value,
                ricorsivo: value.status
            },
            path: 'enti.enteForm'
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

    getCategorieEnte() {
        this.store.dispatch(new GetCategorieEnti());
    }

    getTitle(): string {
        let title = 'Aggiungi Voce in Rubrica';
        if (this.editEnte) {
            title = 'Modifica ' + this.editEnte.descrizione;
        }
        return title;
    }
}
