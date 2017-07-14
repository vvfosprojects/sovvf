import { Component, OnInit } from '@angular/core';
import { SchedaContatto } from "app/formschedacontatto/scheda-contatto.model";
import { ListaSchedeService } from "app/lista-schede/lista-schede.service";
import { ListaSchedeService_FakeJson } from "app/lista-schede/lista-schede-fake-json.service";

@Component({
  selector: 'app-lista-schede',
  templateUrl: './lista-schede.component.html',
  styleUrls: ['./lista-schede.component.css']
})

export class ListaSchedeComponent implements OnInit {

  private tutteLeSchede: SchedaContatto[];
  private schedeFiltrate: SchedaContatto[];
  private errorMessage: string;

  constructor(private ListaSchedeService_FakeJson: ListaSchedeService) { }

  ngOnInit() {
    this.getSchede();
  }

  
  private getSchede() {
    this.ListaSchedeService_FakeJson.getSchede()
      .subscribe(
      schede => {
        this.tutteLeSchede = schede;
        this.schedeFiltrate = schede;
      },
      error => this.errorMessage = <any>error
      )
  }

  

}
