import { Component, OnInit, Input } from '@angular/core';
import { SchedaContatto } from "app/formschedacontatto/scheda-contatto.model";

@Component({
  selector: 'app-sintesi-scheda',
  templateUrl: './sintesi-scheda.component.html',
  styleUrls: ['./sintesi-scheda.component.css']
})
export class SintesiSchedaComponent implements OnInit {

  @Input() scheda: SchedaContatto;

  //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
  //constructor(private schedaContattoService : SchedaContattoService) {  
  //}
  constructor() {  
  }

  ngOnInit() {
  }

    /* get fs(): SchedaContatto {
          //Modifica apportata da Marzotti per visualizzare la lista delle schede contatto - 13/07
          //return this.schedaContattoService.Get();
          return this.scheda;

    } */
 
   /**
   * restituisce un vettore con tanti elementi quanto è la priorità dell'intervento.
   * Utile per eseguire un ngFor con i pallini.
   */
  private vettorePallini() {
    return new Array(this.scheda.priorita);
  }

  /**
   * restituisce un vettore con tanti elementi quanti sono i buchini della priorità dell'intervento.
   * Utile per eseguire un ngFor con i buchini.
   */
  private vettoreBuchini() {
    const MAX_PRIORITA = 5;
    return new Array(MAX_PRIORITA - this.scheda.priorita);
  }
}
