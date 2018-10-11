import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {SintesiRichiesta} from '../../shared/model/sintesi-richiesta.model';
import {ListaRichiesteManagerService} from '../lista-richieste-service/lista-richieste-manager/lista-richieste-manager.service';
import {ScrollEvent} from 'ngx-scroll-event';
import {ListaRichiesteService} from '../lista-richieste-service/lista-richieste-service.service';
import {RicercaRichiesteService} from '../ricerca-richieste/ricerca-richieste-service/ricerca-richieste.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
    richieste: SintesiRichiesta[] = [];
    richiestaHover: SintesiRichiesta;
    richiestaSelezionata: SintesiRichiesta;
    richiestaFissata: SintesiRichiesta;
    richiestaSelezionataState: string; // Animazione

    constructor(private listaRichiesteManager: ListaRichiesteManagerService,
                private richiesteS: ListaRichiesteService,
                public ricercaS: RicercaRichiesteService,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        // Restituisce le Richieste
        this.listaRichiesteManager.getData().subscribe(richieste => {
            this.richieste = richieste;
        });
        // Restituisce la Richiesta Hover
        this.richiesteS.getRichiestaHover().subscribe(richiestaHover => {
            if (richiestaHover) {
                this.richiestaHover = richiestaHover;
            } else {
                this.richiestaHover = null;
            }
        });
        // Restituisce la Richiesta Selezionata
        this.richiesteS.getRichiestaSelezionata().subscribe(richiestaSelezionata => {
            if (richiestaSelezionata) {
                this.richiestaSelezionata = richiestaSelezionata;
            } else {
                this.richiestaSelezionata = null;
            }
        });
        // Restituisce la Richiesta Fissata in alto
        this.richiesteS.getRichiestaFissata().subscribe(richiestaFissata => {
            if (richiestaFissata) {
                this.richiestaFissata = richiestaFissata;
            } else {
                this.richiestaFissata = null;
            }
        });
    }

    handleScroll(event: ScrollEvent) {
        if (event.isReachingBottom && event.isWindowEvent === false) {
            this.listaRichiesteManager.nuoveRichieste().subscribe(nuoveRichieste => {
                nuoveRichieste.forEach(r => {
                    this.richieste.push(r);
                });
            });
        }
    }

    richiestaClick(richiesta) {
        // console.log('Richiesta cliccata');
    }

    richiestaHoverIn(richiesta) {
        console.log('Richiesta Over In');
    }

    richiestaHoverOut() {
        console.log('Richiesta Over Out');
    }

    unClick() {
        console.log('Richiesta Deselezionata');
    }

    visualizzaEventiRichiesta(richiesta) {
        console.log(richiesta);
        this.modalService.open('Eventi della Richiesta');
    }
}
