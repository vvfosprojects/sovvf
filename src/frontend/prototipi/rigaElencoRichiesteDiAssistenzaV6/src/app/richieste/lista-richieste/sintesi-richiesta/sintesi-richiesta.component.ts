import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {SintesiRichiesta} from '../../../shared/model/sintesi-richiesta.model';
import {Observable} from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css']
})
export class SintesiRichiestaComponent implements OnInit {
    @Output() richiestaClick: EventEmitter<any> = new EventEmitter();
    @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();

    @Input() richiesta: SintesiRichiesta;
    espanso = false;
    time: any;
    observableTime = new Observable<number>((observer) => {
        setInterval(() => observer.next(
            (new Date(this.richiesta.istanteRicezioneRichiesta).getTime() - new Date().getTime()) * -1), 1000);
    });

    constructor() {
    }

    ngOnInit() {
        this.displayRealTime(this.observableTime);
    }

    /* Restituisce un Array con tanti elementi quanto è la priorità dell'intervento */
    vettorePallini() {
        return new Array(this.richiesta.priorita);
    }

    /* Restituisce un Array con tanti elementi quanti sono i buchini della priorità dell'intervento */
    vettoreBuchini() {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - this.richiesta.priorita);
    }

    /* Espande/Comprime il livello di dettaglio visualizzato per la richiesta */
    toggleEspanso(): void {
        this.espanso = !this.espanso;
    }

    /* Restituisce i nomi delle squadre  */
    nomiSquadre(): string[] {
        let nomiSquadre: string[];
        if (this.richiesta.partenze) {
            this.richiesta.partenze.forEach(partenza => {
                nomiSquadre = partenza.squadre.map(s => s.nome);
            });
        }
        return nomiSquadre;
    }

    /* Restituisce il numero delle squadre */
    numeroSquadre(): number {
        let numeroSquadre = 0;
        if (this.richiesta.partenze) {
            this.richiesta.partenze.forEach(partenza => {
                numeroSquadre = numeroSquadre + partenza.squadre.length;
            });
        }
        return numeroSquadre;
    }

    /* Restituisce i nomi dei mezzi  */
    nomiMezzi(): string[] {
        let nomiMezzi = [];
        if (this.richiesta.partenze) {
            this.richiesta.partenze.forEach(partenza => {
                nomiMezzi = partenza.mezzi.map(s => s.descrizione);
            });
        }
        return nomiMezzi;
    }

    /* Restituisce il numero dei mezzi */
    numeroMezzi(): number {
        let numeroMezzi = 0;
        if (this.richiesta.partenze) {
            this.richiesta.partenze.forEach(partenza => {
                numeroMezzi = numeroMezzi + partenza.mezzi.length;
            });
        }
        return numeroMezzi;
    }

    /* Data una 'Date' permette di visualizzare il tempo passato fino a questo momento */
    private displayRealTime(observableTime) {
        // this.time = '';
        /* for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.time += ' . ';
            }, 200 * (i + 1));
        } */
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

    /* Permette di colorare l'icona della tipologia */
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

    richiestaCliccata() {
        this.richiestaClick.emit();
    }

    visualizzaEventiRichiesta(richiesta) {
        this.eventiRichiesta.emit(richiesta);
    }

    invioPartenza() {
        console.log('invio partenza');
    }
}


