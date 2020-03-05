import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventoRichiesta } from '../../../../../shared/model/evento-richiesta.model';

@Component({
  selector: '[app-evento-richiesta]',
  templateUrl: './evento-richiesta.component.html',
  styleUrls: ['./evento-richiesta.component.css']
})
export class EventoRichiestaComponent implements OnInit {

  espanso = false;
  iconeClasseEventoCorrente: any;
  iconeClassiEvento: any;
  myMap: any;

  @Input() eventoRichiesta: EventoRichiesta;
  @Input() istanteEventoPrecedente: Date;
  @Input() istantePrimoEvento: Date;
  @Input() nomeClasseEvento: string;
  @Input() visualizzaIconeNomeClasseEvento: boolean;

  @Output() mostraDettaglio: EventEmitter<EventoRichiesta> = new EventEmitter();
  @Output() filtroTarga: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.initIconeClassiEvento();
    this.myMap = new Map(this.iconeClassiEvento);
    this.iconeClasseEventoCorrente = this.myMap.get(this.nomeClasseEvento);
  }

  initIconeClassiEvento() {
    this.iconeClassiEvento = [
      ['Telefonata', ['fa-phone-square']],
      ['InizioPresaInCarico', ['fa-user', 'fa-wrench']],
      ['RiaperturaRichiesta', ['fa-refresh']],
      ['Composizione', ['fa-truck', 'fa-pencil-square-o']],
      ['ChiusuraRichiesta', ['fa-flag-checkered']],
      ['ArrivoSulPosto', ['fa-truck', 'fa-check-square-o']],
      ['Presidiata', ['fa-truck', 'fa-map-marker']],
      ['RichiestaSospesa', ['fa-stop']],
      ['MezzoRientrato', ['fa-truck', 'fa-hand-o-left']],
      ['MezzoInRientro', ['fa-truck', 'fa-handshake-o']],
      ['AssegnataRichiesta', ['fa-tty']],
      ['AssegnataPriorita', ['fa-thermometer-half']],
      ['MarcaRilevante', ['fa-warning', 'fa-check']],

      // Default per gli eventi non gestiti
      ['EventoGenerico', ['fa-question-circle']],

      // Per adesso non utilizzqti
      // ['AssegnazionePriorita', ['fa-sort-numeric-asc']],
      // ['MarcaNonRilevante', ['fa-warning', 'fa-close']],
      // ['InviareFonogramma', ['fa-fax']],
      // ['UscitaPartenza', ['fa-truck', 'fa-hand-o-right']],
      // ['RevocaPerRiassegnazione', ['fa-truck', 'fa-close', 'fa-share-square-o']],
      // ['RevocaPerInterventoNonPiuNecessario', ['fa-truck', 'fa-close', 'fa-flag-checkered']],
      // ['RevocaPerFuoriServizio', ['fa-truck', 'fa-close', 'fa-wrench']],
      // ['RevocaPerAltraMotivazione', ['fa-truck', 'fa-close', 'fa-question-circle-o']],
      // ['VaInFuoriServizio', ['fa-truck', 'fa-wrench']],
      // ['Sospesa', ['fa-question-circle']],
    ];
  }

  toggleEspanso(): void {
    this.espanso = !this.espanso;
  }

  clickDettaglio(event: any): void {
    console.log('EventoRichiestaComponent.clickDettaglio(): ', event, this.eventoRichiesta.id);
    this.mostraDettaglio.emit(this.eventoRichiesta);
    // alert("cliccato");
    event.preventDefault();
  }

  formatNomeClasseEvento(nomeClasseEvento: string): string {
    let formattedStringArray: string[];
    let formattedString = '' as string;
    formattedStringArray = nomeClasseEvento.split(/(?=[A-Z])/);
    formattedStringArray.forEach((x: string) => {
      formattedString = formattedString + ' ';
      formattedString = formattedString + x;
    });
    return formattedString;
  }
}
