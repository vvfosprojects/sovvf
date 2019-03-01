import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { Observable } from 'rxjs';
import { EventoRichiesta } from './eventi-model/evento-richiesta.model';
import { GetEventiRichiesta } from '../store/actions/eventi/eventi-richiesta.actions';

@Component({
    selector: 'app-eventi-richiesta',
    templateUrl: './eventi-richiesta.component.html',
    styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent {

    @Select(EventiRichiestaState.eventi) eventiRichiesta$: Observable<EventoRichiesta[]>;

    constructor(private store: Store) {
        this.store.dispatch(new GetEventiRichiesta());
    }

}
