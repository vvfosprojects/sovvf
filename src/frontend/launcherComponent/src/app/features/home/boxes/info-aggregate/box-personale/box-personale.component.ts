import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { objectDiff } from '../../../../../shared/helper/function';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';

@Component({
    selector: 'app-box-personale',
    templateUrl: './box-personale.component.html',
    styleUrls: ['./box-personale.component.css']
})
export class BoxPersonaleComponent implements OnChanges {

    personaleDiff: any;

    @Input() personaleQty: BoxPersonaleQty;
    @Input() personalePresenze: BoxPersonalePresenze;
    @Output() clickServizi = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges): void {
        const personaleQty = changes['personaleQty'];
        if (personaleQty && personaleQty.currentValue && personaleQty.previousValue) {
            this.personaleDiff = objectDiff(personaleQty.currentValue, personaleQty.previousValue);
            setTimeout(() => {
                this.personaleDiff = null;
            }, 5000);
        }

    }

    checkDiff(key: string) {
        if (this.personaleDiff) {
            return setBlinking(this.personaleDiff[key]);
        }
    }

    realDiff(key: string) {
        if (this.personaleDiff) {
            return setArrow(this.personaleDiff[key]);
        }
    }

}
