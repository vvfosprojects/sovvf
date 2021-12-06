import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipologiaEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';

@Component({
    selector: 'app-richiesta-moduli-modal',
    templateUrl: './richiesta-moduli-modal.component.html',
    styleUrls: ['./richiesta-moduli-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichiestaModuliModalComponent implements OnInit {

    zonaEmergenza: ZonaEmergenza;
    tipologieEmergenza: TipologiaEmergenza[];

    richiestaModuliNZonaEmergenzaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    get f(): any {
        return this.richiestaModuliNZonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        this.patchId();
    }

    initForm(): void {
        this.richiestaModuliNZonaEmergenzaForm = this.formBuilder.group({
            idZonaEmergenza: [null, Validators.required],
            tipologiaModuli: [null, Validators.required]
        });
    }

    patchId(): void {
        this.richiestaModuliNZonaEmergenzaForm.patchValue({
            idZonaEmergenza: this.zonaEmergenza.id
        });
    }

    getTipologieModuliByDescTipologiaEmergenza(): string[] {
        let tipologieModuli: string[];
        const descTipologiaEmergenzaSelezionata = this.zonaEmergenza.tipologia.emergenza[0];
        if (descTipologiaEmergenzaSelezionata) {
            this.tipologieEmergenza.forEach((t: TipologiaEmergenza) => {
                if (t.emergenza.indexOf(descTipologiaEmergenzaSelezionata) !== -1) {
                    tipologieModuli = t.moduli.mob_Immediata;
                }
            });
        }
        return tipologieModuli;
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
