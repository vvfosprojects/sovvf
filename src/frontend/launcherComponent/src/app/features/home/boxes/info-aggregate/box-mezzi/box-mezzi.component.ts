import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { objectDiff } from '../../../../../shared/helper/function';
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
    @Output() clickMezzi = new EventEmitter<string>();


    ngOnChanges(changes: SimpleChanges): void {
        const mezzi = changes['mezzi'];
        if (mezzi && mezzi.currentValue && mezzi.previousValue) {
            this.mezziDiff = objectDiff(mezzi.currentValue, mezzi.previousValue);
            setTimeout( () => {
                this.mezziDiff = null;
            }, 5000);
        }
    }

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        // config.openDelay = 200;
        // config.closeDelay = 100;
    }

    checkDiff(key: string) {
        if (this.mezziDiff) {
            return setBlinking(this.mezziDiff[key]);
        }
    }

    realDiff(key: string) {
        if (this.mezziDiff) {
            return setArrow(this.mezziDiff[key]);
        }
    }

}
