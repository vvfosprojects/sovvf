import { Component, HostBinding, Input } from '@angular/core';
import { ToggleSchedeContatto } from '../../../store/actions/view/view.actions';
import { Select, Store } from '@ngxs/store';
import { SchedeContattoState } from '../../../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import {ContatoreSchedeContatto, ContatoriSchedeContatto} from '../../../../../shared/interface/contatori-schede-contatto.interface';

@Component({
    selector: 'app-tasto-schede-contatto',
    templateUrl: './tasto-schede-contatto.component.html',
    styleUrls: ['./tasto-schede-contatto.component.css']
})
export class TastoSchedeContattoComponent {

    @Input() active: boolean;
    @Input() disabled: boolean;

    @HostBinding('class') classes = 'btn-group';

    @Select(SchedeContattoState.contatoreSchedeContattoTotale) contatoreSchedeContattoTotale$: Observable<ContatoreSchedeContatto>;
    contatoreSchedeContattoTotale: ContatoreSchedeContatto;
    @Select(SchedeContattoState.contatoriSchedeContatto) contatoriSchedeContatto$: Observable<ContatoriSchedeContatto>;
    contatoriSchedeContatto: ContatoriSchedeContatto;

    subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.subscription.add(
            this.contatoreSchedeContattoTotale$.subscribe((contatoreTotale: ContatoreSchedeContatto) => {
                this.contatoreSchedeContattoTotale = contatoreTotale;
            })
        );
        this.subscription.add(
          this.contatoriSchedeContatto$.subscribe((contaotoriSchede: ContatoriSchedeContatto) => {
            this.contatoriSchedeContatto = contaotoriSchede;
          })
        );
    }

    toggleSchedeContatto(): void {
        this.store.dispatch(new ToggleSchedeContatto());
    }

    coloreTasto(): string {
        let returnClass = 'btn-outline-success';
        if (this.active) {
            returnClass = 'btn-danger';
        }
        if (this.disabled) {
            returnClass = 'btn-outline-secondary cursor-not-allowed';
        }
        return returnClass;
    }

    coloreBadgeContatore(): string {
        let returnClass = 'badge-danger';
        if (this.active) {
            returnClass = 'badge-light';
        }
        return returnClass;
    }
}
