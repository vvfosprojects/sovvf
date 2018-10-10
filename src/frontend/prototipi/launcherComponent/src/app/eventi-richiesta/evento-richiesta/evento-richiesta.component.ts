import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {EventoRichiesta} from './evento-richiesta.model';

@Component({
    selector: '[app-evento-richiesta]',
    templateUrl: './evento-richiesta.component.html',
    styleUrls: ['./evento-richiesta.component.css']
})
export class EventoRichiestaComponent implements OnInit {

    private espanso = false;
    private iconeClasseEventoCorrente: any;
    private iconeClassiEvento: any;
    private myMap: any;

    @Input() eventoRichiesta: EventoRichiesta;
    @Output() mostraDettaglio: EventEmitter<EventoRichiesta> = new EventEmitter();

    @Input() istanteEventoPrecedente: Date;
    @Input() istantePrimoEvento: Date;
    @Input() nomeClasseEvento;


    constructor() {
    }

    ngOnInit() {

        this.iconeClassiEvento = [
            ['Telefonata', ['fa-phone-square']]
            , ['AssegnazionePriorita', ['fa-sort-numeric-asc']]
            , ['MarcaRilevante', ['fa-warning', 'fa-check']]
            , ['MarcaNonRilevante', ['fa-warning', 'fa-close']]
            , ['RiaperturaRichiesta', ['fa-refresh']]
            , ['InizioPresaInCarico', ['fa-eye']]
            , ['ChiusuraRichiesta', ['fa-flag-checkered']]
            , ['InviareFonogramma', ['fa-fax']]
            , ['ComposizionePartenza', ['fa-truck', 'fa-pencil-square-o']]
            , ['UscitaPartenza', ['fa-truck', 'fa-hand-o-right']]
            , ['ArrivoSulPosto', ['fa-truck', 'fa-check-square-o']]
            , ['PartenzaInRientro', ['fa-truck', 'fa-handshake-o']]
            , ['PartenzaRientrata', ['fa-truck', 'fa-hand-o-left']]
            , ['RevocaPerRiassegnazione', ['fa-truck', 'fa-close', 'fa-share-square-o']]
            , ['RevocaPerInterventoNonPiuNecessario', ['fa-truck', 'fa-close', 'fa-flag-checkered']]
            , ['RevocaPerFuoriServizio', ['fa-truck', 'fa-close', 'fa-wrench']]
            , ['RevocaPerAltraMotivazione', ['fa-truck', 'fa-close', 'fa-question-circle-o']]
            , ['VaInFuoriServizio', ['fa-truck', 'fa-wrench']]
        ];

        this.myMap = new Map(this.iconeClassiEvento);

        this.iconeClasseEventoCorrente = this.myMap.get(this.nomeClasseEvento);

        console.log(this.iconeClasseEventoCorrente);
        // this.iconaClasseEventoCorrente = myMap.get("telefonata");
        // this.iconaClasseEventoCorrente = "fa-phone-square";
        /*
        console.log("Felix start");
        console.log(this.nomeClasseEvento);
        console.log(Array.from(this.myMap));
        console.log(this.myMap.get(this.nomeClasseEvento));
        console.log(this.myMap.get("telefonata"));
        console.log(this.iconaClasseEventoCorrente);
        */


    }

    /**
     * Espande/comprime il livello di dettaglio visualizzato per l'evento
     */

    private toggleEspanso(): void {
        this.espanso = !this.espanso;
    }

    private clickDettaglio(event): void {
        console.log('EventoRichiestaComponent.clickDettaglio(): ', event, this.eventoRichiesta.id);
        this.mostraDettaglio.emit(this.eventoRichiesta);
        // alert("cliccato");
        event.preventDefault();
    }


}
