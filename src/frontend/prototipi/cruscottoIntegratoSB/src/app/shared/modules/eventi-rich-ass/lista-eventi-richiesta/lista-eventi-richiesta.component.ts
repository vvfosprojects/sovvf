import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventoRichiesta } from '../evento-richiesta/evento-richiesta.model';
import * as moment from 'moment';

@Component({
  selector: 'app-lista-eventi-richiesta',
  templateUrl: './lista-eventi-richiesta.component.html',
  styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent implements OnInit {
  title = 'Eventi della Richiesta di assistenza';

  elencoEventiRichiesta : EventoRichiesta[] = [];

  @Input() elencoEventi : EventoRichiesta[];
  
  private istanteEventoPrecedente: Date;
  private istantePrimoEvento: Date;
  
  constructor() { }

  ngOnInit() {
    
    if (this.istantePrimoEvento == null) { 
      //this.setIstantePrimoEvento(this.elencoEventi[0].istanteEvento);      
      this.setIstantePrimoEvento(moment().toDate());      
    }    
  }


  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {  
        let change = changes[propName];


        let curVal  = JSON.stringify(change.currentValue);
        let prevVal = JSON.stringify(change.previousValue);


        console.log("ngOnChanges Felix");
        console.log(propName);
        console.log(curVal);
        console.log(prevVal);
        
        if ( propName == "istanteEvento") {
          console.log("ngOnChanges Felix istanteEvento");
          //this.setIstanteEventoPrecedente(new Date(curVal));
          }
        
      }
 }

/*
 private setIstanteEventoPrecedente(p: Date) : void {
  this.istanteEventoPrecedente = p;
}
*/
  private setIstanteEventoPrecedente(i: number) : Date {
    console.log("setIstanteEventoPrecedente");
    if (i > 0) {
      this.istanteEventoPrecedente = this.elencoEventi[i - 1].istanteEvento;
      console.log("ok");
      console.log(this.istanteEventoPrecedente);
    }
    else {  
      this.istanteEventoPrecedente = this.elencoEventi[0].istanteEvento; 
    }
    return this.istanteEventoPrecedente;
  }

  private setIstantePrimoEvento(p: Date) : void {
    this.istantePrimoEvento = p;
  }

}
