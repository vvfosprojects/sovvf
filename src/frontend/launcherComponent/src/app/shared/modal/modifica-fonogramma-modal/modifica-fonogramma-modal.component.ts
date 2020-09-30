import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fonogramma } from '../../model/fonogramma.model';
import { getStatoFonogrammaStringByEnum } from '../../helper/function';

@Component({
    selector: 'app-modifica-fonogramma-modal',
    templateUrl: './modifica-fonogramma-modal.component.html',
    styleUrls: ['./modifica-fonogramma-modal.component.css']
})
export class ModificaFonogrammaModalComponent implements OnInit {

    codiceRichiesta: string;
    idRichiesta: string;
    fonogramma: Fonogramma;

    modificaStatoFonogrammaForm: FormGroup;
    submitted: boolean;

    statiFonogramma = [
        'Inviato',
        'Da Inviare'
    ];

    constructor(public modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
    }

    ngOnInit() {
        this.idRichiesta ? this.f.idRichiesta.patchValue(this.idRichiesta) : this.f.idRichiesta.patchValue('');
        this.codiceRichiesta ? this.f.codiceRichiesta.patchValue(this.codiceRichiesta) : this.f.codiceRichiesta.patchValue('');
        this.fonogramma && this.fonogramma.numeroFonogramma ? this.f.numeroFonogramma.patchValue(this.fonogramma.numeroFonogramma) : this.f.numeroFonogramma.patchValue('');
        this.fonogramma && this.fonogramma.protocolloFonogramma ? this.f.protocolloFonogramma.patchValue(this.fonogramma.protocolloFonogramma) : this.f.protocolloFonogramma.patchValue('');
        this.fonogramma && this.fonogramma.destinatari ? this.f.destinatari.patchValue(this.fonogramma.destinatari) : this.f.destinatari.patchValue('');
        this.fonogramma && this.fonogramma.stato ? this.f.stato.patchValue(getStatoFonogrammaStringByEnum(this.fonogramma.stato)) : this.f.stato.patchValue(null);
    }

    initForm() {
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

    get f() {
        return this.modificaStatoFonogrammaForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (!this.modificaStatoFonogrammaForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.modificaStatoFonogrammaForm.value });
    }

    onCancel() {
        this.modal.close({ status: 'ko', result: null });
    }
}
