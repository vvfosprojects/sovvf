import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { SetIdRichiestaEventi, ClearEventiRichiesta, SetFiltroTargaMezzo } from '../store/actions/eventi-richiesta/eventi-richiesta.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { Observable, Subscription } from 'rxjs';
import { MezzoActionInterface } from 'src/app/shared/interface/mezzo-action.interface';
import { ActionMezzo, SetRichiestaById } from '../store/actions/richieste/richieste.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MezzoInServizio } from '../../../shared/interface/mezzo-in-servizio.interface';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { onlyUnique } from '../../../shared/helper/function-generiche';
import { StatoMezzo } from '../../../shared/enum/stato-mezzo.enum';
import {
    ClearFiltriMezziInServizio,
    ClearListaMezziInServizio,
    ClearMezzoInServizioHover,
    ClearMezzoInServizioSelezionato,
    GetListaMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato
} from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { RicercaFilterbarState } from '../store/states/filterbar/ricerca-filterbar.state';
import { ClearRicercaFilterbar } from '../store/actions/filterbar/ricerca-richieste.actions';
import { PaginationState } from '../../../shared/store/states/pagination/pagination.state';
import { LoadingState } from '../../../shared/store/states/loading/loading.state';
import { SintesiRichiestaModalComponent } from '../../../shared/modal/sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { VoceFiltro } from '../filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-mezzi-in-servizio',
    templateUrl: './mezzi-in-servizio.component.html',
    styleUrls: ['./mezzi-in-servizio.component.css']
})
export class MezziInServizioComponent implements OnInit, OnDestroy {

    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;

    @Select(RicercaFilterbarState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    totalItems: number;
    @Select(PaginationState.page) page$: Observable<number>;
    page: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    @Select(MezziInServizioState.mezziInServizioFiltered) mezziInServizio$: Observable<MezzoInServizio[]>;
    mezziInServizio: MezzoInServizio[];
    @Select(MezziInServizioState.filtriSelezionati) mezziInServizioFiltriSelezionati$: Observable<VoceFiltro[]>;
    mezziInServizioFiltriSelezionati: VoceFiltro[];
    @Select(MezziInServizioState.idMezzoInServizioHover) idMezzoInServizioHover$: Observable<string>;
    idMezzoInServizioHover: string;
    @Select(MezziInServizioState.idMezzoInServizioSelezionato) idMezzoInServizioSelezionato$: Observable<string>;
    idMezzoInServizioSelezionato: string;
    @Select(RichiesteState.loadingActionMezzo) loadingActionMezzo$: Observable<string>;
    @Select(MezziInServizioState.loadingMezziInServizio) loadingMezziInServizio$: Observable<boolean>;


    statiMezziInServizio: StatoMezzo[];

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal) {
        this.getRicerca();
        this.getPageSize();
        this.getTotalItems();
        this.getPage();
        this.getMezziInServizio();
        this.getMezzoInServizioHover();
        this.getMezzoInServizioSelezionato();
        this.getMezziInServizioFiltriSelezionati();
    }

    ngOnInit(): void {
        this.store.dispatch(new ClearRicercaFilterbar());
        console.log('Componente Mezzo in Servizio creato');
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.store.dispatch([
            new ClearListaMezziInServizio(),
            new ClearMezzoInServizioHover(),
            new ClearMezzoInServizioSelezionato(),
            new ClearFiltriMezziInServizio(true),
            new ClearRicercaFilterbar(),
        ]);
        console.log('Componente Mezzo in Servizio distrutto');
    }

    getMezziInServizio(): void {
        this.store.dispatch(new GetListaMezziInServizio());
        this.subscriptions.add(
            this.mezziInServizio$.subscribe((mezzi: MezzoInServizio[]) => {
                this.mezziInServizio = mezzi;
                if (this.mezziInServizio?.length) {
                    this.statiMezziInServizio = this.mezziInServizio.map(data => data.mezzo.mezzo.stato).filter(onlyUnique);
                }
            })
        );
    }

    getMezzoInServizioHover(): void {
        this.subscriptions.add(
            this.idMezzoInServizioHover$.subscribe((idMezzo: string) => {
                this.idMezzoInServizioHover = idMezzo;
            })
        );
    }

    getMezzoInServizioSelezionato(): void {
        this.subscriptions.add(
            this.idMezzoInServizioSelezionato$.subscribe((idMezzo: string) => {
                this.idMezzoInServizioSelezionato = idMezzo;
            })
        );
    }

    getMezziInServizioFiltriSelezionati(): void {
        this.subscriptions.add(
            this.mezziInServizioFiltriSelezionati$.subscribe((filtriSelezionati: VoceFiltro[]) => {
                this.mezziInServizioFiltriSelezionati = filtriSelezionati;
            })
        );
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetListaMezziInServizio(page));
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                this.pageSize = pageSize;
            })
        );
    }

    getTotalItems(): void {
        this.subscriptions.add(
            this.totalItems$.subscribe((totalItems: number) => {
                this.totalItems = totalItems;
            })
        );
    }

    getPage(): void {
        this.subscriptions.add(
            this.page$.subscribe((page: number) => {
                this.page = page;
            })
        );
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetListaMezziInServizio());
                }
            })
        );
    }

    onActionMezzo(mezzoInServizio: Mezzo, mezzoAction: MezzoActionInterface): void {
        mezzoAction.codRichiesta = mezzoInServizio.idRichiesta;
        mezzoAction.listaMezzi = true;
        this.store.dispatch(new ActionMezzo(mezzoAction));
    }

    /* Apre il modal per visualizzare la richiesta */
    onDettaglioRichiesta(idRichiesta: string): void {
        this.store.dispatch(new SetRichiestaById(idRichiesta));
        this.modalService.open(SintesiRichiestaModalComponent, {
            windowClass: 'xxlModal modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
    }

    /* Apre il modal per visualizzare gli eventi-richiesta-richiesta relativi alla richiesta cliccata */
    onVisualizzaEventiRichiesta(mezzo: Mezzo): void {
        this.store.dispatch(new SetFiltroTargaMezzo([mezzo.descrizione]));
        this.store.dispatch(new SetIdRichiestaEventi(mezzo.idRichiesta));
        let modal;
        modal = this.modalService.open(EventiRichiestaComponent, {
            windowClass: 'xlModal modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            backdrop: true
        });
        modal.result.then(() => {
        }, () => this.store.dispatch(new ClearEventiRichiesta()));
    }

    hoverIn(idMezzoInServizio: string): void {
        this.store.dispatch(new SetMezzoInServizioHover(idMezzoInServizio));
    }

    hoverOut(): void {
        this.store.dispatch(new ClearMezzoInServizioHover());
    }

    selezionato(idMezzoInServizio: string): void {
        const mezzoInServizio = this.mezziInServizio.filter((m: MezzoInServizio) => m.mezzo.mezzo.codice === idMezzoInServizio)[0];
        if (mezzoInServizio.mezzo.mezzo.coordinateStrg?.length > 1) {
            this.store.dispatch(new SetMezzoInServizioSelezionato(idMezzoInServizio));
        }
    }

    heightListaMezzi(): string {
        if (this.boxAttivi) {
            return 'm-h-710';
        }
        return 'm-h-840';
    }
}

