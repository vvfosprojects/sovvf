import { Component, OnInit, ElementRef, ViewChild, OnChanges, OnDestroy, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollEvent } from 'ngx-scroll-event';
import { Subscription } from 'rxjs';
import { FilterPipe } from 'ngx-filter-pipe';

// Model
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';

// Component
import { EventiRichiestaComponent } from '../../eventi/eventi-richiesta.component';

// Service
import { ListaRichiesteManagerService } from '../../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteService } from '../service/lista-richieste-service.service';
import { RicercaRichiesteService } from '../../filterbar/ricerca-richieste/ricerca-richieste-service/ricerca-richieste.service';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { PartenzaService } from '../../composizione-partenza/service/partenza/partenza.service';
import { LocalStorageService } from 'ngx-webstorage';

// Helper methods
import { HelperMethods } from '../helper/_helper-methods';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit, OnDestroy {
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
    richiesteTerminate: boolean;

    listHeightClass = 'm-h-750';

    methods = new HelperMethods;
    @Input() _split: boolean;

    constructor(public listaRichiesteManager: ListaRichiesteManagerService,
        private richiesteS: ListaRichiesteService,
        public ricercaS: RicercaRichiesteService,
        private modalService: NgbModal,
        private markerS: MarkerService,
        private filter: FilterPipe,
        private partenzaService: PartenzaService,
        private toastr: ToastrService,
        private localSt: LocalStorageService) {
    }

    ngOnInit() {
        // Restituisce le Richieste
        if (this.richieste.length <= 0) {
            this.getRichieste('0');
        } else {
            this.getRichieste(this.richieste.length);
            // TEST
            // console.log(this.richieste[this.richieste.length+1].id);
        }

        // Restituisce la stringa di ricerca
        this.subscription.add(
            this.ricercaS.getRicerca().subscribe(stringa => {
                this.opacizzaRichieste(stringa);
            })
        );
        // Restituisce la Richiesta Hover
        this.subscription.add(
            this.richiesteS.subjects.getRichiestaHover().subscribe(richiestaHover => {
                if (richiestaHover) {
                    this.richiestaHover = richiestaHover;
                } else {
                    this.richiestaHover = null;
                }
            })
        );
        // Restituisce la Richiesta Selezionata
        this.subscription.add(
            this.richiesteS.subjects.getRichiestaSelezionata().subscribe(richiestaSelezionata => {
                if (richiestaSelezionata) {
                    this.richiestaSelezionata = richiestaSelezionata;
                } else {
                    this.richiestaSelezionata = null;
                }
            })
        );
        // Restituisce la Richiesta Fissata in alto
        this.subscription.add(
            this.richiesteS.subjects.getRichiestaFissata().subscribe(richiestaFissata => {
                if (richiestaFissata) {
                    this.richiestaFissata = richiestaFissata;
                    this.listHeightClass = 'm-h-600 border-top';
                } else {
                    this.richiestaFissata = null;

                    /***
                     * aspetto che l'animazione della richiesta fissata finisca
                     * per aumentare l'altezza della lista
                     */

                    setTimeout(() => {
                        this.listHeightClass = 'm-h-750';
                    }, 300);
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.richieste = [];
        this.localSt.store('ListaRichiesteRequest', 1);
    }

    opacizzaRichieste(ricerca: any): void {
        const result = this.filter.transform(this.richieste, ricerca);
        if (!(this.richieste.length === result.length) && result.length > 0) {
            const string = [];
            result.forEach((c: any) => {
                string.push(c.id);
            });
            this.markerS.opacizzaMarkers(true, 'richieste', undefined, string);
        } else {
            this.markerS.opacizzaMarkers(false, 'richieste');
        }
    }

    getRichieste(idUltimaRichiesta: any) {
        this.subscription.add(
            this.listaRichiesteManager.getRichieste(idUltimaRichiesta).subscribe((richieste: any) => {
                if (richieste.length > 0) {
                    this.richieste = richieste;
                    this.loaderRichieste = false;
                    this.loaderNuoveRichieste = false;
                    this.contatoreNuoveRichieste = 0;
                    // TEST
                    // console.log('[ListaRichieste] Richieste Ricevute dal Manager', richieste.length);
                    // console.log('[ListaRichieste] Richieste in memoria:', this.richieste.length);
                } else if (richieste.length <= 0) {
                    this.loaderNuoveRichieste = false;
                    this.contatoreNuoveRichieste = 0;
                    this.toastr.warning('Non ci sono altre richieste da visualizzare', 'Richieste terminate', {
                        timeOut: 5000
                    });
                    // TEST
                    // console.log('[ListaRichieste] Richieste Terminate');
                }
            })
        );
        // TEST
        // console.log('[ListaRichieste]:', this.richieste);
    }

    /* Permette di visualizzare il loader e caricare nuove richieste */
    nuoveRichieste(event: ScrollEvent) {
        if (event.isReachingBottom && event.isWindowEvent === false && this.contatoreNuoveRichieste === 0) {
            this.contatoreNuoveRichieste++;
            this.loaderNuoveRichieste = true;
            this.richiesteTerminate = false;
            this.getRichieste(this.richieste.length);
            // TEST
            // console.log(this.richieste[this.richieste.length - 1].id);
        }
    }

    /* Gestisce il singolo click sulla richiesta */
    richiestaClick(richiesta: any) {
        if (richiesta !== this.richiestaSelezionata) {
            this.richiesteS.selezionata(richiesta.id);
            this.markerS.actionById(richiesta.id, 'click', false);
            // TEST
            // console.log('Click su', richiesta);
        } else {
            this.richiesteS.deselezionata();
            this.markerS.actionById(richiesta.id, 'click', true);
        }
    }

    /* Gestisce il double click sulla richiesta */
    richiestaDoubleClick(richiesta: any) {
        if (richiesta) {
            this.richiesteS.selezionata(richiesta.id);
            // TEST
            // console.log('Doppio click su', richiesta);
        }
    }

    /* Fissa in alto la richiesta */
    fissaInAlto(richiesta: any) {
        if (richiesta) {
            this.richiesteS.deselezionata();
            this.richiesteS.fissata(richiesta.id);
            this.markerS.actionById(richiesta.id, 'click');
        }
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any) {
        this.partenzaService.nuovaPartenza(richiesta);
        this.markerS.actionById(richiesta.id, 'click');
    }

    /* Gestisce l'hover in */
    richiestaHoverIn(richiesta: any) {
        if (richiesta) {
            this.richiesteS.hoverIn(richiesta.id);
            this.markerS.actionById(richiesta.id, 'hover-in');
        }
    }

    /* Gestisce l'hover out */
    richiestaHoverOut(richiesta: any) {
        if (richiesta) {
            this.richiesteS.hoverOut();
            this.markerS.actionById(richiesta.id, 'hover-out');
        }
    }

    /* Deseleziona e defissa la richiesta */
    unClick() {
        this.richiesteS.deselezionata();
        // this.richiesteS.defissata();
        this.markerS.actionById('a', 'unclick', true);
    }

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    visualizzaEventiRichiesta(richiesta: any) {
        this.modalService.open(EventiRichiestaComponent, { size: 'lg', centered: true });
    }

    /* Ritorna true se le parole matchano almeno in parte */
    match(word1: string, word2: string) {
        const word1San = word1.toLowerCase().substr(0, word1.length - 1);
        const word2San = word2.toLowerCase().substr(0, word2.length - 1);
        if (word1San === word2San) {
            return true;
        }
        return false;
    }

    /* NgClass List Height */
    HeightControl() {
        return this.listHeightClass;
    }

    /* NgClass Card Status */
    CardClasses(r: any) {
        return this.methods.CardClasses(r, this.richiestaSelezionata, this.richiestaHover);
    }
}
