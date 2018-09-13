import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {InfoAggregate} from './info-aggregate.model';
import {BoxFunzionariSo} from '../boxes-model/box-funzionari-so.model';
import {BoxInterventi} from '../boxes-model/box-interventi.model';
import {BoxMezzi} from '../boxes-model/box-mezzi.model';

@Injectable({
    providedIn: 'root'
})
export class InfoAggregateServiceFake {

    constructor() {
    }

    public getInfoAggregate(): Observable<any> {
        const infoAggregate: InfoAggregate =
            new InfoAggregate([
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
                new BoxInterventi(25, 30, 10, 30),
                new BoxMezzi(20, 4, 3, 3, 2)
            );
        return of(infoAggregate);
    }
}
