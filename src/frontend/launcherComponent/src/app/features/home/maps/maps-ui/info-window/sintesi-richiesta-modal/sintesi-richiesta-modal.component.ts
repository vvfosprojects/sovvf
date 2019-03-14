import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SintesiRichiesta} from '../../../../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-sintesi-richiesta-modal',
    templateUrl: './sintesi-richiesta-modal.component.html',
    styleUrls: ['./sintesi-richiesta-modal.component.css']
})
export class SintesiRichiestaModalComponent implements OnInit {

    @Input() richiesta: any;

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {
        // console.log('Richiesta Modal', this.richiesta);
    }

}
