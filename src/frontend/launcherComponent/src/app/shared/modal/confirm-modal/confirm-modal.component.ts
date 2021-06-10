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

    constructor(public modal: NgbActiveModal) {
    }

}
