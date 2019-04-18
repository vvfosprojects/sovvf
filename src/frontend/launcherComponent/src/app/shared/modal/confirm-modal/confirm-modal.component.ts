import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

    @Input() icona: any;
    @Input() titolo: string;
    @Input() messaggio: string;
    @Input() messaggioAttenzione: string;
    @Input() bottoni: any[];

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {
    }

}
