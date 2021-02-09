import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { objectDiff } from '../../../../../shared/helper/function';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {ViewportState} from '../../../../../shared/store/states/viewport/viewport.state';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-box-mezzi',
    templateUrl: './box-mezzi.component.html',
    styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnChanges {

    @Select(ViewportState.sunMode) sunMode$: Observable<boolean>;
    sunMode: boolean;

    mezziDiff: any;
    @Input() mezzi: BoxMezzi;
    @Input() boxClick: BoxClickInterface;
    @Output() clickMezzi = new EventEmitter<string>();

    private subscription = new Subscription();

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
        this.getSunMode();
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

    getSunMode(): void {
      this.subscription.add(
        this.sunMode$.subscribe((sunMode: boolean) => {
          this.sunMode = sunMode;
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
