import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZonaEmergenza } from '../../model/zona-emergenza.model';

@Component({
    selector: 'app-annulla-zona-emergenza-modal',
    templateUrl: './annulla-zona-emergenza-modal.component.html',
    styleUrls: ['./annulla-zona-emergenza-modal.component.css']
})
export class AnnullaZonaEmergenzaModalComponent implements OnInit {

    zonaEmergenza: ZonaEmergenza;

    annullaZonaEmergenzaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    get f(): any {
        return this.annullaZonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        this.patchId();
    }

    initForm(): void {
        this.annullaZonaEmergenzaForm = this.formBuilder.group({
            id: [null, Validators.required],
            motivazione: [null]
        });
    }

    patchId(): void {
        this.annullaZonaEmergenzaForm.patchValue({
            id: this.zonaEmergenza.id,
        });
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
