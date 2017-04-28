import { Component, OnInit, Input } from '@angular/core';

import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';

@Component({
  selector: 'app-componente-squadra',
  templateUrl: './componente-squadra.component.html',
  styleUrls: ['./componente-squadra.component.css']
})
export class ComponenteSquadraComponent implements OnInit {
  @Input() componente: ComponenteSquadra;
  constructor() { }

  ngOnInit() {
  }

  get nominativoEsteso() {
    return this.componente.nominativoEsteso;
  }

}
