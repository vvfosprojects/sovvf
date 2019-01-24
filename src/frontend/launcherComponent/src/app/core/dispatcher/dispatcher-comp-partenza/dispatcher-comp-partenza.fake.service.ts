import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

// Service
import { CompPartenzaService } from '../../service/comp-partenza-service/comp-partenza.service';

// Model
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';


@Injectable({
    providedIn: 'root'
})
export class DispatcherCompPartenzaFakeService {
    preAccoppiati: BoxPartenza[];
    mezziComposizione: MezzoComposizione[];
    squadre: Squadra[];

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    onNewPreAccoppiatiList(): Observable<BoxPartenza[]> {
        this.compPartenzaService.getPreAccoppiati().subscribe((preAcc: BoxPartenza[]) => {
            this.preAccoppiati = preAcc;
        });
        return of(this.preAccoppiati);
    }

    onNewMezziComposizioneList(): Observable<MezzoComposizione[]> {
        this.compPartenzaService.getMezziComposizione().subscribe((mezziComp: MezzoComposizione[]) => {
            this.mezziComposizione = mezziComp;
        });
        return of(this.mezziComposizione);
    }

    onNewSquadreList(): Observable<Squadra[]> {
        this.compPartenzaService.getSquadre().subscribe((squadre: Squadra[]) => {
            this.squadre = squadre;
        });
        return of(this.squadre);
    }
}
