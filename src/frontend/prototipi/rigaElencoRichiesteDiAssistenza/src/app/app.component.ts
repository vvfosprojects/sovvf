import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { SintesiRichiesta } from "app/sintesi-richiesta/sintesi-richiesta.model";
import { Squadra } from "app/sintesi-richiesta/squadra.model";
import { Mezzo } from "./mezzo/mezzo.model";
import { Componente } from "./componente/componente.model";

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
        "R0",
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
        ["Tus", "Eur", "Ost"],
        "Vicino pompa di benzina",
        ["Sisma", "Esplosione"],
        moment().add(3, 'minutes').toDate(),
        "987654321",
        0,
        "Non necessario",
        10,
        2,
        "Bassa",
        [
          new Squadra("1A",
            null,
            [
              new Componente(
                "CR",
                "Mario Rossi",
                "Mario Rossi - MRORSS45H44T656R",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Antonio Bianchi",
                "Antonio Bianchi - NTNBNC76T54H444T",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Matteo Verdi",
                "Matteo Verdi - VRDMTT56G77D454I",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Enrico Ottavi",
                "Enrico Ottavi - NRCOTT88U75F454H",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Michele Rettore",
                "Michele Rettore - MCHRTT65T65K575Q",
                false,
                false,
                true),
            ]),
          new Squadra("2A",
            null,
            [
              new Componente(
                "CS",
                "Tiziana Rossetti",
                "Tiziana Rossetti - RSSTZN56T56R454E",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Marco Antonio Marchi Moschetti",
                "Marco Antonio Marchi Moschetti - MRCMRC66T66R454F",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Raffaele Cantoni",
                "Raffaele Cantoni - CNTRFL66T45R343E",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Giovanni Carta",
                "Giovanni Carta - VRTGVN56T74H565Y",
                false,
                false,
                false),
            ]),
        ],
        [
          new Mezzo(
            "COD1",
            "A1",
            "APS",
            1,
            "In viaggio",
            3,
            "Ottimo",
            0,
            "Non rilevato",
            4,
            "Alto",
            0,
            "Proprio",
            [
              new Componente(
                "CS",
                "Mario Rossi",
                "Mario Rossi - MRORSS45H44T656R",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Antonio Bianchi",
                "Antonio Bianchi - NTNBNC76T54H444T",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Matteo Verdi",
                "Matteo Verdi - VRDMTT56G77D454I",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Enrico Ottavi",
                "Enrico Ottavi - NRCOTT88U75F454H",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Michele Rettore",
                "Michele Rettore - MCHRTT65T65K575Q",
                false,
                false,
                true),
            ],
            [
              "Il mezzo deve rientrare per rifornimento",
              "Il mezzo ha la pressione di una ruota bassa",
            ]
          ),
          new Mezzo(
            "COD2",
            "AS1",
            "AS",
            2,
            "Sul posto",
            2,
            "Buono",
            4,
            "Alto",
            4,
            "Alto",
            1,
            "Altra sede",
            [
              new Componente(
                "CS",
                "Tiziana Rossetti",
                "Tiziana Rossetti - RSSTZN56T56R454E",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Marco Antonio Marchi Moschetti",
                "Marco Antonio Marchi Moschetti - MRCMRC66T66R454F",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Raffaele Cantoni",
                "Raffaele Cantoni - CNTRFL66T45R343E",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Giovanni Carta",
                "Giovanni Carta - VRTGVN56T74H565Y",
                false,
                false,
                false),
            ],
            [
              "Il mezzo deve rientrare per rifornimento",
              "Il mezzo ha la pressione di una ruota bassa",
            ]
          )
        ],
        ["pagamento"]
      ),
      new SintesiRichiesta(
        "R1",
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
        "Piazza dell'Indipendenza, 40",
        ["Eur", "Nom", "Fiu"],
        "Vicino pompa di benzina",
        ["Sisma"],
        moment().add(10, 'minutes').toDate(),
        "333444999",
        1,
        "Da inviare",
        133,
        0,
        "Alta",
        [],
        [],
        ["pagamento"]
      ),
      new SintesiRichiesta(
        "R2",
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
        ["Tus", "Eur", "Ost"],
        "Vicino pompa di benzina",
        ["Sisma", "Esplosione"],
        moment().add(3, 'minutes').toDate(),
        "987654321",
        0,
        "Non necessario",
        5,
        2,
        "Bassa",
        [
          new Squadra("1A",
            null,
            [
              new Componente(
                "CS",
                "Mario Rossi",
                "Mario Rossi - MRORSS45H44T656R",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Antonio Bianchi",
                "Antonio Bianchi - NTNBNC76T54H444T",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Matteo Verdi",
                "Matteo Verdi - VRDMTT56G77D454I",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Enrico Ottavi",
                "Enrico Ottavi - NRCOTT88U75F454H",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Michele Rettore",
                "Michele Rettore - MCHRTT65T65K575Q",
                false,
                false,
                true),
            ]),
          new Squadra("2A",
            null,
            [
              new Componente(
                "CS",
                "Tiziana Rossetti",
                "Tiziana Rossetti - RSSTZN56T56R454E",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Marco Antonio Marchi Moschetti",
                "Marco Antonio Marchi Moschetti - MRCMRC66T66R454F",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Raffaele Cantoni",
                "Raffaele Cantoni - CNTRFL66T45R343E",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Giovanni Carta",
                "Giovanni Carta - VRTGVN56T74H565Y",
                false,
                false,
                false),
            ]),
        ],
        [
          new Mezzo(
            "COD1",
            "A1",
            "APS",
            1,
            "In viaggio",
            1,
            "Mediocre",
            2,
            "Basso",
            2,
            "Basso",
            0,
            "Proprio",
            [
              new Componente(
                "CS",
                "Mario Rossi",
                "Mario Rossi - MRORSS45H44T656R",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Antonio Bianchi",
                "Antonio Bianchi - NTNBNC76T54H444T",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Matteo Verdi",
                "Matteo Verdi - VRDMTT56G77D454I",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Enrico Ottavi",
                "Enrico Ottavi - NRCOTT88U75F454H",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Michele Rettore",
                "Michele Rettore - MCHRTT65T65K575Q",
                false,
                false,
                true),
            ],
            [
              "Il mezzo deve rientrare per rifornimento",
              "Il mezzo ha la pressione di una ruota bassa",
            ]
          ),
          new Mezzo(
            "COD2",
            "AS1",
            "AS",
            2,
            "Sul posto",
            2,
            "Buono",
            4,
            "Alto",
            4,
            "Alto",
            1,
            "Altra sede",
            [
              new Componente(
                "CS",
                "Tiziana Rossetti",
                "Tiziana Rossetti - RSSTZN56T56R454E",
                true,
                false,
                false),
              new Componente(
                "VIG",
                "Marco Antonio Marchi Moschetti",
                "Marco Antonio Marchi Moschetti - MRCMRC66T66R454F",
                false,
                true,
                false),
              new Componente(
                "VIG",
                "Raffaele Cantoni",
                "Raffaele Cantoni - CNTRFL66T45R343E",
                false,
                false,
                false),
              new Componente(
                "VIG",
                "Giovanni Carta",
                "Giovanni Carta - VRTGVN56T74H565Y",
                false,
                false,
                false),
            ],
            [
              "Il mezzo deve rientrare per rifornimento",
              "Il mezzo ha la pressione di una ruota bassa",
            ]
          )
        ],
        ["pagamento"]
      ),
    ];
  }

  showDettagliRicevuto(richiesta: SintesiRichiesta): void {
    console.log("Sono app.component. Vogliono vedere i dettagli di", richiesta.id);
  }

}
