import {Injectable} from '@angular/core';
import {EventoRichiesta} from '../../../eventi-richiesta/eventi-model/evento-richiesta.model';
import {DispatcherEventiRichiestaService} from '../../dispatcher-eventi-richiesta.service';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventiManagerService {


    eventiRichiesta: EventoRichiesta[];

    constructor(private dispatcher: DispatcherEventiRichiestaService) {

        /**
         * dispatcher richieste
         */
        this.dispatcher.onNewEventiRichiestaList().subscribe(eventi => {
            this.eventiRichiesta = eventi;
        });

        this.dispatcher.onNewEventoRichiesta().subscribe(evento => {
            this.eventiRichiesta.push(evento);
        });

    }

    getEventiRichiesta(): Observable<EventoRichiesta[]> {
        return of(this.eventiRichiesta);
    }

}
