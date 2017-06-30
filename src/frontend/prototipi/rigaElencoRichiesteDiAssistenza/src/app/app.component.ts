import { Component, OnInit } from '@angular/core';

import { SintesiRichiesta } from "app/sintesi-richiesta/sintesi-richiesta.model";
import { Squadra } from "app/sintesi-richiesta/squadra.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private richieste: SintesiRichiesta[];

  ngOnInit() {
    this.richieste = [
      new SintesiRichiesta(
        "0",
        "123.456.789",
        false,
        new Date(),
        new Date(),
        true,
        1,
        ["Incendio generico", "Soccorso a persona", "Incidente stradale"],
        "Incendio zona rotonda prima del centro abitato",
        "Carabinieri",
        "06 41 42 342",
        "Via Cavour, 5",
        ["TUS", "EUR", "OST"],
        "Vicino pompa di benzina",
        ["Sisma"],
        new Date(),
        "987654321",
        "DaInviare",
        "da inviare",
        133,
        "0",
        "alta",
        [
          new Squadra("1A", []),
          new Squadra("2A", []),
        ],
        [],
        ["pagamento"]
      ),
      new SintesiRichiesta(
        "0",
        "333.444.555",
        true,
        new Date(),
        null,
        false,
        3,
        ["Danni d'acqua", "Tipologia 2", "Tipologia 3", "Tipologia 4"],
        "Allagamento del secondo piano del condominio per rottura tubazione",
        "Mario Rossi",
        "06 41 42 342",
        "Via Cavour, 5",
        ["TUS", "EUR", "OST"],
        "Vicino pompa di benzina",
        ["Sisma"],
        new Date(),
        "987654321",
        "DaInviare",
        "da inviare",
        133,
        "0",
        "alta",
        [],
        [],
        ["pagamento"]
      )
    ];
  }

}
