import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BoxInterventi } from '../../boxes-model/box-interventi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';
import { objectDiff } from '../../../../../shared/helper/function';
import { setArrow, setBlinking } from '../../../../../shared/helper/function-css';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TurnoCalendario } from '../../../../navbar/turno/turno-calendario.model';
import {Select} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {ImpostazioniState} from '../../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-box-interventi',
    templateUrl: './box-interventi.component.html',
    styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent implements OnChanges {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    sunMode: boolean;

    @Input() interventi: BoxInterventi;
    @Input() turno: TurnoCalendario;
    @Input() boxClick: BoxClickInterface;

    @Output() clickRichieste = new EventEmitter<string>();

    interventiDiff: any;

    private subscription = new Subscription();

    ngOnChanges(changes: SimpleChanges): void {
        const interventi = changes['interventi'];
        if (interventi && interventi.currentValue && interventi.previousValue) {
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

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        // config.openDelay = 200;
        // config.closeDelay = 100;
        this.getSunMode();
    }

    checkDiff(key: string): string {
        if (this.interventiDiff) {
            return setBlinking(this.interventiDiff[key]);
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

    realDiff(key: string): string {
        if (this.interventiDiff) {
            return setArrow(this.interventiDiff[key]);
        }
    }
}
