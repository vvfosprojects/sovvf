import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-gestisci-scheda-contatto-modal',
    templateUrl: './gestisci-scheda-contatto-modal.component.html',
    styleUrls: ['./gestisci-scheda-contatto-modal.component.css']
})
export class GestisciSchedaContattoModalComponent {

    constructor(private modal: NgbActiveModal) {
    }

    close(type: string): void {
        this.modal.close(type);
    }

}
