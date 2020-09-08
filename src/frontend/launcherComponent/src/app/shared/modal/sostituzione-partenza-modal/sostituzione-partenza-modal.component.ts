import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetListaMezziSquadre } from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';

@Component({
    selector: 'app-sostituzione-partenza',
    templateUrl: './sostituzione-partenza-modal.component.html',
    styleUrls: ['./sostituzione-partenza-modal.component.css']
})
export class SostituzionePartenzaModalComponent implements OnInit {

    constructor(private store: Store) {
        this.store.dispatch(new GetListaMezziSquadre());
    }

    ngOnInit() {
    }

}
