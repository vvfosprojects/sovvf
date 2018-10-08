import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkerService} from '../../../service/marker-service/marker-service.service';

@Component({
    selector: 'app-mezzo-modal-content',
    templateUrl: './mezzo-modal-content.component.html',
    styleUrls: ['./mezzo-modal-content.component.css']
})
export class MezzoModalContentComponent implements OnInit {

    nomeSede: string;

    constructor(public modal: NgbActiveModal, private markerService: MarkerService) {

    }

    ngOnInit() {
        this.nomeSede = this.markerService.markerSelezionato.descrizione;
    }

    cambioSede() {
        this.markerService.cambioSede();
    }

}
