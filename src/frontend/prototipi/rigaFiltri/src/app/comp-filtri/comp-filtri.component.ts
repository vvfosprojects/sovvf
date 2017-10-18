import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompFiltriService } from "./comp-filtri.service";
import { FiltriRichieste } from "./filtri-richieste.model";

@Component({
  selector: 'app-comp-filtri',
  templateUrl: './comp-filtri.component.html',
  styleUrls: ['./comp-filtri.component.css']
})

export class CompFiltriComponent implements OnInit { 
  private filtri: FiltriRichieste;
  //private filtriTutti: FiltriRichieste[];
  private errorMessage: string; 
 
  @Input() filtro: FiltriRichieste;

  @Output() nuovoIntervento = new EventEmitter();
  /*@Output() nuovoFiltro: EventEmitter<FiltriRichieste> = new EventEmitter();*/

  constructor(private filtriRichiesteService: CompFiltriService) {
    /*this.filtri = new FiltriRichieste(true, true, true, false, true, false, true, true,'');*/
    }

  ngOnInit() {
    this.getFiltri();
   }
   /**
   * Questo metodo viene invocato sul click di una casella di filtraggio disponibile.
   */
  
   /**
   * Questo metodo esegue la subscription all'observable del servizio di accesso
   * allo stato dei filtri. In occasione di una nuova pubblicazione, viene assegnato il
   * vettore this.tuttiIFiltri.
   */
  private getFiltri() {
    this.filtriRichiesteService.getFiltri()
      .subscribe(
      filtri_richieste => {
        this.filtri= filtri_richieste;
       },
      error => this.errorMessage = <any>error
      )
  }


  private selFiltri(elemento_filtri : string) 
    {
    this.filtriRichiesteService.getFiltriSelezionati(elemento_filtri, this.filtri)
    }

  private clearSearchText()
  {
  this.filtri.chiaveDiRicerca = '';
  console.log("CHIAMATE:"+ ' ' + this.filtri.chiamate + "  INTERVENTI:"+ ' '+ this.filtri.interventi + "  APERTI:"+ ' '+ this.filtri.aperti + "  CHIUSI: "+ ' '+ this.filtri.chiusi + "  INTERNI:" + ' ' + this.filtri.interni + "  ESTERNI:"+ ' '+ this.filtri.esterni + "  PRESIDIATI:"+ ' '+ this.filtri.presidiati + "  NON PRESIDIATI:"+ ' '+ this.filtri.nonPresidiati + "  CHIAVE DI RICERCA:" + ' ' + this.filtri.chiaveDiRicerca);
  }
}


