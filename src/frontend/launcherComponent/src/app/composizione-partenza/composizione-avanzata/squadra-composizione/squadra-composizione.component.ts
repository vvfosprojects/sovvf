import { Component, OnInit, Input, OnChanges } from '@angular/core';

// Model
import { Squadra } from '../../../shared/model/squadra.model';
import { BoxPartenza } from '../../model/box-partenza.model';

// Service
import { CompMezzoSquadraService } from '../../service/comp-mezzo-squadra/comp-mezzo-squadra.service';

@Component({
  selector: 'app-squadra-composizione',
  templateUrl: './squadra-composizione.component.html',
  styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit, OnChanges {
  @Input() squadra: Squadra;
  @Input() partenze: BoxPartenza[];
  @Input() idPartenzaAttuale: number;

  squadreSelezionate: Squadra[];
  hover = false;

  constructor(private compMezzoSquadra: CompMezzoSquadraService) {
    this.compMezzoSquadra.getSquadra().subscribe(squadre => {
      this.squadreSelezionate = squadre;
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.partenze.length > 0) {
      if (this.partenze[this.idPartenzaAttuale]) {
        // squadre selezionate relative all'id attuale
        const squadre = this.partenze[this.idPartenzaAttuale].squadra;
        // elimino dalla subject le squadra selezionate
        this.compMezzoSquadra.clearSquadra();
        // next nella subject delle squadre selezionate relative all'id attuale
        squadre.forEach((s: Squadra) => {
          this.compMezzoSquadra.setSquadra(s);
        });
      }
    }
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

    if (this.hover) {
      returnClass = returnClass + ' bg-light';
    }
    return returnClass;
  }
}
