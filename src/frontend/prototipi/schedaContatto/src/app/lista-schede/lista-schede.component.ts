import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchedaContatto } from "app/formschedacontatto/scheda-contatto.model";
import { ListaSchedeService } from "app/lista-schede/lista-schede.service";
import { ListaSchedeService_FakeJson } from "app/lista-schede/lista-schede-fake-json.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-lista-schede',
  templateUrl: './lista-schede.component.html',
  styleUrls: ['./lista-schede.component.css']
})

 
export class ListaSchedeComponent implements OnInit {

@Input() scheda: SchedaContatto;

@Output() showDetail: EventEmitter<SchedaContatto> = new EventEmitter();

  private tutteLeSchede: SchedaContatto[];
  private schedeFiltrate: SchedaContatto[];
  private errorMessage: string;

  constructor(private router: Router, private listaSchedeService_FakeJson: ListaSchedeService_FakeJson) { }

  ngOnInit() {
    this.getSchede();
  }

  
  private getSchede() {
    this.listaSchedeService_FakeJson.getSchede()
      .subscribe(
      schede => {
        this.tutteLeSchede = schede;
        this.schedeFiltrate = schede;
      },
      error => this.errorMessage = <any>error
      )
  }

  private visualizzaScheda(scheda: SchedaContatto) {
    //da cambiare
    //console.log(event.idScheda);
    this.router.navigate(['/scheda-contatto', scheda.idScheda]);
  }

}
