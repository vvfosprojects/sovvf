import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { objectDiff } from '../../../../../shared/helper/function-generiche';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-box-mezzi',
    templateUrl: './box-mezzi.component.html',
    styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnChanges {

    mezziDiff: any;
    @Input() mezzi: BoxMezzi;
    @Input() boxClick: BoxClickInterface;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
    }

    ngOnChanges(changes: SimpleChanges): void {
        const mezzi = changes.mezzi;
        if (mezzi && mezzi.currentValue && mezzi.previousValue) {
            this.mezziDiff = objectDiff(mezzi.currentValue, mezzi.previousValue);
            setTimeout(() => {
                this.mezziDiff = null;
            }, 5000);
        }
    }

    checkDiff(key: string): string {
        if (this.mezziDiff) {
            return setBlinking(this.mezziDiff[key]);
        }
    }

    realDiff(key: string): string {
        if (this.mezziDiff) {
            return setArrow(this.mezziDiff[key]);
        }
    }
}
