import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-urgenza-segnalata-modal',
    templateUrl: './urgenza-segnalata-modal.component.html',
    styleUrls: ['./urgenza-segnalata-modal.component.css']
})
export class UrgenzaSegnalataModalComponent {

    titolo = 'Urgenza segnalata';

    constructor(private modal: NgbActiveModal) {
    }

    onClose(): void {
        this.modal.close();
    }

}
