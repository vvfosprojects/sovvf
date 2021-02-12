import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { objectDiff } from '../../../../../shared/helper/function';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { BoxPersonalePresenze, BoxPersonaleQty } from '../../../../../shared/interface/box-personale.interface';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {ImpostazioniState} from '../../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-box-personale',
    templateUrl: './box-personale.component.html',
    styleUrls: ['./box-personale.component.css']
})
export class BoxPersonaleComponent implements OnChanges {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    sunMode: boolean;

    @Input() personaleQty: BoxPersonaleQty;
    @Input() personalePresenze: BoxPersonalePresenze;

    @Output() clickServizi = new EventEmitter<string>();

    personaleDiff: any;

    private subscription = new Subscription();

    ngOnChanges(changes: SimpleChanges): void {
        const personaleQty = changes['personaleQty'];
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
        this.getSunMode();
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

    getSunMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.sunMode = !nightMode;
        })
      );
    }

    sunModeStyle(): string {
      let value = '';
      if (this.sunMode) {
        value = 'cod-int';
      } else if (!this.sunMode) {
        value = 'moon-cod';
      }
      return value;
    }
}
