import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ToggleMezziInServizio } from '../store/actions/view/view.actions';
import { SetIdRichiestaEventi, ClearEventiRichiesta, SetFiltroTargaMezzo } from '../store/actions/eventi/eventi-richiesta.actions';
import { AllTrueBoxMezzi, AllTrueBoxMezziPresenti, UndoAllBoxes } from '../store/actions/boxes/box-click.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { Observable, Subscription } from 'rxjs';
import { MezzoActionInterface } from 'src/app/shared/interface/mezzo-action.interface';
import { ActionMezzo, GetListaRichieste, SetRichiestaById } from '../store/actions/richieste/richieste.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiestaModalComponent } from '../maps/maps-ui/info-window/sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { MezzoInServizio } from '../../../shared/interface/mezzo-in-servizio.interface';
import { Mezzo } from '../../../shared/model/mezzo.model';
import { onlyUnique } from '../../../shared/helper/function';
import { StatoMezzo } from '../../../shared/enum/stato-mezzo.enum';
import { BoxClickState, BoxClickStateModel } from '../store/states/boxes/box-click.state';
import {
    ClearFiltriMezziInServizio,
    ClearMezzoInServizioHover,
    GetListaMezziInServizio,
    SetMezzoInServizioHover,
    SetMezzoInServizioSelezionato
} from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { RicercaFilterbarState } from '../store/states/filterbar/ricerca-filterbar.state';
import { ClearRicercaFilterbar } from '../store/actions/filterbar/ricerca-richieste.actions';
import { PaginationState } from '../../../shared/store/states/pagination/pagination.state';
import {ViewportState} from '../../../shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-mezzi-in-servizio',
    templateUrl: './mezzi-in-servizio.component.html',
    styleUrls: ['./mezzi-in-servizio.component.css']
})
export class MezziInServizioComponent implements OnInit, OnDestroy {

    @Input() boxAttivi: boolean;

    @Select(RicercaFilterbarState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    @Select(MezziInServizioState.mezziInServizioFiltered) mezziInServizio$: Observable<MezzoInServizio[]>;
    mezziInServizio: MezzoInServizio[];
    @Select(MezziInServizioState.idMezzoInServizioHover) idMezzoInServizioHover$: Observable<string>;
    idMezzoInServizioHover: string;
    @Select(MezziInServizioState.idMezzoInServizioSelezionato) idMezzoInServizioSelezionato$: Observable<string>;
    idMezzoInServizioSelezionato: string;
    @Select(RichiesteState.loadingActionMezzo) loadingActionMezzo$: Observable<string>;
    @Select(MezziInServizioState.loadingMezziInServizio) loadingMezziInServizio$: Observable<boolean>;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    statiMezziInServizio: StatoMezzo[];
    prevStateBoxClick: BoxClickStateModel;

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal) {
        this.getRicerca();
        this.getMezziInServizio();
        this.getMezzoInServizioHover();
        this.getMezzoInServizioSelezionato();
    }

    ngOnInit(): void {
        this.store.dispatch(new ClearRicercaFilterbar());
        this.subscriptions.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
        console.log('Componente Mezzo in Servizio creato');
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.store.dispatch([
            new GetListaRichieste(),
            new ClearFiltriMezziInServizio(true),
            new ClearRicercaFilterbar(),
            new UndoAllBoxes(this.prevStateBoxClick)
        ]);
        console.log('Componente Mezzo in Servizio distrutto');
    }

    getMezziInServizio(): void {
        this.prevStateBoxClick = this.store.selectSnapshot(BoxClickState);
        this.store.dispatch(new GetListaMezziInServizio());
        this.subscriptions.add(
            this.mezziInServizio$.subscribe((mezzi: MezzoInServizio[]) => {
                this.mezziInServizio = mezzi;
                if (this.mezziInServizio && this.mezziInServizio.length > 0) {
                    this.statiMezziInServizio = this.mezziInServizio.map(data => data.mezzo.mezzo.stato).filter(onlyUnique);
                    this.store.dispatch(new AllTrueBoxMezziPresenti(this.statiMezziInServizio));
                } else {
                    this.store.dispatch(new AllTrueBoxMezzi());
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

    onPageChange(page: number): void {
        this.store.dispatch(new GetListaMezziInServizio(page));
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
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

    onDettaglioRichiesta(idRichiesta: string): void {
        this.store.dispatch(new SetRichiestaById(idRichiesta));
        if (this.doubleMonitor) {
          this.modalService.open(SintesiRichiestaModalComponent, {
            windowClass: 'xlModal modal-left',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        } else {
          this.modalService.open(SintesiRichiestaModalComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        }
    }

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    onVisualizzaEventiRichiesta(mezzo: Mezzo): void {
        this.store.dispatch(new SetFiltroTargaMezzo([mezzo.descrizione]));
        this.store.dispatch(new SetIdRichiestaEventi(mezzo.idRichiesta));
        let modal;
        if (this.doubleMonitor) {
          modal = this.modalService.open(EventiRichiestaComponent, {
            windowClass: 'xlModal modal-left',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        } else {
          modal = this.modalService.open(EventiRichiestaComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        }
        modal.result.then(() => {
            },
            () => this.store.dispatch(new ClearEventiRichiesta()));
    }

    hoverIn(idMezzoInServizio: string): void {
        this.store.dispatch(new SetMezzoInServizioHover(idMezzoInServizio));
    }

    hoverOut(): void {
        this.store.dispatch(new ClearMezzoInServizioHover());
    }

    selezionato(idMezzoInServizio: string): void {
        this.store.dispatch(new SetMezzoInServizioSelezionato(idMezzoInServizio));
    }

    tornaIndietro(): void {
        this.store.dispatch(new ToggleMezziInServizio());
    }

}

