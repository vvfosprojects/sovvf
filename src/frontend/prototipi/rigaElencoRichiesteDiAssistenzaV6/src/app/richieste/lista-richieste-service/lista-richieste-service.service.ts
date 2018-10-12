import { Injectable } from '@angular/core';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from './lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteSubjects } from './_lista-richieste-subjects';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteService {
  subjects = new ListaRichiesteSubjects;

  constructor(private richiesteManager: ListaRichiesteManagerService) {
  }

  getRichiestaById(id) {
    let richieste: SintesiRichiesta[];
    let richiesta: SintesiRichiesta;

    this.richiesteManager.getData().subscribe((r: SintesiRichiesta[]) => {
      richieste = r;
    });

    richieste.forEach(r => {
      if (r.id === id) {
        richiesta = r;
      }
    });
    return richiesta;
  }

  hoverIn(richiesta) {
    this.subjects.sendRichiestaHover(richiesta);
  }
  hoverOut() {
    this.subjects.clearRichiestaHover();
  }
  selezionata(richiesta) {
    this.subjects.sendRichiestaSelezionata(richiesta);
  }
  deselezionata() {
    this.subjects.clearRichiestaSelezionata();
  }
  fissata(richiesta) {
    this.subjects.sendRichiestaFissata(richiesta);
  }
  defissata() {
    this.subjects.clearRichiestaFissata();
  }
}
