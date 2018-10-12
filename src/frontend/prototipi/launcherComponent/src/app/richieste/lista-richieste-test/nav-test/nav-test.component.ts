import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from '../../lista-richieste-service/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteService } from '../../lista-richieste-service/lista-richieste-service.service';

@Component({
  selector: 'app-nav-test',
  templateUrl: './nav-test.component.html',
  styleUrls: ['./nav-test.component.css']
})
export class NavTestComponent implements OnInit {
  richieste: SintesiRichiesta[];
  id_richiestaScelta: any;
  fissata = false;

  constructor(private richiesteManager: ListaRichiesteManagerService, private richiesteS: ListaRichiesteService) { }

  ngOnInit() {
    // Restituisce le richieste
    this.richiesteManager.getData().subscribe((richieste: SintesiRichiesta[]) => {
      this.richieste = richieste;
    });
  }

  hover(id) {
    if (id !== null) {
      this.id_richiestaScelta = id;
    } else {
      this.id_richiestaScelta = null;
    }
    this.richiesteS.hoverIn(this.getRichiestaById(id));
  }
  fissa() {
    this.fissata = !this.fissata;
    this.richiesteS.fissata(this.getRichiestaById(this.id_richiestaScelta));
  }
  defissa() {
    this.fissata = !this.fissata;
    this.richiesteS.defissata();
  }

  getRichiestaById(id) {
    return this.richiesteS.getRichiestaById(id);
  }
}
