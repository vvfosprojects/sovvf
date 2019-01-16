import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';

// Service

@Component({
  selector: 'app-squadra-composizione',
  templateUrl: './squadra-composizione.component.html',
  styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit {
  @Input() squadraComp: SquadraComposizione;
  @Output() selezionata = new EventEmitter<SquadraComposizione>();
  @Output() deselezionata = new EventEmitter<SquadraComposizione>();

  constructor() {
  }

  ngOnInit() {
  }

  onHoverIn() {
    this.squadraComp.hover = true;
  }

  onHoverOut() {
    this.squadraComp.hover = false;
  }

  onClick() {
    if (!this.squadraComp.selezionato) {
      this.squadraComp.selezionato = true;
      this.selezionata.emit(this.squadraComp);
    } else {
      this.squadraComp.selezionato = false;
      this.deselezionata.emit(this.squadraComp);
    }
  }

  liClass() {
    let returnClass = '';

    const hover = this.squadraComp.hover ? 'hover-si' : 'hover-no';
    const selezionato = this.squadraComp.selezionato ? 'selezionato-si' : 'selezionato-no';

    switch (hover + '|' + selezionato) {
      case 'hover-si|selezionato-no':
        returnClass += 'border-warning';
        break;
      case 'hover-no|selezionato-si':
        returnClass += 'border-danger diagonal-stripes bg-lightgrey';
        break;
      case 'hover-si|selezionato-si':
        returnClass += 'border-danger diagonal-stripes bg-lightgrey';
        break;
    }

    return returnClass;
  }
}
