import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FiltriRichieste } from "./filtri-richieste.model";

@Component({
  selector: 'app-comp-filtri',
  templateUrl: './comp-filtri.component.html',
  styleUrls: ['./comp-filtri.component.css']
})

export class CompFiltriComponent implements OnInit { 
  
  private filtri : FiltriRichieste; 
 
  @Output() nuovoIntervento = new EventEmitter();
  /*@Output() nuovoFiltro: EventEmitter<FiltriRichieste> = new EventEmitter();*/

  constructor() {
    this.filtri = new FiltriRichieste(true, true, true, false, true, false, true, true,'');
    }

  ngOnInit() {
   }
   /**
   * Questo metodo viene invocato sul click di una casella di filtraggio disponibile.
   */
  
   private selFiltri(elemento_filtri : string) 
   {
   
    if (elemento_filtri === "chiamate") 
       this.filtri.chiamate = !this.filtri.chiamate;     
    else if (elemento_filtri === "interventi") 
      {
       this.filtri.interventi = !this.filtri.interventi;
       if (this.filtri.interventi == false) 
          {
           this.filtri.presidiati = true; 
           this.filtri.nonPresidiati = true;  
          }
      }
    else if (elemento_filtri === "aperti")
      this.filtri.aperti = !this.filtri.aperti;
    else if (elemento_filtri === "chiusi")
      this.filtri.chiusi = !this.filtri.chiusi;
    else if (elemento_filtri === "interni")
      this.filtri.interni = !this.filtri.interni;
    else if (elemento_filtri === "esterni")
      this.filtri.esterni = !this.filtri.esterni;
    else if (elemento_filtri === "presidiati")
      this.filtri.presidiati = !this.filtri.presidiati;
    else if (elemento_filtri === "nonPresidiati")
      this.filtri.nonPresidiati = !this.filtri.nonPresidiati;
     
    
   console.log("CHIAMATE:"+ ' ' + this.filtri.chiamate + "  INTERVENTI:"+ ' '+ this.filtri.interventi + "  APERTI:"+ ' '+ this.filtri.aperti + "  CHIUSI: "+ ' '+ this.filtri.chiusi + "  INTERNI:" + ' ' + this.filtri.interni + "  ESTERNI:"+ ' '+ this.filtri.esterni + "  PRESIDIATI:"+ ' '+ this.filtri.presidiati + "  NON PRESIDIATI:"+ ' '+ this.filtri.nonPresidiati + "  CHIAVE DI RICERCA:" + ' ' + this.filtri.chiaveDiRicerca);
   
  }

  private clearSearchText()
  {
  this.filtri.chiaveDiRicerca = '';
  }
}


