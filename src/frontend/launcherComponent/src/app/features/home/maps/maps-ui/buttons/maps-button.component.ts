import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetInitCentroMappa } from '../../../store/actions/maps/centro-mappa.actions';

@Component({
    selector: 'app-maps-button',
    templateUrl: './maps-button.component.html',
    styleUrls: ['./maps-button.component.css']
})
export class MapsButtonComponent {

    @Input() toggleStatus = false;
    @Output() toggleAnimation = new EventEmitter();

    constructor(private store: Store) {
    }

    centra() {
        this.store.dispatch(new GetInitCentroMappa());
    }

}
