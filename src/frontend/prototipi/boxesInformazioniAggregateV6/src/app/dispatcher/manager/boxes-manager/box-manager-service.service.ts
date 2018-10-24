import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DispatcherService} from '../../dispatcher.service';
import {BoxInterventi} from '../../../boxes/boxes-model/box-interventi.model';
import {BoxMezzi} from '../../../boxes/boxes-model/box-mezzi.model';
import {BoxFunzionariSo} from '../../../boxes/boxes-model/box-funzionari-so.model';


@Injectable({
    providedIn: 'root'
})
export class BoxManagerService {

    boxInterventi: BoxInterventi;
    boxMezzi: BoxMezzi;
    boxFunzionari: BoxFunzionariSo[];

    constructor(private dispatcher: DispatcherService) {

        /**
         * dispatcher interventi
         */
        this.dispatcher.onNewBoxInterventiList().subscribe(interventi => {
            this.boxInterventi = interventi;
        });

        this.dispatcher.onUpdateBoxInterventi().subscribe(interventi => {
            this.boxInterventi = interventi;
        });


        /**
         * dispatcher mezzi
         */
        this.dispatcher.onNewBoxMezziList().subscribe(mezzi => {
            this.boxMezzi = mezzi;
        });

        this.dispatcher.onUpdateBoxMezzi().subscribe(mezzi => {
            this.boxMezzi = mezzi;
        });

        /**
         * dispatcher funzionariSo
         */
        this.dispatcher.onNewBoxFunzionariList().subscribe(funzionariSo => {
            this.boxFunzionari = funzionariSo;
        });

        this.dispatcher.onUpdateBoxFunzionario().subscribe(funzionariSo => {
            this.boxFunzionari = funzionariSo;
        });

    }

    getBoxInterventi(): Observable<BoxInterventi> {
        return of(this.boxInterventi);
    }

    getBoxMezzi(): Observable<BoxMezzi> {
        return of(this.boxMezzi);
    }

    getBoxFunzionariSo(): Observable<BoxFunzionariSo[]> {
        return of(this.boxFunzionari);
    }

}
