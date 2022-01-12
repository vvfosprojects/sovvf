import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZonaEmergenza } from '../model/zona-emergenza.model';

@Component({
    selector: 'app-richiesta-cra-modal',
    templateUrl: './richiesta-cra-modal.component.html',
    styleUrls: ['./richiesta-cra-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichiestaCraModalComponent implements OnInit {

    zonaEmergenza: ZonaEmergenza;

    richiestaCraZonaEmergenzaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    get f(): any {
        return this.richiestaCraZonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        this.patchId();
    }

    initForm(): void {
        this.richiestaCraZonaEmergenzaForm = this.formBuilder.group({
            idZonaEmergenza: [null, Validators.required],
            comandanteRegionale: [null, Validators.required],
            responsabileDistrettoAreaColpita: [null, Validators.required],
            responsabile: [null, Validators.required],
            responsabileCampiBaseMezziOperativi: [null, Validators.required],
            responsabileGestionePersonaleContratti: [null, Validators.required],
            numeroDOA: [null, Validators.required]
        });
    }

    patchId(): void {
        this.richiestaCraZonaEmergenzaForm.patchValue({
            idZonaEmergenza: this.zonaEmergenza.id
        });
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
