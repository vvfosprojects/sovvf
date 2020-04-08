import { Component, OnInit } from '@angular/core';

import { ListaMezziService } from './lista-mezzi.service';

@Component({
  selector: 'app-lista-mezzi',
  templateUrl: './lista-mezzi.component.html',
  styleUrls: ['./lista-mezzi.component.css']
})
export class ListaMezziComponent implements OnInit {

  constructor(private listaMezziService: ListaMezziService) { }

  ngOnInit() {
  }

  private get mezzi() {
    return this.listaMezziService.mezzi;
  }

  private impegnaAPS() {
    this.listaMezziService.impegnaAPS();
  }

  private liberaAPS() {
    this.listaMezziService.disimpegnaAPS();
  }

  private APSInPartenza() {
    this.listaMezziService.APSInPartenza();
  }

  private APSFuoriPartenza() {
    this.listaMezziService.APSFuoriPartenza();
  }
}
