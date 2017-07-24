import { Component, OnInit } from '@angular/core';

import { SintesiRichiesta } from "app/sintesi-richiesta/sintesi-richiesta.model";
import { SintesiRichiesteService } from "app/sintesi-richieste-service/sintesi-richieste.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private richieste: SintesiRichiesta[];

  constructor(private sintesiRichiesteService: SintesiRichiesteService) {

  }

  ngOnInit() {
    this.sintesiRichiesteService.getSintesiRichieste()
      .subscribe(richieste => this.richieste = richieste);
  }

  showDettagliRicevuto(richiesta: SintesiRichiesta): void {
    console.log("Sono app.component. Vogliono vedere i dettagli di", richiesta.id);
  }

}
