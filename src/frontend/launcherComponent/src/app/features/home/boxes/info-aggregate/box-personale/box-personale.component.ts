import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { objectDiff } from '../../../../../shared/helper/function-generiche';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-box-personale',
    templateUrl: './box-personale.component.html',
    styleUrls: ['./box-personale.component.css']
})
export class BoxPersonaleComponent implements OnChanges {

    @Input() personaleQty: BoxPersonaleQty;
    @Input() personalePresenze: BoxPersonalePresenze;

    personaleDiff: any;

    ngOnChanges(changes: SimpleChanges): void {
        const personaleQty = changes.personaleQty;
        if (personaleQty && personaleQty.currentValue && personaleQty.previousValue) {
            this.personaleDiff = objectDiff(personaleQty.currentValue, personaleQty.previousValue);
            setTimeout(() => {
                this.personaleDiff = null;
            }, 5000);
        }

    }

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        // config.openDelay = 200;
        // config.closeDelay = 100;
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
