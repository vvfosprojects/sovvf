import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fonogramma } from '../../model/fonogramma.model';
import { Select } from '@ngxs/store';
import { ImpostazioniState } from '../../store/states/impostazioni/impostazioni.state';
import { Observable, Subscription } from 'rxjs';
import { getStatoFonogrammaStringByEnum } from '../../helper/function-fonogramma';

@Component({
    selector: 'app-modifica-fonogramma-modal',
    templateUrl: './modifica-fonogramma-modal.component.html',
    styleUrls: ['./modifica-fonogramma-modal.component.css']
})
export class ModificaFonogrammaModalComponent implements OnInit, OnDestroy {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    codiceRichiesta: string;
    idRichiesta: string;
    fonogramma: Fonogramma;

    modificaStatoFonogrammaForm: FormGroup;
    submitted: boolean;

    statiFonogramma = [
        'Inviato',
        'Da Inviare'
    ];

    subscription: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getNightMode();
    }

    ngOnInit(): void {
        this.idRichiesta ? this.f.idRichiesta.patchValue(this.idRichiesta) : this.f.idRichiesta.patchValue('');
        this.codiceRichiesta ? this.f.codiceRichiesta.patchValue(this.codiceRichiesta) : this.f.codiceRichiesta.patchValue('');
        this.fonogramma && this.fonogramma.numeroFonogramma ? this.f.numeroFonogramma.patchValue(this.fonogramma.numeroFonogramma) : this.f.numeroFonogramma.patchValue('');
        this.fonogramma && this.fonogramma.protocolloFonogramma ? this.f.protocolloFonogramma.patchValue(this.fonogramma.protocolloFonogramma) : this.f.protocolloFonogramma.patchValue('');
        this.fonogramma && this.fonogramma.destinatari ? this.f.destinatari.patchValue(this.fonogramma.destinatari) : this.f.destinatari.patchValue('');
        this.fonogramma && this.fonogramma.stato ? this.f.stato.patchValue(getStatoFonogrammaStringByEnum(this.fonogramma.stato)) : this.f.stato.patchValue(null);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.modificaStatoFonogrammaForm = this.fb.group({
            idRichiesta: ['', Validators.required],
            codiceRichiesta: ['', Validators.required],
            numeroFonogramma: ['', Validators.required],
            protocolloFonogramma: ['', Validators.required],
            destinatari: ['', Validators.required],
            stato: ['', Validators.required]
        });
        this.f.codiceRichiesta.disable();
    }

    get f(): any {
        return this.modificaStatoFonogrammaForm.controls;
    }

    getNightMode(): void {
        this.subscription.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.nightMode = nightMode;
            })
        );
    }

    onNightMode(): string {
        let value = '';
        if (!this.nightMode) {
            value = '';
        } else if (this.nightMode) {
            value = 'moon-text moon-mode';
        }
        return value;
    }

    onSubmit(): void {
        this.submitted = true;

        if (!this.modificaStatoFonogrammaForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.modificaStatoFonogrammaForm.value });
    }

    onCancel(): void {
        this.modal.close({ status: 'ko', result: null });
    }
}
