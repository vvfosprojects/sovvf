import { Component, OnInit, Input } from '@angular/core';

import { MezzoInPartenza } from '../mezzo-in-partenza/mezzo-in-partenza.model';

@Component({
  selector: 'app-mezzo-in-partenza',
  templateUrl: './mezzo-in-partenza.component.html',
  styleUrls: ['./mezzo-in-partenza.component.css']
})
export class MezzoInPartenzaComponent implements OnInit {
  @Input() mezzo: MezzoInPartenza;
  constructor() { }

  ngOnInit() {
  }

  public get nominativoEstesoAutista() {
    return this.mezzo.getAutista.componente.nominativoEsteso;
  }

  public get nominativoAutista() {
    return this.mezzo.getAutista.componente.nominativo;
  }

  public get componenti() {
    return this.mezzo.getComponentiNonAutisti;
  }

  public get esisteAutista() {
    return this.mezzo.esisteAutista;
  }
}
