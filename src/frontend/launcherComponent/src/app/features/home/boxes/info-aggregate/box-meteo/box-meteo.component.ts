import { Component, Input } from '@angular/core';
import { Meteo } from '../../../../../shared/model/meteo.model';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent {

    @Input() datimeteo: Meteo;
    @Input() nightMode: boolean;


    constructor() {
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
