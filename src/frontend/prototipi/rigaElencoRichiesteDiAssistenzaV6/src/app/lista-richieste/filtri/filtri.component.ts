import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {SintesiRichiesta} from '../../shared/model/sintesi-richiesta.model';
import {VoceFiltro} from './filtro/voce-filtro.model';

@Component({
    selector: 'app-filtri',
    templateUrl: './filtri.component.html',
    styleUrls: ['./filtri.component.scss']
})
export class FiltriComponent implements OnInit {

    @Input() richieste: SintesiRichiesta[];
    @Output() richiesteFiltrateEvent: EventEmitter<SintesiRichiesta[]> = new EventEmitter();

    @ViewChild('divFiltri') divFiltri: ElementRef;
    filtriAttivi = 0;
    filtriTotali = 0;
    richiesteFiltrate: SintesiRichiesta[];
    vociFiltro: VoceFiltro[]; //Da popolare con tutti i filtri

    vociFiltroPresidiato: VoceFiltro[] = [
        new VoceFiltro(
            true, 'Presidiato', 0
        ),
        new VoceFiltro(
            false, 'Non presidiato', 0
        ),
    ];
    titoloPresidiato = 'Presidio VVF';
    filtriPresidiato: boolean[] = [];

    vociFiltroTipologia: VoceFiltro[];
    titoloTipologia = 'Tipologia';
    filtriTipologia: string[] = [];

    vociFiltroRilevante: VoceFiltro[] = [
        new VoceFiltro(
            true, 'Rilevante', 0
        ),
        new VoceFiltro(
            false, 'Non rilevante', 0
        ),
    ];
    titoloRilevante = 'Rilevanza';
    filtriRilevante: boolean[] = [];

    constructor() {
    }

    ngOnInit() {
        // console.log('Richieste: ', this.richieste);
        this.richiesteFiltrate = this.richieste;
        this.inizializzaFiltri();
    }

    ngOnChanges(changes: any) {
        this.richiesteFiltrate = this.richieste;
        this.inizializzaFiltri();
    }

    inizializzaFiltri() {
        // creazione voci filtro tipologie
        const tipologie = this.richieste.reduce((a, t) => {
            a[t.tipologie[0].descrizione] = a[t.tipologie[0].descrizione] || 0;
            a[t.tipologie[0].descrizione]++;

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

    applicaNuovaSelezione(elimina?) {
        this.richiesteFiltrate = this.richieste;
        if (this.filtriPresidiato.length > 0) {
            this.richiesteFiltrate = this.richiesteFiltrate.filter(
                r => this.filtriPresidiato.some(
                    filtro => filtro === r.presidiato));
        }

        if (this.filtriTipologia.length > 0) {
            this.richiesteFiltrate = this.richiesteFiltrate.filter(
                r => this.filtriTipologia.some(
                    filtro => filtro === r.tipologie[0].descrizione));
        }

        if (this.filtriRilevante.length > 0) {
            this.richiesteFiltrate = this.richiesteFiltrate.filter(
                r => this.filtriRilevante.some(
                    filtro => filtro === r.rilevante));
        }

        this.filtriAttivi = this.filtriPresidiato.length + this.filtriRilevante.length + this.filtriTipologia.length;
        this.filtriTotali = this.vociFiltroPresidiato.length + this.vociFiltroRilevante.length + this.vociFiltroTipologia.length;
        
        if(this.filtriAttivi === this.filtriTotali){
            this.eliminaFiltri();
        }

        this.richiesteFiltrateEvent.emit(this.richiesteFiltrate);
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

    eliminaFiltri() {
        this.richiesteFiltrate = this.richieste;
        this.richiesteFiltrateEvent.emit(this.richiesteFiltrate);
        this.vociFiltroPresidiato.forEach(vf => vf.selezionato = false);
        this.vociFiltroRilevante.forEach(vf => vf.selezionato = false);
        this.vociFiltroTipologia.forEach(vf => vf.selezionato = false);

        this.filtriPresidiato.length = 0;
        this.filtriRilevante.length = 0;
        this.filtriTipologia.length = 0;
        this.filtriAttivi = 0;
    }

}
