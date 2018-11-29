import { Component, OnInit, Input } from '@angular/core';
import { Squadra } from '../../../shared/model/squadra.model';

@Component({
  selector: 'app-squadra-composizione',
  templateUrl: './squadra-composizione.component.html',
  styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit {
  @Input() squadra: Squadra;
  hover = false;

  constructor() { }

  ngOnInit() {
  }

  hoverIn() {
    this.hover = true;
  }

  hoverOut() {
    this.hover = false;
  }

}
