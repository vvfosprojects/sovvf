import { Component, OnInit, Input } from '@angular/core';

import { Squadra } from '../squadra/squadra.model';

@Component({
  selector: 'app-squadra',
  templateUrl: './squadra.component.html',
  styleUrls: ['./squadra.component.css']
})
export class SquadraComponent implements OnInit {
  @Input() squadra: Squadra;

  espansa: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleEspansa(event) {
    this.espansa = !this.espansa;
    event.stopPropagation();
  }

  public askIfYouCanBeDroppedOn(target: any): boolean {
        if ('canYouAcceptSquadra' in target) {
            return target.canYouAcceptSquadra(this);
        }

        return false;
    }
}
