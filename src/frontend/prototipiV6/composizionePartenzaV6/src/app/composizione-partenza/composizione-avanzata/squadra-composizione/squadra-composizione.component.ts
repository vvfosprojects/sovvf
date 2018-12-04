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

  squadreSelezionate: Squadra[];
  hover = false;

  constructor(private compMezzoSquadra: CompMezzoSquadraService) {
    this.compMezzoSquadra.getSquadra().subscribe(squadre => {
      this.squadreSelezionate = squadre;
    });
  }

  ngOnInit() {
  }

  click(squadra) {
    if (!this.squadreSelezionate) {
      this.compMezzoSquadra.setSquadra(squadra);
    } else if (!this.checkSquadraSelezionata(squadra)) {
      this.compMezzoSquadra.setSquadra(squadra);
    } else if (this.checkSquadraSelezionata(squadra)) {
      this.compMezzoSquadra.clearSingleSquadra(squadra);
    }
  }

  checkSquadraSelezionata(squadra) {
    let selezionata = false;
    this.squadreSelezionate.forEach(ss => {
      if (squadra === ss) {
        selezionata = true;
      }
    });
    return selezionata;
  }

  hoverIn() {
    this.hover = true;
  }

  hoverOut() {
    this.hover = false;
  }

  squadraCompClass(squadra) {
    let returnClass = '';
    if (this.squadreSelezionate) {
      this.squadreSelezionate.forEach(ss => {
        if (squadra === ss) {
          returnClass = 'border-danger';
        }
      });
    }
    if(this.hover){
      returnClass = returnClass + ' bg-light';
    }
    return returnClass;
  }
}
