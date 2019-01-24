import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {BoxInterventi} from '../../../features/home/boxes/boxes-model/box-interventi.model';
import {BoxMezzi} from '../../../features/home/boxes/boxes-model/box-mezzi.model';
import {BoxPersonale} from '../../../features/home/boxes/boxes-model/box-personale.model';
import {InfoAggregateService} from '../../service/boxes-service/info-aggregate.service';

@Injectable({
    providedIn: 'root'
})
export class DispatcherInfoAggregateService {
    /**
     * dispatcher interventi
     */
    private updateBoxInterventi$ = new Subject<BoxInterventi>();
    /**
     * dispatcher mezzi
     */
    private updateBoxMezzi$ = new Subject<BoxMezzi>();

    /**
     * dispatcher personale
     */
    private updateBoxPersonale$ = new Subject<BoxPersonale>();

    boxInterventi: BoxInterventi;
    boxMezzi: BoxMezzi;
    boxPersonale: BoxPersonale;

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
     *  metodi per richiedere lo stato del personale
     */

    onNewBoxPersonaleList(): Observable<BoxPersonale> {
        this.infoService.getPersonale().subscribe((personale: BoxPersonale) => {
            this.boxPersonale = personale;
        });
        return of(this.boxPersonale);
    }

    onUpdateBoxPersonale(): Observable<BoxPersonale> {
        return this.updateBoxPersonale$;
    }

}
