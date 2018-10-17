import { Injectable } from '@angular/core';
import { ListaRichiesteManagerService } from '../../dispatcher/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteSubjects } from './_lista-richieste-subjects';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteService {
  subjects = new ListaRichiesteSubjects;

  constructor(private richiesteManager: ListaRichiesteManagerService) {
  }

  getRichiestaFromId(id) {
    return this.richiesteManager.getRichiestaFromId(id);
  }

  hoverIn(id) {
    const richiesta = this.getRichiestaFromId(id);
    this.subjects.sendRichiestaHover(richiesta);
  }
  hoverOut() {
    this.subjects.clearRichiestaHover();
  }
  selezionata(id) {
    const richiesta = this.getRichiestaFromId(id);
    this.subjects.sendRichiestaSelezionata(richiesta);
  }
  deselezionata() {
    this.subjects.clearRichiestaSelezionata();
  }
  fissata(id) {
    const richiesta = this.getRichiestaFromId(id);
    this.subjects.sendRichiestaFissata(richiesta);
  }
  defissata() {
    this.subjects.clearRichiestaFissata();
  }
}
