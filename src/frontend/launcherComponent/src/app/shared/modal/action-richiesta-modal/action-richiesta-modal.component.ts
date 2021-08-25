import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ente } from '../../interface/ente.interface';
import { MotivazioneChiusuraRichiestaEnum } from '../../enum/motivazione-chiusura-richiesta.enum';

@Component({
    selector: 'app-action-richiesta-modal',
    templateUrl: './action-richiesta-modal.component.html',
    styleUrls: ['./action-richiesta-modal.component.css']
})
export class ActionRichiestaModalComponent implements OnInit {

    icona: any;
    titolo: string;
    messaggio: string;
    messaggioAttenzione: string;
    bottoni: any[];

    chiusuraChiamata: boolean;
    enti: Ente[];

    chiusuraIntervento: boolean;
    motivazioniChiusuraIntervento: string[];

    sospensione: boolean;

    riapertura: boolean;

    actionRichiestaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder) {
        if (this.chiusuraChiamata) {
            this.actionRichiestaForm = this.formBuilder.group({
                tipologiaChiusuraChiamata: new FormControl(),
                enti: new FormControl(),
            });
        } else if (this.chiusuraIntervento) {
            this.actionRichiestaForm = this.formBuilder.group({
                tipologiaChiusuraChiamata: new FormControl()
            });
        }
    }

    get f(): any {
        return this.actionRichiestaForm?.controls;
    }

    ngOnInit(): void {
        if (this.chiusuraChiamata) {
            this.actionRichiestaForm = this.formBuilder.group({
                tipologiaChiusuraChiamata: ['InterventoNonNecessario'],
                enti: [null],
            });
        } else if (this.chiusuraIntervento) {
            this.actionRichiestaForm = this.formBuilder.group({
                tipologiaChiusuraChiamata: ['Int. concluso'],
            });
        }
    }

    onChangeTipologiaChiusuraChiamata(tipologiaChiusuraChiamata: string): void {
        switch (tipologiaChiusuraChiamata) {
            case 'TrasmessaAdEnte':
                this.f.enti.setValidators([Validators.required]);
                this.f.enti.updateValueAndValidity();
                break;
            case 'InterventoNonNecessario':
                this.f.enti.setValidators(null);
                this.f.enti.updateValueAndValidity();
                break;
        }
    }

    onChangeSelectEnte(ente: Ente): void {
        let entiSelezionati = this.f.enti.value;
        const isSelezionato = entiSelezionati?.filter((e: Ente) => e.codice === ente.codice)[0];
        if (!isSelezionato) {
            if (!entiSelezionati) {
                entiSelezionati = [];
            }
            entiSelezionati.push(ente);
            this.f.enti.patchValue(entiSelezionati);
        } else {
            entiSelezionati = entiSelezionati.filter((e: Ente) => e.codice !== ente.codice);
            this.f.enti.patchValue(entiSelezionati);
        }
    }

    getMotivazione(): MotivazioneChiusuraRichiestaEnum {
        const tipologiaChiusuraChiamata = this.f?.tipologiaChiusuraChiamata?.value;
        let tipologiaRiapertura;

        if (tipologiaChiusuraChiamata) {
            switch (tipologiaChiusuraChiamata) {
                case 'InterventoNonNecessario':
                    return MotivazioneChiusuraRichiestaEnum.InterventoNonNecessario;
                case 'TrasmessaAdEnte':
                    return MotivazioneChiusuraRichiestaEnum.TrasmessaAdEnte;
                case 'Int. non più necessario':
                    return MotivazioneChiusuraRichiestaEnum.InterventoNonNecessario;
                case 'Falso Allarme':
                    return MotivazioneChiusuraRichiestaEnum.FalsoAllarme;
                case 'Int. concluso':
                    return MotivazioneChiusuraRichiestaEnum.InterventoConcluso;
            }
        } else if (this.riapertura) {
            tipologiaRiapertura = 'Riapertura';
            return tipologiaRiapertura;
        }
          else {
            return null;
        }
    }

    close(esito: string): void {
        let tipologiaChiusuraChiamata = null;
        let trasmessoAdEnte = null;
        let enti = null;
        if (this.actionRichiestaForm) {
            tipologiaChiusuraChiamata = this.f.tipologiaChiusuraChiamata?.value;
            trasmessoAdEnte = tipologiaChiusuraChiamata && tipologiaChiusuraChiamata === 'TrasmessaAdEnte';
            enti = this.f.enti?.value?.length && trasmessoAdEnte ? this.f.enti.value : null;
        }
        const obj = {
            esito,
            motivazione: this.getMotivazione(),
            entiIntervenuti: enti
        };
        this.modal.close(obj);
    }
}
