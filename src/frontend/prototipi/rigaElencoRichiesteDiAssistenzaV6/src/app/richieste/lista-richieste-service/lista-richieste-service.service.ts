import { Injectable } from '@angular/core';
import { EventiService } from '../../shared/eventi/eventi.service';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteService {

  constructor(private eventi: EventiService) { }

  richiestaClick(richiesta) {
    this.eventi.richiesta.richiestaClick(richiesta);
  }
  richiestaHoverIn(richiesta) {
    this.eventi.richiesta.richiestaHoverIn(richiesta);
  }
  richiestaHoverOut(richiesta) {
    this.eventi.richiesta.richiestaHoverOut(richiesta);
  }
  unClick() {
    this.eventi.richiesta.unClick();
  }
}
