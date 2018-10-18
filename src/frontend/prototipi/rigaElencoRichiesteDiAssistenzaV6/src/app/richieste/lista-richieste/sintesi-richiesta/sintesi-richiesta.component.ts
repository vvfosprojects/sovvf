import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { LayoutMethods } from './_layout-methods';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import {NgbPopoverConfig, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css'],
    providers: [
        NgbPopoverConfig,
        NgbTooltipConfig
    ]
})
export class SintesiRichiestaComponent implements OnInit {
    @Output() fissaInAlto: EventEmitter<any> = new EventEmitter();
    @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();
    @Input() richiesta: SintesiRichiesta;

    observableTime = new Observable<number>((observer) => {
        setInterval(() => observer.next(
            (new Date(this.richiesta.istanteRicezioneRichiesta).getTime() - new Date().getTime()) * -1), 1000);
    });
    espanso = false;
    time: any;
    methods = new LayoutMethods;

    constructor(popoverConfig: NgbPopoverConfig, tooltipConfig: NgbTooltipConfig) {
        popoverConfig.container = 'body';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    ngOnInit() {
        this.displayRealTime(this.observableTime);
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

    /* Layout Methods */
    toggleEspanso(): void {
        this.espanso = !this.espanso;
    }
    vettorePallini() {
        return this.methods.vettorePallini(this.richiesta);
    }
    vettoreBuchini() {
        return this.methods.vettoreBuchini(this.richiesta);
    }
    nomiSquadre() {
        return this.methods.nomiSquadre(this.richiesta);
    }
    numeroSquadre() {
        return this.methods.numeroSquadre(this.richiesta);
    }
    nomiMezzi() {
        return this.methods.nomiMezzi(this.richiesta);
    }
    numeroMezzi() {
        return this.methods.numeroMezzi(this.richiesta);
    }
    coloraIcona(nome): any {
        return this.methods.coloraIcona(nome);
    }

    /* NgClass Methods */
    statusClass(richiesta) {
        return this.methods.statusClass(richiesta);
    }

    complessitaClass(richiesta) {
        return this.methods.complessitaClass(richiesta);
    }

    /* Eventi */
    fissaClick() {
        this.fissaInAlto.emit();
    }
    visualizzaEventiRichiesta(richiesta) {
        this.eventiRichiesta.emit(richiesta);
    }
    invioPartenza() {
        console.log('invio partenza');
    }
}


