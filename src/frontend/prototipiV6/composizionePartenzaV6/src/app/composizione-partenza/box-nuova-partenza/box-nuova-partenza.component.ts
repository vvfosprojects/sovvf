import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BoxPartenza } from '../interface/box-partenza-interface';

@Component({
  selector: 'app-box-nuova-partenza',
  templateUrl: './box-nuova-partenza.component.html',
  styleUrls: ['./box-nuova-partenza.component.css']
})
export class BoxNuovaPartenzaComponent implements OnInit {
  @Input() partenza: BoxPartenza;
  @Output() selezionato = new EventEmitter<BoxPartenza>();
  @Output() deselezionato = new EventEmitter<BoxPartenza>();

  constructor() { }

  ngOnInit() {
    // TEST
    // console.log('[BoxPartenza] Partenza', this.partenza);
  }

  onHoverIn() {
  }

  onHoverOut() {
  }

  onClick() {
  }

  NgClass() {
    return {

    };
  }
}
