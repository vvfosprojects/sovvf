import { Component, Input } from '@angular/core';
import { Meteo } from '../../../../../shared/model/meteo.model';
import {Observable, Subscription} from 'rxjs';
import {Select} from '@ngxs/store';
import {ViewportState} from '../../../../../shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent {

    @Select(ViewportState.sunMode) sunMode$: Observable<boolean>;
    sunMode: boolean;

    @Input() datimeteo: Meteo;

    private subscription = new Subscription();

    constructor() {
      this.getSunMode();
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
