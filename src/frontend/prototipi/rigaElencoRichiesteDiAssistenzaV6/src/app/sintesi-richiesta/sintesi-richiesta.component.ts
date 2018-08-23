import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {SintesiRichiesta} from '../model/sintesi-richiesta.model';
import {Observable} from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css']
})
export class SintesiRichiestaComponent implements OnInit {
    /**
     * Indica se la visualizzazione della richiesta si ferma al primo livello di dettaglio (false) oppure arriva al secondo (true)
     */
    espanso = false;
    time: any;

    @Input() richiesta: SintesiRichiesta;
    @Output() ShowDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();
    @Output() InvioPartenza: EventEmitter<SintesiRichiesta> = new EventEmitter();
    @Output() LocalizzazioneIntervento = new EventEmitter();

    observableTime = new Observable<number>((observer) => {
        setInterval(() => observer.next(
            (new Date(this.richiesta.istanteRicezioneRichiesta).getTime() - new Date().getTime()) * -1), 1000);
    });

    constructor() {
    }

    /*
      Calcola la dimensione del div "div1"
    */

    @ViewChild('div1') div1: ElementRef; // (1)
    ngOnInit() {
        // console.log(this.div1.nativeElement.clientWidth); (1)
        this.displayRealTime(this.observableTime);
    }

    /**
     * restituisce un vettore con tanti elementi quanto è la priorità dell'intervento.
     * Utile per eseguire un ngFor con i pallini.
     */
    vettorePallini() {
        return new Array(this.richiesta.prioritaRichiesta);
    }

    /**
     * restituisce un vettore con tanti elementi quanti sono i buchini della priorità dell'intervento.
     * Utile per eseguire un ngFor con i buchini.
     */
    vettoreBuchini() {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - this.richiesta.prioritaRichiesta);
    }

    /**
     * Espande/comprime il livello di dettaglio visualizzato per la richiesta
     */
    toggleEspanso(): void {

        this.espanso = !this.espanso;

    }

    /**
     * Restituisce il vettore con i nomi delle squadre
     */
    nomiSquadre(): string[] {
        return this.richiesta.squadre.map(s => s.nome);
    }

    /**
     * Restituisce il numero delle squadre
     */
    numeroSquadre(): number {
        return this.richiesta.squadre.length;
    }

    /**
     * Restituisce il vettore con il numero dei mezzi
     */
    numeroMezzi(): number {
        return this.richiesta.mezzi.length;
    }

    clickDettagli(): void {
        console.log('Sono il componente. Vogliono vedere i miei dettagli', this.richiesta.id);
        this.ShowDettagli.emit(this.richiesta);
    }

    invioPartenza(): void {
        console.log('Sono il componente. Voglio inviare la partenza per', this.richiesta.id);
        this.InvioPartenza.emit(this.richiesta);
    }

    localizzazioneIntervento(coordinate, bool?): void {
        // console.log('Sono il componente. Voglio localizzare l\'intervento in', indirizzo);
        const parametri = [coordinate[0], coordinate[1], bool];
        this.LocalizzazioneIntervento.emit(parametri);
    }

    private displayRealTime(observableTime) {
        this.time = '';
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.time += ' . ';
            }, 200 * (i + 1));
        }
        observableTime.subscribe(ms => {
            const setVal = 43200;
            const seconds = ms / 1000;

            if (seconds > 0 && seconds < setVal) {
                if (seconds < 5) {
                    this.time = 'Ora';
                }
                if (seconds >= 5 && seconds <= 30) {
                    const fiveSeconds = Math.floor(seconds) % 5;
                    if (fiveSeconds === 0) {
                        this.time = Math.floor(seconds) + ' secondi fa';
                    }
                }
                if (seconds > 30 && seconds < 60) {
                    const tenSeconds = Math.floor(seconds) % 10;
                    if (tenSeconds === 0) {
                        this.time = Math.floor(seconds) + ' secondi fa';
                    }
                }
                if (seconds >= 60 && seconds < 3600) {
                    let minutes;
                    if (seconds < 120) {
                        minutes = ' minuto fa';
                    } else {
                        minutes = ' minuti fa';
                    }
                    this.time = Math.floor(seconds / 60) + minutes;
                }
                if (seconds >= 3600 && seconds < setVal) {
                    let hours;
                    if (seconds < 7200) {
                        hours = ' ora fa';
                    } else {
                        hours = ' ore fa';
                    }
                    this.time = Math.floor(seconds / 3600) + hours;
                }
            } else {
                const today = moment(new Date()).day();
                const eventR = moment(this.richiesta.istanteRicezioneRichiesta).day();
                const timeR = moment(this.richiesta.istanteRicezioneRichiesta).format('HH:mm');
                const theFormatR = (navigator.language.substr(0, 2) === 'it') ? 'DD/MM/YY, HH:mm' : 'MM/DD/YY, HH:mm';
                const dateR = moment(this.richiesta.istanteRicezioneRichiesta).format(theFormatR);
                const parseToday = moment(today).isSame(eventR);
                const parseYesterday = moment(today - 1).isSame(eventR) ? 'Ieri alle ' + timeR : dateR;
                this.time = parseToday ? 'Oggi alle ' + timeR : parseYesterday;
            }
        });

    }

    coloraIcona(nome): any {
        const colori = [
            {
                icon: 'fa fa-fire',
                color: 'text-danger'
            },
            {
                icon: 'fa fa-exclamation-triangle',
                color: 'text-warning'
            },
            {
                icon: 'fa fa-medkit',
                color: 'text-primary'
            }
        ];

        const colore = colori.find(x => x.icon === nome);
        if (colore !== undefined) {
            return nome + ' ' + colore.color;
        } else {
            return nome + ' text-success';
        }
    }

}
