import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, isDevMode } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { Subject, Subscription } from 'rxjs';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';
import { Store } from '@ngxs/store';
import { ResetAllBoxes, AllFalseBoxRichieste, AllTrueBoxMezzi, Reducer } from '../boxes/store/actions/box-click.actions';
import { CompPartenzaManagerService } from 'src/app/core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { MezzoComposizione } from './interface/mezzo-composizione-interface';
import { SquadraComposizione } from './interface/squadra-composizione-interface';
import { BoxPartenza } from './interface/box-partenza-interface';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { AppFeatures } from '../../../shared/enum/app-features.enum';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;
    @Input() compPartenzaMode: string;
    @Output() statoPartenza = new EventEmitter<string>();
    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();
    Composizione = Composizione;

    subscription = new Subscription();
    mezziComposizione: MezzoComposizione[];
    squadreComposizione: SquadraComposizione[];
    preAccoppiati: BoxPartenza[];

    centroMappa: CentroMappa;

    statoPrecedente: any;

    constructor(private store: Store,
        private centerService: CenterService,
        private markerS: MarkerService,
        private compPartenzaManager: CompPartenzaManagerService) {

        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.compPartenzaManager.getMezziComposizione().subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.compPartenzaManager.getSquadre().subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = squadreComp;
            })
        );

            // Restituisce i PreAccoppiati
        this.subscription.add(
            this.compPartenzaManager.getPreAccoppiati().subscribe((preAccoppiati: BoxPartenza[]) => {
                this.preAccoppiati = preAccoppiati;
                console.log(preAccoppiati);
            })
        );
    }

    ngOnInit() {
        this.centroMappa = this.centerService.centroMappaIniziale;
        if (this.richiesta) {
            this.statoPrecedente = this.store.snapshot();
            this.store.dispatch(new AllFalseBoxRichieste());
            this.store.dispatch(new AllTrueBoxMezzi());
            this.store.dispatch(new Reducer('richieste', wipeStatoRichiesta(this.richiesta.stato)));
        } else {
            this.dismissPartenza();
        }
        isDevMode() && console.log('Componente Composizione creato');
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Composizione distrutto');
    }

    dismissPartenza(): void {
        this.centerService.sendCentro(this.centroMappa);
        this.dismissPartenzaSubject.next(true);
        this.markerS.noAction();
        this.store.dispatch(new ResetAllBoxes());
        this.store.reset(this.statoPrecedente);
        this.statoPartenza.emit(AppFeatures.Default);
    }

    match(word1: string, word2: string) {
        const word1San = word1.toLowerCase().substr(0, word1.length - 1);
        const word2San = word2.toLowerCase().substr(0, word2.length - 1);
        if (word1San === word2San) {
            return true;
        }
    }

    cardClasses(r: any) {
        if (r) {
            return {
                // Bordo sinistro (stato)
                'status_chiamata': this.match(r.stato, 'chiamata'),
                'status_presidiato': this.match(r.stato, 'presidiato'),
                'status_assegnato': this.match(r.stato, 'assegnato'),
                'status_sospeso': this.match(r.stato, 'sospeso'),
                'status_chiuso': this.match(r.stato, 'chiuso')
            };
        }
    }

    getCentroMappa(event: CentroMappa): void {
        this.centroMappa = event;
    }

}

export function wipeStatoRichiesta(stato: string): string {
    const stati: [string, string][] = [
        ['chiam', 'chiamate'],
        ['sospe', 'sospesi'],
        ['asseg', 'assegnati'],
        ['presi', 'presidiati'],
        ['chius', 'chiusi']
    ];
    const mapTipoStato: Map<string, string> = new Map(stati);
    const wipeStato = stato.toLowerCase().substr(0, 5);
    return mapTipoStato.get(wipeStato);
}
