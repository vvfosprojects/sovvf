import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { InsertChiamataSuccess } from '../../../features/home/store/actions/chiamata/scheda-telefonata.actions';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { makeIDChiamata } from '../../../shared/helper/function';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';

@Injectable()
export class ChiamataServiceFake {

    constructor(private store: Store) {
    }

    insertChiamata(chiamata: SintesiRichiesta): Observable<any> {
        const insert = chiamata;
        const idRichieste: string[] = [];
        this.store.selectSnapshot(RichiesteState.richieste).forEach(
            richiesta => {
                idRichieste.push(richiesta.id);
            }
        );
        let id = makeIDChiamata();
        while (idRichieste.includes(id)) {
            console.log(`idRichiesta già presente: ${id}`);
            id = makeIDChiamata();
        }
        console.log(`Generato nuovo id: ${id}`);
        insert.codice = id;
        insert.id = id;
        setTimeout( () => {
            this.store.dispatch(new InsertChiamataSuccess(insert));
        }, 2000);
        return of(id);
    }

}
