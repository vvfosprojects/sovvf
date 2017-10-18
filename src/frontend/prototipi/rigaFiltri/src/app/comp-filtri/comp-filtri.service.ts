import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { FiltriRichieste } from "./filtri-richieste.model";


@Injectable()
export class CompFiltriService {
  private filtri_richieste : FiltriRichieste = 
    new FiltriRichieste(
      true, true, true, false, true, false, true, true,'');
  
   constructor() { }

  public getFiltri(): Observable<FiltriRichieste> {

    return Observable.of(this.filtri_richieste);
  }
  public getFiltriSelezionati(elemento_filtri : string, valore_filtro : FiltriRichieste)   
  {

  if (elemento_filtri === "nuova_chiamata") 
    console.log("Evento Nuova Chiamata");
  else  {
    
        if (elemento_filtri === "chiamate") 
           valore_filtro.chiamate = !valore_filtro.chiamate;     
        else if (elemento_filtri === "interventi") 
       {
        valore_filtro.interventi = !valore_filtro.interventi;
          if (valore_filtro.interventi == false) 
          {
            valore_filtro.presidiati = true; 
            valore_filtro.nonPresidiati = true;  
          }
        }
        else if (elemento_filtri === "aperti")
          valore_filtro.aperti = !valore_filtro.aperti;
        else if (elemento_filtri === "chiusi")
          valore_filtro.chiusi = !valore_filtro.chiusi;
        else if (elemento_filtri === "interni")
          valore_filtro.interni = !valore_filtro.interni;
        else if (elemento_filtri === "esterni")
          valore_filtro.esterni = !valore_filtro.esterni;
        else if (elemento_filtri === "presidiati")
          valore_filtro.presidiati = !valore_filtro.presidiati;
        else if (elemento_filtri === "nonPresidiati")
          valore_filtro.nonPresidiati = !valore_filtro.nonPresidiati;
         
        console.log("CHIAMATE:"+ ' ' + valore_filtro.chiamate + "  INTERVENTI:"+ ' '+ valore_filtro.interventi + "  APERTI:"+ ' '+ valore_filtro.aperti + "  CHIUSI: "+ ' '+ valore_filtro.chiusi + "  INTERNI:" + ' ' + valore_filtro.interni + "  ESTERNI:"+ ' '+ valore_filtro.esterni + "  PRESIDIATI:"+ ' '+ valore_filtro.presidiati + "  NON PRESIDIATI:"+ ' '+ valore_filtro.nonPresidiati + "  CHIAVE DI RICERCA:" + ' ' + valore_filtro.chiaveDiRicerca);
       }
      }

}


