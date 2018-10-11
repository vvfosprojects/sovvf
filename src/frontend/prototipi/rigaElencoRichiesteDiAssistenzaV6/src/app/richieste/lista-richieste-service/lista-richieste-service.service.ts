import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from './lista-richieste-manager/lista-richieste-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteService {
  private richiestaHover = new Subject<SintesiRichiesta>();
  private richiestaFissata = new Subject<SintesiRichiesta>();
  private richiestaSelezionata = new Subject<SintesiRichiesta>();

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

  /* <== Richiesta Hover ==> */
  hoverIn(richiesta) {
    this.sendRichiestaHover(richiesta);
  }
  hoverOut() {
    this.clearRichiestaHover();
  }

  sendRichiestaHover(richiesta) {
    this.richiestaHover.next(richiesta);
  }
  clearRichiestaHover() {
    this.richiestaHover.next();
  }
  getRichiestaHover(): Observable<any> {
    return this.richiestaHover.asObservable();
  }
  /* <== End Richiesta Hover ==> */

  /* <== Richiesta Fissata ==> */
  fissata(richiesta) {
    this.sendRichiestaFissata(richiesta);
  }
  defissata() {
    this.clearRichiestaFissata();
  }

  sendRichiestaFissata(richiesta) {
    this.richiestaFissata.next(richiesta);
  }
  clearRichiestaFissata() {
    this.richiestaFissata.next();
  }
  getRichiestaFissata(): Observable<any> {
    return this.richiestaFissata.asObservable();
  }
  /* <== End Richiesta Fissata ==> */

  /* <== Richiesta Selezionata ==> */
  selezionata(richiesta) {
    this.sendRichiestaSelezionata(richiesta);
  }
  deselezionata() {
    this.clearRichiestaSelezionata();
  }

  sendRichiestaSelezionata(richiesta) {
    this.richiestaSelezionata.next(richiesta);
  }
  clearRichiestaSelezionata() {
    this.richiestaSelezionata.next();
  }
  getRichiestaSelezionata(): Observable<any> {
    return this.richiestaSelezionata.asObservable();
  }
  /* <== End Richiesta Selezionata ==> */
}
