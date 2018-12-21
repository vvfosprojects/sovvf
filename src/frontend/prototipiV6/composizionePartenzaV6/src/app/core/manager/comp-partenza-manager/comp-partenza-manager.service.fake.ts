import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoxPartenza } from '../../../composizione-partenza/model/box-partenza.model';
import { DispatcherCompPartenzaService } from '../../dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../composizione-partenza/interface/composizione-partenza-interface';


@Injectable({
    providedIn: 'root'
})
export class CompPartenzaManagerServiceFake {
    preAccoppiati: BoxPartenza[];
    mezziComposizione: MezzoComposizione[];
    squadre: Squadra[];

    constructor(private compPartenzaDispatcher: DispatcherCompPartenzaService) {
        this.onNewPreAccoppiatiList();
        this.onNewMezziComposizioneList();
        this.onNewSquadreList();
    }

    onNewPreAccoppiatiList() {
        this.compPartenzaDispatcher.onNewPreAccoppiatiList().subscribe((preAcc: BoxPartenza[]) => {
            this.preAccoppiati = preAcc;
        });
    }

    onNewMezziComposizioneList() {
        this.compPartenzaDispatcher.onNewMezziComposizioneList().subscribe((mezziComp: MezzoComposizione[]) => {
            this.mezziComposizione = mezziComp;
        });
    }

    onNewSquadreList() {
        this.compPartenzaDispatcher.onNewSquadreList().subscribe((squadre: Squadra[]) => {
            this.squadre = squadre;
        });
    }

    getPreAccoppiati(): Observable<BoxPartenza[]> {
        return of(this.preAccoppiati);
    }

    getMezziComposizione(): Observable<MezzoComposizione[]> {
        return of(this.mezziComposizione);
    }

    getSquadre(): Observable<Squadra[]> {
        return of(this.squadre);
    }

}
