import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

// Model
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';

// Service
import { ComposizioneAvanzataService } from '../../service/composizione-avanzata/composizione-avanzata.service';

@Component({
  selector: 'app-squadra-composizione',
  templateUrl: './squadra-composizione.component.html',
  styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit {
  @Input() squadra: SquadraComposizione;

  constructor(private composizioneService: ComposizioneAvanzataService) {
  }

  ngOnInit() {
  }

  onHoverIn() {
    this.squadra.hover = true;
  }

  onHoverOut() {
    this.squadra.hover = false;
  }

  onClick() {
    this.squadra.selezionato = !this.squadra.selezionato;
  }

  liClass() {
      return {
          'border-warning bg-light': this.squadra.hover,
          'border-danger bg-grey': this.squadra.selezionato
      };
  }
}
