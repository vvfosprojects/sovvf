import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {BoxInterventi} from '../../../features/home/boxes/boxes-model/box-interventi.model';
import {BoxMezzi} from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import {BoxPersonale} from '../../../features/home/boxes/boxes-model/box-personale.model';
import {DispatcherInfoAggregateService} from '../../dispatcher/dispatcher-boxes/dispatcher-boxes.service';


@Injectable({
    providedIn: 'root'
})
export class BoxManagerServiceFake {

    boxInterventi: BoxInterventi;
    boxMezzi: BoxMezzi;
    boxPersonale: BoxPersonale;

    constructor(private dispatcher: DispatcherInfoAggregateService) {

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
        this.dispatcher.onNewBoxPersonaleList().subscribe(personale => {
            this.boxPersonale = personale;
        });

        this.dispatcher.onUpdateBoxPersonale().subscribe(personale => {
            this.boxPersonale = personale;
        });

    }

    getBoxInterventi(): Observable<BoxInterventi> {
        return of(this.boxInterventi);
    }

    getBoxMezzi(): Observable<BoxMezzi> {
        return of(this.boxMezzi);
    }

    getBoxPersonale(): Observable<BoxPersonale> {
        return of(this.boxPersonale);
    }

}
