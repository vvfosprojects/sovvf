import { Component, OnInit } from '@angular/core';

import { Squadra } from '../squadra/squadra.model';
import { ListaSquadreService } from './lista-squadre.service';

@Component({
  selector: 'app-lista-squadre',
  templateUrl: './lista-squadre.component.html',
  styleUrls: ['./lista-squadre.component.css']
})
export class ListaSquadreComponent implements OnInit {
  constructor(private listaSquadreService: ListaSquadreService) { }

  ngOnInit() {
  }

  get squadre(): Squadra[] {
    return this.listaSquadreService.squadre;
  }

  private impegnaMino(): void {
    this.listaSquadreService.impegnaMino();
  }

  private liberaMino(): void {
    this.listaSquadreService.liberaMino();
  }

  private minoInPartenza(): void {
    this.listaSquadreService.minoInPartenza();
  }

  private minoFuoriPartenza(): void {
    this.listaSquadreService.minoFuoriPartenza();
  }
}
