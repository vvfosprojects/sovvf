import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { PartenzaService } from './service/partenza/partenza.service';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { BoxClickService } from '../boxes/info-aggregate/box-service/box-click.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit {
    @Input() richiesta: SintesiRichiesta;
    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();

    centroMappa: CentroMappa;
    compPartenzaMode = 'faster';

    constructor(public partenzaS: PartenzaService,
                private centerService: CenterService,
                private boxClickService: BoxClickService) {
        this.compPartenzaMode = this.partenzaS.compPartenzaModeIniziale;
        this.partenzaS.getCompPartenzaMode().subscribe(viewMode => {
            this.compPartenzaMode = viewMode;
        });
    }

    ngOnInit() {
    }

    dismissPartenza(): void {
        this.partenzaS.dismissPartenza();
        this.centerService.sendCentro(this.centroMappa);
        this.boxClickService.allFalse();
        this.dismissPartenzaSubject.next(true);
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
        this.boxClickService.allTrue();
    }

}
