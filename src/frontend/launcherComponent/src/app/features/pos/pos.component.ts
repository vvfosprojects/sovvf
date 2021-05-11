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
import { PosModalComponent } from '../../shared/modal/pos-modal/pos-modal.component';
import { AddPos, ClearFormPos } from '../../shared/store/actions/pos-modal/pos-modal.actions';
import { PosInterface } from '../../shared/interface/pos.interface';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

    @Select(PosState.pos) pos$: Observable<PosInterface[]>;
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
        let addPosModal;
        addPosModal = this.modalService.open(PosModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addPosModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.addPos();
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormPos());
                    console.log('Modal "addPos" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormPos());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    addPos(): void {
        this.store.dispatch(new AddPos());
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
