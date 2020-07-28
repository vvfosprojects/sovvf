import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modifica-fonogramma-modal',
    templateUrl: './modifica-fonogramma-modal.component.html',
    styleUrls: ['./modifica-fonogramma-modal.component.css']
})
export class ModificaFonogrammaModalComponent implements OnInit {

    codiceRichiesta: string;

    idRichiesta: string;
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
        this.f.idRichiesta.patchValue(this.idRichiesta);
    }

    initForm() {
        this.modificaStatoFonogrammaForm = this.fb.group({
            idRichiesta: ['', Validators.required],
            numeroFonogramma: ['', Validators.required],
            protocolloFonogramma: ['', Validators.required],
            destinatari: ['', Validators.required],
            stato: [this.statiFonogramma[0], Validators.required]
        });
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
