import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SchedeContattoState } from '../../../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { ContatoreSchedeContatto, ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';

@Component({
    selector: 'app-tasto-schede-contatto',
    templateUrl: './tasto-schede-contatto.component.html',
    styleUrls: ['./tasto-schede-contatto.component.css']
})
export class TastoSchedeContattoComponent {

    @Input() active: boolean;
    @Input() disabled: boolean;

    @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class') classes = 'btn-group';

    @Select(SchedeContattoState.contatoriSchedeContatto) contatoriSchedeContatto$: Observable<ContatoriSchedeContatto>;
    contatoreSchedeContatto: ContatoriSchedeContatto;

    subscription: Subscription = new Subscription();

    constructor() {
        this.getContatoriSchedeContatto();
    }

    getContatoriSchedeContatto(): void {
        this.subscription.add(
            this.contatoriSchedeContatto$.subscribe((contatori: ContatoriSchedeContatto) => {
                this.contatoreSchedeContatto = contatori;
            })
        );
    }

    coloreTasto(): string {
        let returnClass = 'btn-outline-light';
        if (this.active) {
            returnClass = 'btn-light text-danger';
        }
        if (this.disabled) {
            returnClass = 'btn-outline-secondary cursor-not-allowed';
        }
        return returnClass;
    }

    coloreBadgeContatore(): string {
        let returnClass = 'badge-danger';
        if (this.active) {
            returnClass = 'badge-dark';
        }
        return returnClass;
    }

    toggleSchedeContatto(): void {
        this.toggle.emit();
    }
}
