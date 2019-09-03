import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Store } from '@ngxs/store';
import { SetListaSchedeContatto } from 'src/app/features/home/store/actions/schede-contatto/schede-contatto.actions';


@Injectable({
    providedIn: 'root'
})
export class SchedeContattoServiceFake {

    listaSchede: SchedaContatto[];

    constructor(private store: Store) {
    }

    getSchedeContatto(): Observable<SchedaContatto[]> {
        this.listaSchede = [];

        this.store.dispatch(new SetListaSchedeContatto(this.listaSchede));
        return of(this.listaSchede);
    }
}
