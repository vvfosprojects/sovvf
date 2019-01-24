import {Injectable} from '@angular/core';
import {EventoRichiesta} from '../../../features/home/eventi/eventi-model/evento-richiesta.model';
import {Observable, of, Subject} from 'rxjs';
import {EventiRichiestaService} from '../../service/eventi-richiesta-service/eventi-richiesta.service';

@Injectable({
    providedIn: 'root'
})
export class DispatcherEventiRichiestaService {
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
