import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { objectDiff } from '../../../../../shared/helper/function';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {ImpostazioniState} from '../../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-box-mezzi',
    templateUrl: './box-mezzi.component.html',
    styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnChanges {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

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
        this.getNightMode();
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

    getNightMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.nightMode = nightMode;
        })
      );
    }

    nightModeStyle(): string {
      let value = '';
      if (!this.nightMode) {
        value = 'cod-int';
      } else if (this.nightMode) {
        value = 'moon-cod';
      }
      return value;
    }
}
