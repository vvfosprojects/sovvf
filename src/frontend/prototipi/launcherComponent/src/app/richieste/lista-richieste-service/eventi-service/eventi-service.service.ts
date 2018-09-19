import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventiService {

  constructor() { }

  invioPartenza(id_richiesta) {
    console.log('Invio Partenza per ' + id_richiesta);
    return id_richiesta;
  }

  visualizzaEventiRichiesta(id_richiesta) {
    console.log('Visualizza eventi per ' + id_richiesta);
    return id_richiesta;
  }

  localizzaIntervento(id_richiesta) {
    console.log('Localizza intervento per ' + id_richiesta);
    return id_richiesta;
  }
}
