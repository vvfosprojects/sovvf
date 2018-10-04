import { Injectable } from '@angular/core';
import { RichiestaSelezionataService } from '../../lista-richieste-service/richiesta-selezionata-service/richiesta-selezionata-service.service';
import { RichiestaHoverService } from '../../lista-richieste-service/richiesta-hover-service/richiesta-hover-service.service';

@Injectable({
  providedIn: 'root'
})
export class MethodTestService {
  id_richiestaHover: any;
  id_richiestaSelezionata: any;

  constructor(private richiestaSelezionataS: RichiestaSelezionataService,
    private richiestaHoverS: RichiestaHoverService) {

    // Restituisce la Richiesta Selezionata
    this.richiestaSelezionataS.getRichiesta().subscribe(idRichiesta => {
      if (idRichiesta) {
        this.id_richiestaSelezionata = idRichiesta;
      } else {
        this.id_richiestaSelezionata = null;
      }
    });
  }

  hover(id_richiesta) {
    this.richiestaHoverS.sendRichiesta(id_richiesta);
  }

  clearHover() {
    this.richiestaHoverS.clearRichiesta();
  }

  seleziona(id_richiesta) {
    if (!this.id_richiestaSelezionata || id_richiesta !== this.id_richiestaSelezionata) {
      this.deselezionaRichiestaSelezionata();
      this.richiestaSelezionataS.sendRichiesta(id_richiesta);
      /* setTimeout(() => {
        this.richiestaSelezionataState = 'selected';
      }, 200); */
    }
  }

  deselezionaRichiestaSelezionata() {
    /* this.richiestaSelezionataState = 'not-selected'; */
    this.richiestaSelezionataS.clearRichiesta();
  }
}
