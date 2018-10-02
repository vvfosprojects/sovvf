import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from '../lista-richieste-manager/lista-richieste-manager.service';
import { RichiestaSelezionataService } from '../lista-richieste-service/richiesta-selezionata-service/richiesta-selezionata-service.service';

@Component({
  selector: 'app-lista-richieste',
  templateUrl: './lista-richieste.component.html',
  styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
  richieste: SintesiRichiesta[];
  richiestaSelezionata: SintesiRichiesta;
  richiestaSelezionataState: string;

  constructor(private listaRichiesteManager: ListaRichiesteManagerService,
    private richiestaSelezionataS: RichiestaSelezionataService) { }

  ngOnInit() {
    this.listaRichiesteManager.getData().subscribe(richieste => {
      this.richieste = richieste;
    });

    this.richiestaSelezionataS.getRichiesta().subscribe(idRichiesta => {
      if (idRichiesta) {
        this.richieste.forEach((r: SintesiRichiesta) => {
          if (r.id === idRichiesta) {
            this.richiestaSelezionata = r;
          }
        });
      } else {
        this.richiestaSelezionata = null;
      }
    });
  }

  selezionata(id) {
    if (!this.richiestaSelezionata || id !== this.richiestaSelezionata.id) {
      this.deseleziona();
      this.richiestaSelezionataS.sendRichiesta(id);
      setTimeout(() => {
        this.richiestaSelezionataState = 'selected';
      }, 200);
    }
  }

  deseleziona() {
    this.richiestaSelezionataState = 'not-selected';
    this.richiestaSelezionataS.clearRichiesta();
  }
}
