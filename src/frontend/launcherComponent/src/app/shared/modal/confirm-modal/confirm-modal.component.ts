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
                let resultOK = 'ok';
                // tslint:disable-next-line:no-unused-expression
                this.stampa ? resultOK = resultOK + this.azioneStampa : null;
                this.modal.close(resultOK);
                break;
            case 'ko':
                let resultKO = 'ko';
                // tslint:disable-next-line:no-unused-expression
                this.stampa ? resultKO = resultKO + this.azioneStampa : null;
                this.modal.close(resultKO);
                break;
        }
    }

}
