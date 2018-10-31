import { Component, OnInit, ElementRef, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { ListaRichiesteManagerService } from '../../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ScrollEvent } from 'ngx-scroll-event';
import { ListaRichiesteService } from '../lista-richieste-service/lista-richieste-service.service';
import { RicercaRichiesteService } from '../ricerca-richieste/ricerca-richieste-service/ricerca-richieste.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { EventiRichiestaComponent } from '../../eventi/eventi-richiesta.component';
import { Subscription } from 'rxjs';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit, OnChanges, OnDestroy {
    subscription = new Subscription();

    richieste: SintesiRichiesta[] = [];
    richiestaHover: SintesiRichiesta;
    richiestaSelezionata: SintesiRichiesta;
    richiestaFissata: SintesiRichiesta;
    loaderRichieste = true;
    loaderNuoveRichieste = false;

    preventSimpleClick: boolean;
    timer: any;
    contatoreNuoveRichieste = 0;

    constructor(private listaRichiesteManager: ListaRichiesteManagerService,
                private richiesteS: ListaRichiesteService,
                public ricercaS: RicercaRichiesteService,
                private modalService: NgbModal,
                private markerS: MarkerService,
                private filter: FilterPipe) {

        // Restituisce le Richieste
        this.subscription.add(
            this.listaRichiesteManager.getRichieste().subscribe(richieste => {
                // console.log('Sono listaRichieste, ho ricevuto le richieste');
                // console.log(richieste);
                this.richieste = richieste;
                this.loaderRichieste = false;
            })
        );
        this.subscription.add(this.ricercaS.getRicerca().subscribe(stringa => {
            this.opacizzaRichieste(stringa);
        }));
    }

    ngOnInit() {
        // Restituisce la Richiesta Hover
        this.richiesteS.subjects.getRichiestaHover().subscribe(richiestaHover => {
            if (richiestaHover) {
                this.richiestaHover = richiestaHover;
            } else {
                this.richiestaHover = null;
            }
        });
        // Restituisce la Richiesta Selezionata
        this.richiesteS.subjects.getRichiestaSelezionata().subscribe(richiestaSelezionata => {
            if (richiestaSelezionata) {
                this.richiestaSelezionata = richiestaSelezionata;
            } else {
                this.richiestaSelezionata = null;
            }
        });
        // Restituisce la Richiesta Fissata in alto
        this.richiesteS.subjects.getRichiestaFissata().subscribe(richiestaFissata => {
            if (richiestaFissata) {
                // Se esiste già una richiesta fissata riordino la lista
                if (this.richiestaFissata) {
                    this.ordinaRichieste();
                }
                this.richiestaFissata = richiestaFissata;
            } else {
                this.ordinaRichieste();
                this.richiestaFissata = null;
            }
        });
        // Ordina le richieste dalla piu recente
        this.ordinaRichieste();
    }

    ngOnChanges() {
        console.log('Change detected');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    opacizzaRichieste(ricerca) {
        const result = this.filter.transform(this.richieste, ricerca);
        result.forEach(
            r => {
                console.log(r.id);
                /**
                 * inizio implementazione issues #32
                 */
                // this.markerS.actionById(r.id, 'opacizza');
            }
        );
    }

    /* Ordina le richieste per data dalla piu recente */
    ordinaRichieste() {
        this.richieste.sort((a, b) => new Date(b.istanteRicezioneRichiesta).getTime() - new Date(a.istanteRicezioneRichiesta).getTime());
    }

    /* Permette di visualizzare il loader e caricare nuove richieste */
    nuoveRichieste(event: ScrollEvent) {
        if (event.isReachingBottom && event.isWindowEvent === false && this.contatoreNuoveRichieste === 0) {
            this.contatoreNuoveRichieste++;
            this.loaderNuoveRichieste = true;
            setTimeout(() => {
                this.listaRichiesteManager.getRichieste();
                this.loaderNuoveRichieste = false;
                this.contatoreNuoveRichieste = 0;
            }, 3000);
        }
    }

    /* Gestisce il singolo click sulla richiesta */
    richiestaClick(richiesta) {
        if (richiesta) {
            this.richiesteS.selezionata(richiesta.id);
            this.markerS.actionById(richiesta.id, 'click');
        }
    }

    /* Gestisce il double click sulla richiesta */
    richiestaDoubleClick(richiesta) {
        if (richiesta) {
            this.richiesteS.selezionata(richiesta.id);
            console.log('Doppio click su richiesta');
        }
    }

    /* Fissa in alto la richiesta */
    fissaInAlto(richiesta) {
        if (richiesta) {
            this.richiesteS.deselezionata();
            this.richiesteS.fissata(richiesta.id);
            this.markerS.actionById(richiesta.id, 'click');
        }
    }

    /* Gestisce l'hover in */
    richiestaHoverIn(richiesta) {
        if (richiesta) {
            this.richiesteS.hoverIn(richiesta.id);
            this.markerS.actionById(richiesta.id, 'hover-in');
        }
    }

    /* Gestisce l'hover out */
    richiestaHoverOut(richiesta) {
        if (richiesta) {
            this.richiesteS.hoverOut();
            this.markerS.actionById(richiesta.id, 'hover-out');
        }
    }

    /* Deseleziona e defissa la richiesta */
    /* Decidere quando fare l'unclick della richiesta */
    /* unClick() {
        this.richiesteS.deselezionata();
        this.richiesteS.defissata();
        this.markerS.action('a', 'unclick');
    } */

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    visualizzaEventiRichiesta(richiesta) {
        this.modalService.open(EventiRichiestaComponent, {size: 'lg'});
    }

    /* Ritorna true se le parole matchano almeno in parte */
    match(word1: string, word2: string) {
        const word1San = word1.toLowerCase().substr(0, word1.length - 1);
        const word2San = word2.toLowerCase().substr(0, word2.length - 1);
        if (word1San === word2San) {
            return true;
        }
    }

    /* NgClass Template */
    CardClasses(r) {
        if (r) {
            return {
                // Hover (stato)
                'card-shadow-info': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'assegnato'),
                'card-shadow-success': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'presidiato'),
                'card-shadow-danger': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'chiamata'),
                'card-shadow-warning': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'sospeso'),
                'card-shadow-secondary': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'chiuso'),
                'bg-light': r === this.richiestaSelezionata || r === this.richiestaHover,
            };
        }
    }

    /* NgClass status */
    CardSmClasses(r) {
        return {
            // Hover (stato)
            'card-shadow-info': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'assegnato'),
            'card-shadow-success': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'presidiato'),
            'card-shadow-danger': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'chiamata'),
            'card-shadow-warning': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'sospeso'),
            'card-shadow-secondary': (r === this.richiestaHover || r === this.richiestaSelezionata) && this.match(r.stato, 'chiuso'),
            'bg-light': r === this.richiestaSelezionata || r === this.richiestaHover,

            // Bordo sinistro (stato)
            'status_chiamata': this.match(r.stato, 'chiamata'),
            'status_presidiato': this.match(r.stato, 'presidiato'),
            'status_assegnato': this.match(r.stato, 'assegnato'),
            'status_sospeso': this.match(r.stato, 'sospeso'),
            'status_chiuso': this.match(r.stato, 'chiuso')
        };
    }
}
