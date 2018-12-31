import { Injectable } from '@angular/core';
import { ListaRichiesteManagerService } from '../../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteSubjects } from './_lista-richieste-subjects';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteService {
  subjects = new ListaRichiesteSubjects;

  constructor(private richiesteManager: ListaRichiesteManagerService) {
  }

  hoverIn(id: any) {
    const richiesta = this.richiesteManager.getRichiestaFromId(id);
    this.subjects.sendRichiestaHover(richiesta);
  }
  hoverOut() {
    this.subjects.clearRichiestaHover();
  }
  selezionata(id: any) {
    const richiesta = this.richiesteManager.getRichiestaFromId(id);
    this.subjects.sendRichiestaSelezionata(richiesta);
  }
  deselezionata() {
    this.subjects.clearRichiestaSelezionata();
  }
  fissata(id: any, fromMap?: boolean) {
    const richiesta = this.richiesteManager.getRichiestaFromId(id, fromMap);
    this.subjects.sendRichiestaFissata(richiesta);
  }
  defissata() {
    this.subjects.clearRichiestaFissata();
  }
}
