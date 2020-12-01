import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SchedeContattoState } from '../../../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { ContatoreSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';

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

    @Select(SchedeContattoState.contatoreSchedeContattoTotale) contatoreSchedeContattoTotale$: Observable<ContatoreSchedeContatto>;
    contatoreSchedeContattoTotale: ContatoreSchedeContatto;

    subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.subscription.add(
            this.contatoreSchedeContattoTotale$.subscribe((contatoreTotale: ContatoreSchedeContatto) => {
                this.contatoreSchedeContattoTotale = contatoreTotale;
            })
        );
    }

    toggleSchedeContatto(): void {
        this.toggle.emit();
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
}
