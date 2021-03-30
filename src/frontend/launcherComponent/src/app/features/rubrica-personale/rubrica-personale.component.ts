import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { RubricaPersonaleState } from './store/states/rubrica-personale/rubrica-personale.state';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import {
    ClearRicercaRubricaPersonale,
    ClearStatoRubricaPersonale,
    SetRicercaRubricaPersonale,
    SetStatoRubricaPersonale
} from './store/actions/ricerca-rubrica-personale/ricerca-rubrica-personale.actions';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { GetRubricaPersonale } from './store/actions/rubrica-personale/rubrica-personale.actions';
import { RicercaRubricaPersonaleState } from './store/states/ricerca-rubrica-personale/ricerca-rubrica-personale.state';
import { RubricaPersonale } from '../../shared/interface/rubrica-personale.interface';

@Component({
    selector: 'app-rubrica-personale',
    templateUrl: './rubrica-personale.component.html',
    styleUrls: ['./rubrica-personale.component.css']
})
export class RubricaPersonaleComponent implements OnInit, OnDestroy {

    @Select(RubricaPersonaleState.vociRubricaPersonale) vociRubricaPersonale$: Observable<RubricaPersonale[]>;
    @Select(RicercaRubricaPersonaleState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    private subscriptions: Subscription = new Subscription();
    RoutesPath = RoutesPath;
    filtriPersonale = ['Solo Operativi', 'In servizio', 'Altro personale', 'Non in servizio'];

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getRicerca();
        this.getPageSize();
        this.getRubricaPersonale(true);
    }


    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.RubricaPersonale),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaRubricaPersonale(),
            new SetSediNavbarVisible(),
        ]);
        this.subscriptions.unsubscribe();
    }

    getRubricaPersonale(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetRubricaPersonale(page));
    }

    onRicercaRubricaPersonale(ricerca: string): void {
        this.store.dispatch(new SetRicercaRubricaPersonale(ricerca));
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetRubricaPersonale(page));
    }

    onPageSizeChange(pageSize: number): void {
        this.store.dispatch(new SetPageSize(pageSize));
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetRubricaPersonale());
                }
            })
        );
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetRubricaPersonale());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }

    addFiltro(filtro: string[]): void {
        this.store.dispatch([
            new SetStatoRubricaPersonale(filtro),
            new GetRubricaPersonale()
        ]);
    }

    clearFiltro(): void {
        this.store.dispatch(new ClearStatoRubricaPersonale());
    }
}
