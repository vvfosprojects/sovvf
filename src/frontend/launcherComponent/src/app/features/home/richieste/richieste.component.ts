import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from 'ngx-filter-pipe';
// Model
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
// Component
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
// Ngxs
import { Select, Store } from '@ngxs/store';
import { RicercaRichiesteState } from '../store/states/filterbar/ricerca-richieste.state';
import { ClearRichiestaFissata, SetRichiestaFissata } from '../store/actions/richieste/richiesta-fissata.actions';
import { RichiestaFissataState } from '../store/states/richieste/richiesta-fissata.state';
import { GetRichieste } from '../store/actions/richieste/richieste.actions';
import { ClearRichiestaHover, SetRichiestaHover } from '../store/actions/richieste/richiesta-hover.actions';
import { ClearRichiestaSelezionata, SetRichiestaSelezionata } from '../store/actions/richieste/richiesta-selezionata.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { RichiestaHoverState } from '../store/states/richieste/richiesta-hover.state';
import { AppFeatures } from '../../../shared/enum/app-features.enum';
import { SetIdRichiestaEventi } from '../store/actions/eventi/eventi-richiesta.actions';
import { ToggleComposizione } from '../store/actions/view/view.actions';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { RichiestaComposizione } from '../store/actions/composizione-partenza/richiesta-composizione.actions';
import { OpacizzaRichiesteMarkersById } from '../store/actions/maps/richieste-markers.actions';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() split: boolean;

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
    contatoreNuoveRichieste = true;
    richiesteTerminate: boolean;
    listHeightClass = 'm-h-750';

    AppFeatures = AppFeatures;
    subscription = new Subscription();

    constructor(private modalService: NgbModal,
                private filter: FilterPipe,
                private store: Store) {
        this.getRichieste();
    }

    ngOnInit(): void {
        this.getRichiestaFissata();
        this.getRichiestaHover();
        this.getRichiestaSelezionata();
        this.getRicerca();
        isDevMode() && console.log('Componente Richieste creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Richieste distrutto');
    }

    getRichieste() {
        this.subscription.add(
            this.richieste$.subscribe((richieste: any) => {
                if (richieste.length > 0) {
                    this.richieste = richieste;
                    setTimeout(() => {
                        this.loaderNuoveRichieste = false;
                    }, 500);
                    this.contatoreNuoveRichieste = false;
                    setTimeout(() => {
                        this.loaderRichieste = false;
                    }, 100);
                } else if (richieste.length <= 0) {
                    setTimeout(() => {
                        this.loaderNuoveRichieste = false;
                    }, 500);
                    this.contatoreNuoveRichieste = false;
                }
            })
        );
    }

    // Carica nuove richieste attraverso lo scroll
    onNuoveRichieste() {
        if (this.contatoreNuoveRichieste === false && !this.loaderRichieste) {
            this.contatoreNuoveRichieste = true;
            this.loaderNuoveRichieste = true;
            this.richiesteTerminate = false;
            this.store.dispatch(new GetRichieste(this.richieste[this.richieste.length - 1].codice.substr(3)));
            // TEST
            // console.log('onNewRichieste');
            // console.log(this.richieste[this.richieste.length - 1].id);
        }
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
            this.store.dispatch(new OpacizzaRichiesteMarkersById(string));
        } else {
            this.store.dispatch(new OpacizzaRichiesteMarkersById());
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

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    onVisualizzaEventiRichiesta(idRichiesta: string) {
        this.store.dispatch(new SetIdRichiestaEventi(idRichiesta));
        this.modalService.open(EventiRichiestaComponent, {windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true});
    }

    toggleComposizione() {
        this.store.dispatch(new ToggleComposizione(Composizione.Avanzata));
    }

    nuovaPartenza($event: SintesiRichiesta) {
        this.store.dispatch(new RichiestaComposizione($event));
    }
}
