import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { objectDiff } from '../../../../../shared/helper/function-generiche';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { calcolaTurnoCalendario } from '../../../../../shared/helper/function-turno';

@Component({
    selector: 'app-box-personale',
    templateUrl: './box-personale.component.html',
    styleUrls: ['./box-personale.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class BoxPersonaleComponent implements OnChanges {

    @Input() personaleQtyPrevious: BoxPersonaleQty;
    @Input() personalePresenzePrevious: BoxPersonalePresenze;
    @Input() personaleQtyCurrent: BoxPersonaleQty;
    @Input() personalePresenzeCurrent: BoxPersonalePresenze;
    @Input() personaleQtyNext: BoxPersonaleQty;
    @Input() personalePresenzeNext: BoxPersonalePresenze;

    personaleDiff: any;

    turnoPrev: string;
    turnoCurrent: string;
    turnoNext: string;

    tabFunzionariActive = 2;
    tabTecniciActive = 2;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        // config.openDelay = 200;
        // config.closeDelay = 100;
        this.turnoPrev = calcolaTurnoCalendario().precedente;
        this.turnoCurrent = calcolaTurnoCalendario().corrente;
        this.turnoNext = calcolaTurnoCalendario().successivo;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const personaleQty = changes.personaleQty;
        if (personaleQty && personaleQty.currentValue && personaleQty.previousValue) {
            this.personaleDiff = objectDiff(personaleQty.currentValue, personaleQty.previousValue);
            setTimeout(() => {
                this.personaleDiff = null;
            }, 5000);
        }
    }

    checkDiff(key: string): string {
        if (this.personaleDiff) {
            return setBlinking(this.personaleDiff[key]);
        }
    }

    realDiff(key: string): string {
        if (this.personaleDiff) {
            return setArrow(this.personaleDiff[key]);
        }
    }

    onClickServizi(): void {
        // window.location.href = 'https://opservice-test.dipvvf.it/';
    }
}
