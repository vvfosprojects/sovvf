import {Injectable} from '@angular/core';
import {of, Observable, Subject} from 'rxjs';
import {SintesiRichiesta} from '../shared/model/sintesi-richiesta.model';
import {SintesiRichiesteService} from './data/sintesi-richieste-service/sintesi-richieste.service';


@Injectable({
    providedIn: 'root'
})
export class DispatcherService {
    private updateRichiesta$ = new Subject<SintesiRichiesta>();
    private newRichiesta$ = new Subject<SintesiRichiesta>();
    private deleteRichiesta$ = new Subject<SintesiRichiesta>();

    richieste: SintesiRichiesta[];

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    onNewRichiesteList(): Observable<SintesiRichiesta[]> {
        this.richiesteService.getRichieste().subscribe((richieste: SintesiRichiesta[]) => {
            this.richieste = richieste;
        });
        return of(this.richieste);
    }

    onNewRichiesta(): Observable<SintesiRichiesta> {
        return this.newRichiesta$;
    }

    onUpdateRichiesta(): Observable<SintesiRichiesta> {
        return this.updateRichiesta$;
    }

    onDeleteRichiesta(): Observable<SintesiRichiesta> {
        return this.deleteRichiesta$;
    }
}
