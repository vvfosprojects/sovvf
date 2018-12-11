import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../service/lista-richieste-service/lista-richieste.service';


@Injectable({
    providedIn: 'root'
})
export class DispatcherService {
    private newRichiesteList$ = new Subject<SintesiRichiesta[]>();
    private updateRichiesta$ = new Subject<SintesiRichiesta>();
    private newRichiesta$ = new Subject<SintesiRichiesta>();
    private deleteRichiesta$ = new Subject<SintesiRichiesta>();

    richieste: SintesiRichiesta[] = [];

    constructor(private richiesteService: SintesiRichiesteService) {
    }

    onNewRichiesteList() {
        this.richiesteService.getRichieste().subscribe(val => {
            let newArr;
            val.forEach(item => {
                console.log(item);
                newArr = this.richieste;
                newArr.push(item);
            });
            this.newRichiesteList$.next(newArr);
        });

        return this.newRichiesteList$.asObservable();
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
