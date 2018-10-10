import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BoxInterventi} from '../boxes-model/box-interventi.model';
import {BoxMezzi} from '../boxes-model/box-mezzi.model';
import {BoxFunzionariSo} from '../boxes-model/box-funzionari-so.model';
import {InfoAggregateService} from '../service/boxes-services/info-aggregate.service';

@Injectable({
    providedIn: 'root'
})
export class DispatcherService {
    /**
     * dispatcher interventi
     */
    private updateBoxInterventi$ = new Subject<BoxInterventi>();
    /**
     * dispatcher mezzi
     */
    private updateBoxMezzi$ = new Subject<BoxMezzi>();

    /**
     * dispatcher funzionari
     */
    private updateBoxFunzionario$ = new Subject<BoxFunzionariSo[]>();

    boxInterventi: BoxInterventi;
    boxMezzi: BoxMezzi;
    boxFunzionari: BoxFunzionariSo[];

    constructor(private infoService: InfoAggregateService) {
    }

    /**
     *  metodi per richiedere lo stato degli interventi
     */

    onNewBoxInterventiList(): Observable<BoxInterventi> {
        this.infoService.getInterventi().subscribe((interventi: BoxInterventi) => {
            this.boxInterventi = interventi;
        });
        return of(this.boxInterventi);
    }

    onUpdateBoxInterventi(): Observable<BoxInterventi> {
        return this.updateBoxInterventi$;
    }


    /**
     *  metodi per richiedere lo stato dei mezzi
     */

    onNewBoxMezziList(): Observable<BoxMezzi> {
        this.infoService.getMezzi().subscribe((mezzi: BoxMezzi) => {
            this.boxMezzi = mezzi;
        });
        return of(this.boxMezzi);
    }

    onUpdateBoxMezzi(): Observable<BoxMezzi> {
        return this.updateBoxMezzi$;
    }


    /**
     *  metodi per richiedere lo stato dei funzionari
     */

    onNewBoxFunzionariList(): Observable<BoxFunzionariSo[]> {
        this.infoService.getFunzionariSo().subscribe((funzionariSo: BoxFunzionariSo[]) => {
            this.boxFunzionari = funzionariSo;
        });
        return of(this.boxFunzionari);
    }

    onUpdateBoxFunzionario(): Observable<BoxFunzionariSo[]> {
        return this.updateBoxFunzionario$;
    }

}
