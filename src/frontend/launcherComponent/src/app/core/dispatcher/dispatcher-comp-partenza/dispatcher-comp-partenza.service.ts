import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Model
import { Squadra } from '../../../shared/model/squadra.model';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';

// Service
import { CompPartenzaService } from '../../service/comp-partenza-service/comp-partenza.service';
import { SquadraComposizione } from 'src/app/features/home/composizione-partenza/interface/squadra-composizione-interface';

@Injectable()
export class DispatcherCompPartenzaService {
    private newPreaccoppiatiList$ = new Subject<BoxPartenza[]>();
    private newMezziComposizioneList$ = new Subject<MezzoComposizione[]>();
    private newSquadreList$ = new Subject<SquadraComposizione[]>();

    constructor(private compPartenzaService: CompPartenzaService) { }

    onNewPreAccoppiatiList() {
        this.newPreaccoppiatiList$.next();
        this.compPartenzaService.getPreAccoppiati()
            .subscribe({
                next: data => this.newPreaccoppiatiList$.next(data),
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newPreaccoppiatiList$.asObservable();
    }

    onNewMezziComposizioneList() {
        this.newMezziComposizioneList$.next();
        this.compPartenzaService.getMezziComposizione()
            .subscribe({
                next: data => this.newMezziComposizioneList$.next(data),
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newMezziComposizioneList$.asObservable();
    }

    onNewSquadreList() {
        this.newSquadreList$.next();
        this.compPartenzaService.getSquadre()
            .subscribe({
                next: data => this.newSquadreList$.next(data),
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newSquadreList$.asObservable();
    }
}
