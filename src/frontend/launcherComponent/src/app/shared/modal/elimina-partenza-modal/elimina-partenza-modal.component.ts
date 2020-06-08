import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-elimina-partenza-modal',
    templateUrl: './elimina-partenza-modal.component.html',
    styleUrls: ['./elimina-partenza-modal.component.css']
})
export class EliminaPartenzaModalComponent implements OnInit {

    targaMezzo: string;
    idRichiesta: string;

    eliminaPartenzaForm: FormGroup;
    submitted: boolean;

    testoMotivazioneVisible: boolean;
    codRichiestaSubentrataVisible: boolean;

    motivazioni = [
        {
            codice: '1',
            descrizione: 'Intervento non più necessario'
        },
        {
            codice: '2',
            descrizione: 'Riassegnazione'
        },
        {
            codice: '3',
            descrizione: 'Fuori Servizio'
        },
        {
            codice: '4',
            descrizione: 'Altra motivazione'
        },
    ];

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
    }

    ngOnInit() {
    }

    initForm() {
        this.eliminaPartenzaForm = this.fb.group({
            codMotivazione: ['', Validators.required],
            testoMotivazione: [''],
            codRichiestaSubentrata: ['']
        });
    }

    get f() {
        return this.eliminaPartenzaForm.controls;
    }

    onSelezioneMotivazione(newMotivazione: { codice: string, descrizione: string }) {
        this.changeFormValidators(newMotivazione);
    }

    changeFormValidators(newMotivazione: { codice: string, descrizione: string }) {
        this.f.testoMotivazione.clearValidators();
        this.f.codRichiestaSubentrata.clearValidators();
        this.f.testoMotivazione.patchValue('');
        this.f.codRichiestaSubentrata.patchValue('');
        this.testoMotivazioneVisible = false;
        this.codRichiestaSubentrataVisible = false;

        if (newMotivazione && newMotivazione.codice) {
            switch (newMotivazione.codice) {
                case '2':
                    this.codRichiestaSubentrataVisible = true;
                    this.f.codRichiestaSubentrata.setValidators(Validators.required);
                    break;
                case '4':
                    this.testoMotivazioneVisible = true;
                    this.f.testoMotivazione.setValidators(Validators.required);
                    break;
                default:
                    break;
            }
        }
    }

    onSubmit() {
        this.submitted = true;

        if (!this.eliminaPartenzaForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.eliminaPartenzaForm.value });
    }
}
