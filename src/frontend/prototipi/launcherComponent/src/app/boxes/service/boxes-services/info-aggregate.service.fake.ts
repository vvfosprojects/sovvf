import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {BoxFunzionariSo} from '../../boxes-model/box-funzionari-so.model';
import {BoxInterventi} from '../../boxes-model/box-interventi.model';
import {BoxMezzi} from '../../boxes-model/box-mezzi.model';

@Injectable({
    providedIn: 'root'
})
export class InfoAggregateServiceFake {

    interventi: BoxInterventi;
    mezzi: BoxMezzi;
    funzionariSo: BoxFunzionariSo[];

    constructor() {
    }

    public getInterventi(): Observable<BoxInterventi> {
        this.interventi = new BoxInterventi(25, 30, 10, 30, 105, 'B', 90, 'A');
        return of(this.interventi);

    }

    public getMezzi(): Observable<BoxMezzi> {
        this.mezzi = new BoxMezzi(20, 4, 3, 3, 2);
        return of(this.mezzi);
    }

    public getFunzionariSo(): Observable<BoxFunzionariSo[]> {
        this.funzionariSo = [
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
        ];
        return of(this.funzionariSo);
    }
}
