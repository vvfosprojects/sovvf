import { Injectable } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {EventoRichiesta} from '../../../eventi/eventi-model/evento-richiesta.model';
import {EventiRichiestaService} from '../../service/eventi-richiesta-service/eventi-richiesta.service';

@Injectable({
  providedIn: 'root'
})
export class DispatcherEventiRichiestaServiceFake {
    /**
     * dispatcher Eventi
     */
    private newEventoRichiesta$ = new Subject<EventoRichiesta>();

    eventiRichiesta: EventoRichiesta[];

    constructor(private eventiRichiestaService: EventiRichiestaService) {
    }

    /**
     *  metodi per richiedere gli eventi della richiesta
     */

    onNewEventiRichiestaList(): Observable<EventoRichiesta[]> {
        this.eventiRichiestaService.getEventiRichiesta().subscribe((eventi: EventoRichiesta[]) => {
            this.eventiRichiesta = eventi;
        });
        return of(this.eventiRichiesta);
    }

    onNewEventoRichiesta(): Observable<EventoRichiesta> {
        return this.newEventoRichiesta$;
    }

}
