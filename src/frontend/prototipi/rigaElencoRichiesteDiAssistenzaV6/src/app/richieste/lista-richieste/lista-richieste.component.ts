import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from '../lista-richieste-manager/lista-richieste-manager.service';

@Component({
  selector: 'app-lista-richieste',
  templateUrl: './lista-richieste.component.html',
  styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
  richieste: SintesiRichiesta[];

  constructor(private listaRichiesteManager: ListaRichiesteManagerService) { }

  ngOnInit() {
    this.listaRichiesteManager.getData().subscribe(richieste => {
      this.richieste = richieste;
    });
  }
}
