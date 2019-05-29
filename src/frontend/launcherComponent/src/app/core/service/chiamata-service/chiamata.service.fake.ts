import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { InsertChiamataSuccess } from '../../../features/home/store/actions/chiamata/scheda-telefonata.actions';

@Injectable()
export class ChiamataServiceFake {

    idChiamata: string;

    constructor(private store: Store) {
    }

    insertChiamata(chiamata: any): Observable<any> {
        this.store.dispatch(new InsertChiamataSuccess(chiamata));
        return of();
    }

}
