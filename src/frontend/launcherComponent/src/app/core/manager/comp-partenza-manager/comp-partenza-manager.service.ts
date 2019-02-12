import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Service
import { DispatcherCompPartenzaService } from '../../dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';

// Model
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';
import { SquadraComposizione } from 'src/app/features/home/composizione-partenza/interface/squadra-composizione-interface';

@Injectable()
export class CompPartenzaManagerService {
    private newPreAccoppiatieList$ = new Subject<BoxPartenza[]>();
    private newMezziComposizioneList$ = new Subject<MezzoComposizione[]>();
    private newSquadreList$ = new Subject<SquadraComposizione[]>();

    constructor(private compPartenzaDispatcher: DispatcherCompPartenzaService) {
    }

    getPreAccoppiati() {
        this.newPreAccoppiatieList$.next();
        this.compPartenzaDispatcher.onNewPreAccoppiatiList()
            .subscribe({
                next: data => {
                    this.newPreAccoppiatieList$.next(data);
                },
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newPreAccoppiatieList$.asObservable();
    }

    getMezziComposizione() {
        this.newMezziComposizioneList$.next();
        this.compPartenzaDispatcher.onNewMezziComposizioneList()
            .subscribe({
                next: data => {
                    this.newMezziComposizioneList$.next(data);
                },
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newMezziComposizioneList$.asObservable();
    }

    getSquadre() {
        this.newSquadreList$.next();
        this.compPartenzaDispatcher.onNewSquadreList()
            .subscribe({
                next: data => {
                    this.newSquadreList$.next(data);
                },
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newSquadreList$.asObservable();
    }

    onNewPreAccoppiatiList() {
        return;
    }
}
