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
export class SquadraComposizioneComponent implements OnInit {
  @Input() squadra: Squadra;

  constructor(private compMezzoSquadra: CompMezzoSquadraService) {
  }

  ngOnInit() {
  }

  hoverIn() {
  }

  hoverOut() {
  }
}
