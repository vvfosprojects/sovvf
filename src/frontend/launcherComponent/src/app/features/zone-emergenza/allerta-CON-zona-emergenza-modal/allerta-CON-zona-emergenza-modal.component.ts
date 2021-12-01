import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZonaEmergenza } from '../model/zona-emergenza.model';

@Component({
    selector: 'app-allerta-con-zona-emergenza-modal',
    templateUrl: './allerta-CON-zona-emergenza-modal.component.html',
    styleUrls: ['./allerta-CON-zona-emergenza-modal.component.css']
})
export class AllertaCONZonaEmergenzaModalComponent implements OnInit {

    zonaEmergenza: ZonaEmergenza;

    allertaCONZonaEmergenzaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    get f(): any {
        return this.allertaCONZonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        this.patchId();
    }

    initForm(): void {
        this.allertaCONZonaEmergenzaForm = this.formBuilder.group({
            id: [null, Validators.required],
            descrizioneEmergenza: [null, Validators.required]
        });
    }

    patchId(): void {
        this.allertaCONZonaEmergenzaForm.patchValue({
            id: this.zonaEmergenza.id
        });
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
