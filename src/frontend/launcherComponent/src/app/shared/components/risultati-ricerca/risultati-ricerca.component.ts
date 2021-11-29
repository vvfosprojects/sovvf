import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetRicercaFilterbar } from '../../../features/home/store/actions/filterbar/ricerca-richieste.actions';

@Component({
    selector: 'app-risultati-ricerca',
    templateUrl: './risultati-ricerca.component.html',
    styleUrls: ['./risultati-ricerca.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RisultatiRicercaComponent {

    @Input() ricerca: string;

    constructor(private store: Store) {
    }

    resetRicerca(): void {
        this.store.dispatch(new SetRicercaFilterbar(''));
    }

}
