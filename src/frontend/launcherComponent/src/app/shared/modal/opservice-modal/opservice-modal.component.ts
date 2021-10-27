import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-opservice-modal',
    templateUrl: './opservice-modal.component.html',
    styleUrls: ['./opservice-modal.component.css']
})
export class OpserviceModalComponent implements OnInit {

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    openOpserviNewTab(): void {
        window.open('https://opservice-test.dipvvf.it', '_blank', 'toolbar=0,location=0,menubar=0');
        this.modal.dismiss('cross');
    }
}
