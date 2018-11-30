import { Component, OnInit, Input } from '@angular/core';

// Model
import { Squadra } from '../../../shared/model/squadra.model';

// Service
import { CompMezzoSquadraService } from '../../service/comp-mezzo-squadra/comp-mezzo-squadra.service';

@Component({
  selector: 'app-squadra-composizione',
  templateUrl: './squadra-composizione.component.html',
  styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit {
  @Input() squadra: Squadra;

  squadraSelezionata: Squadra;
  hover = false;

  constructor(private compMezzoSquadra: CompMezzoSquadraService) {
    this.compMezzoSquadra.getSquadra().subscribe(squadra => {
      this.squadraSelezionata = squadra;
    });
  }

  ngOnInit() {
  }

  click(squadra) {
    if (!this.squadraSelezionata) {
      this.compMezzoSquadra.setSquadra(squadra);
    } else if (this.squadraSelezionata !== squadra) {
      this.compMezzoSquadra.clearSquadra();
      this.compMezzoSquadra.setSquadra(squadra);
    } else if (this.squadraSelezionata === squadra) {
      this.compMezzoSquadra.clearSquadra();
    }
  }

  hoverIn() {
    this.hover = true;
  }

  hoverOut() {
    this.hover = false;
  }

  // NgClass
  squadraCompClass() {
    return {
      'bg-light': this.hover,
      'bg-light border-danger': this.squadra === this.squadraSelezionata
    };
  }
}
