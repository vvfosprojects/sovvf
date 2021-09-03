import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BoxInterventi } from '../../boxes-model/box-interventi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';
import { objectDiff } from '../../../../../shared/helper/function-generiche';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TurnoCalendario } from '../../../../navbar/turno/model/turno-calendario.model';

@Component({
    selector: 'app-box-interventi',
    templateUrl: './box-interventi.component.html',
    styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent implements OnChanges {

    @Input() interventi: BoxInterventi;
    @Input() turno: TurnoCalendario;
    @Input() boxClick: BoxClickInterface;

    interventiDiff: any;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
    }

    ngOnChanges(changes: SimpleChanges): void {
        const interventi = changes.interventi;
        if (interventi?.currentValue && interventi?.previousValue) {
            this.interventiDiff = objectDiff({
                chiamate: interventi.currentValue.chiamate,
                assegnati: interventi.currentValue.assegnati,
                presidiati: interventi.currentValue.presidiati,
                sospesi: interventi.currentValue.sospesi
            }, {
                chiamate: interventi.previousValue.chiamate,
                assegnati: interventi.previousValue.assegnati,
                presidiati: interventi.previousValue.presidiati,
                sospesi: interventi.previousValue.sospesi
            });
            setTimeout(() => {
                this.interventiDiff = null;
            }, 5000);
        }
    }

    checkDiff(key: string): string {
        if (this.interventiDiff) {
            return setBlinking(this.interventiDiff[key]);
        }
    }

    realDiff(key: string): string {
        if (this.interventiDiff) {
            return setArrow(this.interventiDiff[key]);
        }
    }
}
