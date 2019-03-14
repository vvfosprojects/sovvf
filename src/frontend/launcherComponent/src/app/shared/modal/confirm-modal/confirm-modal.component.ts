import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

    @Input() icona;
    @Input() titolo;
    @Input() messaggio;
    @Input() messaggioAttenzione;
    @Input() bottoni;

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {
    }

}
