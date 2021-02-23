import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-note-operatore-triage-modal',
    templateUrl: './note-operatore-triage-modal.component.html',
    styleUrls: ['./note-operatore-triage-modal.component.scss']
})
export class NoteOperatoreTriageModalComponent implements OnInit {

    codRichiesta: string;
    noteOperatore: string[];

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    closeModal(type: string): void {
        this.modal.close({ success: false, data: type });
    }

    getTitle(): string {
        if (this.codRichiesta) {
            return 'Dettaglio Triage della richiesta ' + this.codRichiesta;
        }
    }

}
