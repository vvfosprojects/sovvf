import { Injectable } from '@angular/core';
import { BoxPersonale } from '../../../features/home/boxes/boxes-model/box-personale.model';
import { Observable, of } from 'rxjs';
import { BoxFunzionariSo } from '../../../features/home/boxes/boxes-model/box-funzionari-so.model';
import { Store } from '@ngxs/store';
import { SetBoxPersonale } from '../../../features/home/store/actions/boxes/box-personale.actions';

@Injectable()
export class BoxPesonaleFakeService {

    personale: BoxPersonale;

    constructor(private store: Store) {
    }

    public getPersonale(): Observable<BoxPersonale> {
        this.personale = new BoxPersonale(
            374,
            [
                new BoxFunzionariSo(
                    'RSSMRA80A01C707K',
                    'CRE',
                    'Mario Rossi',
                    true,
                    false,
                    false,
                    false),
                new BoxFunzionariSo(
                    'BNCMRC80A01H501C',
                    'VCSC',
                    'Francesco Bianchi',
                    false,
                    false,
                    false,
                    true),
                new BoxFunzionariSo(
                    'VRDGPP80A01H501U',
                    'CRESC',
                    'Giuseppe Verdi',
                    false,
                    true,
                    false,
                    false),
                new BoxFunzionariSo(
                    'GLLNTN80A01H501U',
                    'VE AIB',
                    'Antonio Gialli',
                    false,
                    false,
                    true,
                    false)
            ],
            59,
            8
        );
        this.store.dispatch(new SetBoxPersonale(this.personale));
        return of();
    }

}
