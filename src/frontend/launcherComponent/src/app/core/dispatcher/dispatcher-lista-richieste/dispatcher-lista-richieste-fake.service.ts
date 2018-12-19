import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../../service/lista-richieste-service/lista-richieste.service';


@Injectable({
    providedIn: 'root'
})
export class DispatcherFakeService {
    private updateRichiesta$ = new Subject<SintesiRichiesta>();
    private newRichiesta$ = new Subject<SintesiRichiesta>();
    private deleteRichiesta$ = new Subject<SintesiRichiesta>();

    richieste: SintesiRichiesta[];

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    onNewRichiesteList(idUltimaRichiesta?: any): Observable<SintesiRichiesta[]> {
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
