import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {BoxInterventi} from '../../../boxes/boxes-model/box-interventi.model';
import {BoxMezzi} from '../../../boxes/boxes-model/box-mezzi.model';
import {BoxPersonale} from '../../../boxes/boxes-model/box-personale.model';
import {BoxFunzionariSo} from '../../../boxes/boxes-model/box-funzionari-so.model';


@Injectable({
    providedIn: 'root'
})
export class InfoAggregateServiceFake {

    interventi: BoxInterventi;
    mezzi: BoxMezzi;
    personale: BoxPersonale;

    constructor() {
    }

    public getInterventi(): Observable<BoxInterventi> {
        this.interventi = new BoxInterventi(3, 3, 1, 2, 9, 20, 'B', 30, 'A', '2018', '12.842');
        return of(this.interventi);

    }

    public getMezzi(): Observable<BoxMezzi> {
        this.mezzi = new BoxMezzi(89, 2, 2, 1, 1, 94);
        return of(this.mezzi);
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
        return of(this.personale);
    }
}
