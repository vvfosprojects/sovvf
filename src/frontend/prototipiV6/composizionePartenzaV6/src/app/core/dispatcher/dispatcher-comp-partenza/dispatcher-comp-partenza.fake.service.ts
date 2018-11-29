import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

// Service
import { CompPartenzaService } from '../../service/comp-partenza-service/comp-partenza.service';

// Model
import { PreAccoppiato } from '../../../composizione-partenza/model/pre-accoppiato.model';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../composizione-partenza/model/mezzo-composizione.model';


@Injectable({
    providedIn: 'root'
})
export class DispatcherCompPartenzaFakeService {
    preAccoppiati: PreAccoppiato[];
    mezziComposizione: MezzoComposizione[];
    squadre: Squadra[];

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    onNewPreAccoppiatiList(): Observable<PreAccoppiato[]> {
        this.compPartenzaService.getPreAccoppiati().subscribe((preAcc: PreAccoppiato[]) => {
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
