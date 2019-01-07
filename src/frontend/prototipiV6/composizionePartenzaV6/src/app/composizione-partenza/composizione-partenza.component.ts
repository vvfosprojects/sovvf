import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, isDevMode } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { PartenzaService } from './service/partenza/partenza.service';
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
    subscription = new Subscription();
    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();

    centroMappa: CentroMappa;
    compPartenzaMode = 'faster';

    constructor(public partenzaS: PartenzaService,
                private centerService: CenterService,
                private boxClickService: BoxClickService,
                private markerS: MarkerService) {
        this.compPartenzaMode = this.partenzaS.compPartenzaModeIniziale;
        this.subscription.add(
            this.partenzaS.getCompPartenzaMode().subscribe(viewMode => {
                this.compPartenzaMode = viewMode;
            }));
    }

    ngOnInit() {
        this.boxClickService.allTrueByRichiesta(this.richiesta.stato);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.markerS.noAction();
        this.boxClickService.allFalse();
        isDevMode() && console.log('Composizione partenza distrutto');
    }

    dismissPartenza(): void {
        this.partenzaS.dismissPartenza();
        this.centerService.sendCentro(this.centroMappa);
        this.dismissPartenzaSubject.next(true);
    }

    cardClasses() {
        return;
    }

    getCentroMappa(event: CentroMappa): void {
        this.centroMappa = event;
        this.boxClickService.allTrue();
    }

}
