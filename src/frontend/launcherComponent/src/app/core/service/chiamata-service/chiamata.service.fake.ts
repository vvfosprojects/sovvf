import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { InsertChiamataSuccess } from '../../../features/home/store/actions/chiamata/scheda-telefonata.actions';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { makeIDChiamata } from '../../../shared/helper/function';

@Injectable()
export class ChiamataServiceFake {

    constructor(private store: Store) {
    }

    insertChiamata(chiamata: SintesiRichiesta): Observable<any> {
        const insert = chiamata;
        chiamata.codice = makeIDChiamata();
        this.store.dispatch(new InsertChiamataSuccess(insert));
        return of(null);
    }

}
