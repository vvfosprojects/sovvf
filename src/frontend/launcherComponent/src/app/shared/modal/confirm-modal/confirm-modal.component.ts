import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

    icona: any;
    titolo: string;
    messaggio: string;
    messaggioAttenzione: string;
    stampa = false;
    checkbox: { pdf: boolean, csv: boolean } = {
        pdf: true,
        csv: false,
    };
    azioneStampa = 'pdf';

    constructor(public modal: NgbActiveModal) {
    }

    onCheck(key: string): void {
        if (!this.checkbox[key]) {
            Object.keys(this.checkbox).forEach(x => this.checkbox[x] = x === key);
        }
        this.azioneStampa = key;
    }

    onSubmit(key: string): void {
        switch (key) {
            case 'ok':
                const resultOK = this.stampa ? 'ok' + this.azioneStampa : 'ok';
                this.modal.close(resultOK);
                break;
            case 'ko':
                const resultKO = this.stampa ? 'ko' + this.azioneStampa : 'ko';
                this.modal.close(resultKO);
                break;
        }
    }

}
