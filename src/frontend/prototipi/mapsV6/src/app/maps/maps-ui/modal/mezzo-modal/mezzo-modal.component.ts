import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MezzoModalContentComponent} from '../mezzo-modal-content/mezzo-modal-content.component';

@Component({
    selector: 'app-mezzo-modal',
    templateUrl: './mezzo-modal.component.html',
    styleUrls: ['./mezzo-modal.component.css']
})
export class MezzoModalComponent implements OnInit {

    constructor(private _modalService: NgbModal) {
    }

    open() {
        this._modalService.open(MezzoModalContentComponent);
    }

    ngOnInit() {
    }

}
