import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EventoRichiesta } from '../evento-richiesta/evento-richiesta.model';

@Component({
  selector: 'app-lista-eventi-richiesta',
  templateUrl: './lista-eventi-richiesta.component.html',
  styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent implements OnInit {
  @Input() elencoEventi : EventoRichiesta[];
  
  private istanteEventoPrecedente: Date;
  private istantePrimoEvento: Date;
  
  constructor() { }

  ngOnInit() {
    if (this.istantePrimoEvento == null) { 
      this.setIstantePrimoEvento(this.elencoEventi[0].dataEvento);      
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
        
        if ( propName == "dataEvento") {
          console.log("ngOnChanges Felix dataEvento");
          this.setIstanteEventoPrecedente(new Date(curVal));
          }
        
      }
 }

  
  private setIstanteEventoPrecedente(p: Date) : void {
    this.istanteEventoPrecedente = p;
  }

  private setIstantePrimoEvento(p: Date) : void {
    this.istantePrimoEvento = p;
  }

}
11