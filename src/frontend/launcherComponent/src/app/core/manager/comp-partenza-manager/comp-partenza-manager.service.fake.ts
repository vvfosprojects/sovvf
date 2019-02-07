import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { DispatcherCompPartenzaService } from '../../dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';
import { SquadraComposizione } from 'src/app/features/home/composizione-partenza/interface/squadra-composizione-interface';


@Injectable()
export class CompPartenzaManagerServiceFake {
    preAccoppiati: BoxPartenza[];
    mezziComposizione: MezzoComposizione[];
    squadre: SquadraComposizione[];

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
        this.compPartenzaDispatcher.onNewSquadreList().subscribe((squadre: SquadraComposizione[]) => {
            this.squadre = squadre;
        });
    }

    getPreAccoppiati(): Observable<BoxPartenza[]> {
        return of(this.preAccoppiati);
    }

    getMezziComposizione(): Observable<MezzoComposizione[]> {
        return of(this.mezziComposizione);
    }

    getSquadre(): Observable<SquadraComposizione[]> {
        return of(this.squadre);
    }

}
