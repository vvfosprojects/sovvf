import { Component, EventEmitter, Input, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FilterPipe } from 'ngx-filter-pipe';

// Model
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

// Service
import { ListaRichiesteService } from './service/lista-richieste-service.service';
import { ListaRichiesteManagerService } from 'src/app/core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ToastrService } from 'ngx-toastr';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';

// Ngxs
import { Select, Store } from '@ngxs/store';
import { RicercaRichiesteState } from '../filterbar/ricerca-richieste/store/states/ricerca-richieste.state';
import { SetRichiestaFissata, ClearRichiestaFissata } from './store/actions/richiesta-fissata.actions';
import { RichiestaFissataState } from './store/states/richiesta-fissata.state';
import { RichiesteState } from './store/states/richieste.state';
import { GetRichieste } from './store/actions/richieste.actions';
import { SetRichiestaHover, ClearRichiestaHover } from './store/actions/richiesta-hover.actions';
import { RichiestaHoverState } from './store/states/richiesta-hover.state';
import { SetRichiestaSelezionata, ClearRichiestaSelezionata } from './store/actions/richiesta-selezionata.actions';
import { RichiestaSelezionataState } from './store/states/richiesta-selezionata.state';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() split: string;

    @Output() statoPartenza = new EventEmitter<string>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();

    @Select(RicercaRichiesteState.ricerca) ricerca$: Observable<string>;
    ricerca: { descrizione: '' };

    @Select(RichiesteState.richieste) richieste$: Observable<SintesiRichiesta[]>;
    richieste: SintesiRichiesta[] = [];

    @Select(RichiestaFissataState.idRichiestaFissata) idRichiestaFissata$: Observable<string>;
    richiestaFissata: SintesiRichiesta;

    @Select(RichiestaHoverState.idRichiestaHover) idRichiestaHover$: Observable<string>;
    richiestaHover: SintesiRichiesta;

    @Select(RichiestaSelezionataState.idRichiestaSelezionata) idRichiestaSelezionata$: Observable<string>;
    richiestaSelezionata: SintesiRichiesta;

    loaderRichieste = true;
    loaderNuoveRichieste = false;
    contatoreNuoveRichieste = 0;
    richiesteTerminate: boolean;
    listHeightClass = 'm-h-750';

    subscription = new Subscription();

    constructor(public listaRichiesteService: ListaRichiesteService,
        public listaRichiesteManager: ListaRichiesteManagerService,
        private toastr: ToastrService,
        private markerService: MarkerService,
        private filter: FilterPipe,
        private store: Store) {
        this.getRichieste('0');
        this.getRichiestaFissata();
        this.getRichiestaHover();
        this.getRichiestaSelezionata();
        this.getRicerca();
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Richieste creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Richieste distrutto');
    }

    getRichieste(idUltimaRichiesta: string) {
        this.store.dispatch(new GetRichieste(idUltimaRichiesta));
        this.subscription.add(
            this.richieste$.subscribe((richieste: any) => {
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
    }

    // Carica nuove richieste attraverso lo scroll
    nuoveRichieste() {
        /*
            if (event.isReachingBottom && event.isWindowEvent === false && this.contatoreNuoveRichieste === 0) {
                this.contatoreNuoveRichieste++;
                this.loaderNuoveRichieste = true;
                this.richiesteTerminate = false;
                this.getRichieste(idUltimaRichiesta);
                // TEST
                // console.log(this.richieste[this.richieste.length - 1].id);
            }
        */
    }

    // Restituisce la Richiesta Fissata
    getRichiestaFissata() {
        this.subscription.add(
            this.idRichiestaFissata$.subscribe((idRichiestaFissata: string) => {
                if (idRichiestaFissata) {
                    const richiestaFissataArray = this.richieste.filter(r => r.codice === idRichiestaFissata);
                    this.richiestaFissata = richiestaFissataArray[0];
                    this.listHeightClass = 'm-h-600';
                } else {
                    setTimeout(() => {
                        this.richiestaFissata = null;
                        this.listHeightClass = 'm-h-750';
                    }, 300);
                }
            })
        );
    }

    // Restituisce la Richiesta Hover
    getRichiestaHover() {
        this.subscription.add(
            this.idRichiestaHover$.subscribe((idRichiestaHover: string) => {
                if (idRichiestaHover) {
                    const richiestaHoverArray = this.richieste.filter(r => r.codice === idRichiestaHover);
                    this.richiestaHover = richiestaHoverArray[0];
                } else {
                    this.richiestaHover = null;
                }
            })
        );
    }

    // Restituisce la Richiesta Selezionata
    getRichiestaSelezionata() {
        this.subscription.add(
            this.idRichiestaSelezionata$.subscribe((idRichiestaSelezionata: string) => {
                if (idRichiestaSelezionata) {
                    const richiestaSelezionataArray = this.richieste.filter(r => r.codice === idRichiestaSelezionata);
                    this.richiestaSelezionata = richiestaSelezionataArray[0];
                } else {
                    this.richiestaSelezionata = null;
                }
            })
        );
    }

    getRicerca() {
        // Restituisce la stringa di ricerca
        this.subscription.add(
            this.ricerca$.subscribe((ricerca: any) => {
                this.ricerca = ricerca;
                this.opacizzaRichieste(ricerca);
            })
        );
    }

    opacizzaRichieste(ricerca: any): void {
        const result = this.filter.transform(this.richieste, ricerca);
        if (!(this.richieste.length === result.length) && result.length > 0) {
            const string = [];
            result.forEach((c: any) => {
                string.push(c.id);
            });
            this.markerService.opacizzaMarkers(true, 'richieste', undefined, string);
        } else {
            this.markerService.opacizzaMarkers(false, 'richieste');
        }
    }

    onHoverIn(idRichiesta: string) {
        this.store.dispatch(new SetRichiestaHover(idRichiesta));
    }

    onHoverOut() {
        this.store.dispatch(new ClearRichiestaHover());
    }

    onSelezione(idRichiesta: string) {
        this.store.dispatch(new SetRichiestaSelezionata(idRichiesta));
    }

    onDeselezione() {
        this.store.dispatch(new ClearRichiestaSelezionata());
    }

    onFissaInAlto(idRichiesta: string) {
        this.store.dispatch(new SetRichiestaFissata(idRichiesta));
    }

    onDefissa() {
        this.store.dispatch(new ClearRichiestaFissata());
    }
}
