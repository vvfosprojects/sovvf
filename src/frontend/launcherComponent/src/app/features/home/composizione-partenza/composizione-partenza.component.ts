import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, isDevMode } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { BoxClickService } from '../boxes/info-aggregate/box-service/box-click.service';
import { Subject, Subscription } from 'rxjs';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';
import { Store } from '@ngxs/store';
import { BoxClickState } from '../boxes/store/states/box-click.state';
import { ResetAllBoxes } from '../boxes/store/actions/box-click.actions';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;
    @Input() compPartenzaMode: string;
    @Output() statoPartenza = new EventEmitter<string>();
    subscription = new Subscription();
    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();

    centroMappa: CentroMappa;

    constructor(private centerService: CenterService,
                private store: Store,
                private markerS: MarkerService) {
    }

    ngOnInit() {
        this.centroMappa = this.centerService.centroMappaIniziale;
        if (this.richiesta) {
            /* this.boxClickService.allTrueByRichiesta(this.richiesta.stato); */
        } else {
            this.dismissPartenza();
        }
        isDevMode() && console.log('Componente Composizione creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Composizione distrutto');
    }

    dismissPartenza(): void {
        this.centerService.sendCentro(this.centroMappa);
        this.dismissPartenzaSubject.next(true);
        this.markerS.noAction();
        this.store.dispatch(new ResetAllBoxes());
        this.statoPartenza.emit('normale');
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
