import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SintesiRichiesta } from "app/sintesi-richiesta/sintesi-richiesta.model";
import { VoceFiltro } from "app/filtro/voce-filtro.model";

@Component({
  selector: 'lista-richieste',
  templateUrl: './lista-richieste.component.html',
  styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
  @Input() richieste: SintesiRichiesta[];
  @Output() showDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();

  richiesteFiltrate: SintesiRichiesta[];

  vociFiltroPresidiato: VoceFiltro[] = [
    new VoceFiltro(
      true, "Presidiato", 0
    ),
    new VoceFiltro(
      false, "Non presidiato", 0
    ),
  ];
  titoloPresidiato = "Presidio VVF";
  filtriPresidiato: boolean[] = [];

  vociFiltroTipologia: VoceFiltro[];
  titoloTipologia = "Tipologia";
  filtriTipologia: string[] = [];

  vociFiltroRilevante: VoceFiltro[] = [
    new VoceFiltro(
      true, "Rilevante", 0
    ),
    new VoceFiltro(
      false, "Non rilevante", 0
    ),
  ];
  titoloRilevante = "Rilevanza";
  filtriRilevante: boolean[] = [];

  constructor() {
  }

  ngOnInit() {
    this.richiesteFiltrate = this.richieste;

    this.inizializzaFiltri();
  }

  inizializzaFiltri() {
    // creazione voci filtro tipologie
    var tipologie = this.richieste.reduce((a, t) => {
      a[t.tipologie[0]] = a[t.tipologie[0]] || 0;
      a[t.tipologie[0]]++;

      return a;
    }, []);
    this.vociFiltroTipologia = Object.keys(tipologie).map(desc => new VoceFiltro(desc, desc, tipologie[desc]));

    // impostazione cardinalità voci filtro presidiato
    this.vociFiltroPresidiato.find(v => v.codice === true).cardinalita = this.richieste.filter(r => r.presidiato).length;
    this.vociFiltroPresidiato.find(v => v.codice === false).cardinalita = this.richieste.filter(r => !r.presidiato).length;

    // impostazione cardinalità voci filtro rilevante
    this.vociFiltroRilevante.find(v => v.codice === true).cardinalita = this.richieste.filter(r => r.rilevante).length;
    this.vociFiltroRilevante.find(v => v.codice === false).cardinalita = this.richieste.filter(r => !r.rilevante).length;
  }

  applicaNuovaSelezione() {
    this.richiesteFiltrate = this.richieste;

    if (this.filtriPresidiato.length > 0) {
      this.richiesteFiltrate = this.richiesteFiltrate.filter(r => this.filtriPresidiato.some(filtro => filtro === r.presidiato));
    }

    if (this.filtriTipologia.length > 0) {
      this.richiesteFiltrate = this.richiesteFiltrate.filter(r => this.filtriTipologia.some(filtro => filtro === r.tipologie[0]));
    }

    if (this.filtriRilevante.length > 0) {
      this.richiesteFiltrate = this.richiesteFiltrate.filter(r => this.filtriRilevante.some(filtro => filtro === r.rilevante));
    }
  }

  nuovaSelezionePresidiato(event) {
    this.filtriPresidiato = event;
    this.applicaNuovaSelezione();
  }

  nuovaSelezioneTipologia(event) {
    this.filtriTipologia = event;
    this.applicaNuovaSelezione();
  }

  nuovaSelezioneRilevante(event) {
    this.filtriRilevante = event;
    this.applicaNuovaSelezione();
  }
}
