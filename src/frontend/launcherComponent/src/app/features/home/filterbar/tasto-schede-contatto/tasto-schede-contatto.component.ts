import { Component, HostBinding, Input } from '@angular/core';
import { ToggleSchedeContatto } from '../../store/actions/view/view.actions';
import { Select, Store } from '@ngxs/store';
import { SchedeContattoState } from '../../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-tasto-schede-contatto',
    templateUrl: './tasto-schede-contatto.component.html',
    styleUrls: ['./tasto-schede-contatto.component.css']
})
export class TastoSchedeContattoComponent {

    @Input() active: boolean;
    @Input() disabled: boolean;

    @HostBinding('class') classes = 'btn-group';

    @Select(SchedeContattoState.numeroSchedeContattoCompetenza) numeroSchedeContatto$: Observable<number>;
    numeroSchedeContatto: number;

    subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.subscription.add(
            this.numeroSchedeContatto$.subscribe((numeroSchede: number) => {
                this.numeroSchedeContatto = numeroSchede;
            })
        );
    }

    toggleSchedeContatto() {
        this.store.dispatch(new ToggleSchedeContatto());
    }

    coloreTasto() {
        let _returnClass = 'btn-outline-success';
        if (this.active) {
            _returnClass = 'btn-danger';
        }
        if (this.disabled) {
            _returnClass = 'btn-outline-secondary cursor-not-allowed';
        }
        return _returnClass;
    }

    coloreBadgeContatore() {
        let _returnClass = 'badge-danger';
        if (this.active) {
            _returnClass = 'badge-light';
        }
        return _returnClass;
    }
}
