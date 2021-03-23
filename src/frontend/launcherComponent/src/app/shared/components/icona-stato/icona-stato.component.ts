import {Component, Input} from '@angular/core';
import {boxStatiClass} from '../../helper/composizione-functions';

@Component({
  selector: 'app-icona-stato',
  templateUrl: './icona-stato.component.html',
  styleUrls: ['./icona-stato.component.css']
})

export class IconaStatoComponent {

  @Input() stato: any;

  constructor() {
  }

  _boxStatiClass(stato: string): string {
    return boxStatiClass(stato);
  }

}
