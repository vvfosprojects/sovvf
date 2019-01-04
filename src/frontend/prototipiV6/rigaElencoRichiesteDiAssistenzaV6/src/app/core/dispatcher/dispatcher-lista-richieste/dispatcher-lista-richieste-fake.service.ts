import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../../service/lista-richieste-service/lista-richieste.service';


@Injectable({
    providedIn: 'root'
})
export class DispatcherFakeService {
    private newRichiesteList$ = new Subject<SintesiRichiesta[]>();
    private updateRichiesta$ = new Subject<SintesiRichiesta>();
    private newRichiesta$ = new Subject<SintesiRichiesta>();
    private deleteRichiesta$ = new Subject<SintesiRichiesta>();

    richieste: SintesiRichiesta[];

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    onNewRichiesteList(idUltimaRichiesta?: any) {
        this.richiesteService.getRichieste(idUltimaRichiesta).subscribe((richieste: any) => {
            if (richieste) {
                this.richieste = richieste;
                this.newRichiesteList$.next(richieste);
                // TEST
                console.log('[Dispatcher] Lista Richieste:', richieste.length);
            }
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
