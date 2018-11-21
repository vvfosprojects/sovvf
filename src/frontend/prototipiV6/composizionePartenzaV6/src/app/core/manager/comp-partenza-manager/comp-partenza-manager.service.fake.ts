import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DispatcherService } from '../../dispatcher/dispatcher-lista-richieste.service';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { PreAccoppiato } from 'src/app/composizione-partenza/model/pre-accoppiato.model';
import { DispatcherCompPartenzaService } from '../../dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';


@Injectable({
    providedIn: 'root'
})
export class CompPartenzaManagerServiceFake {
    preAccoppiati: PreAccoppiato[];

    constructor(private compPartenzaDispatcher: DispatcherCompPartenzaService) {
        this.onNewPreAccoppiatiList();
    }

    onNewPreAccoppiatiList() {
        this.compPartenzaDispatcher.onNewPreAccoppiatiList().subscribe((preAcc: PreAccoppiato[]) => {
            this.preAccoppiati = preAcc;
        });
    }

    getPreAccoppiati(): Observable<PreAccoppiato[]> {
        return of(this.preAccoppiati);
    }
}
