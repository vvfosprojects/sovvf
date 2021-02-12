import { Component, Input } from '@angular/core';
import { Meteo } from '../../../../../shared/model/meteo.model';
import {Observable, Subscription} from 'rxjs';
import {Select} from '@ngxs/store';
import {ImpostazioniState} from '../../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    @Input() datimeteo: Meteo;

    private subscription = new Subscription();

    constructor() {
      this.getNightMode();
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
