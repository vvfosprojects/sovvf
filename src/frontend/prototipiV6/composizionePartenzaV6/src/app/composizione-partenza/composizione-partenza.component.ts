import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, isDevMode } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { BoxClickService } from '../boxes/info-aggregate/box-service/box-click.service';
import { Subject, Subscription } from 'rxjs';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;
    @Input() compPartenzaMode = 'slower';
    @Output() statoPartenza = new EventEmitter<string>();
    subscription = new Subscription();
    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();

    centroMappa: CentroMappa;

    constructor(private centerService: CenterService,
                private boxClickService: BoxClickService,
                private markerS: MarkerService) {
    }

    ngOnInit() {
        this.boxClickService.allTrueByRichiesta(this.richiesta.stato);
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
        this.boxClickService.allFalse();
        this.statoPartenza.emit('normale');
    }

    cardClasses() {
        return;
    }

    getCentroMappa(event: CentroMappa): void {
        this.centroMappa = event;
        this.boxClickService.allTrue();
    }

}
