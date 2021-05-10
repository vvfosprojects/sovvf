import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { RicercaPosState } from './store/states/ricerca-pos/ricerca-pos.state';
import { PosState } from './store/states/pos/pos.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { GetPos } from './store/actions/pos/pos.actions';
import { ClearRicercaPos, SetRicercaPos } from './store/actions/ricerca-pos/ricerca-pos.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

    @Select(PosState.pos) pos$: Observable<any[]>;
    @Select(PosState.loadingPos) loading$: Observable<boolean>;
    @Select(RicercaPosState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getRicerca();
        this.getPageSize();
        this.getPos(true);
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.POS),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaPos(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getPos(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetPos(page));
    }

    onAddPos(): void {
        console.log('onAddPos');
        // this.store.dispatch(new RequestAddEnte());
    }

    onRicercaPos(ricerca: string): void {
        this.store.dispatch(new SetRicercaPos(ricerca));
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetPos());
                }
            })
        );
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetPos());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }
}
