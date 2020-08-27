import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { RoutesPath } from 'src/app/shared/enum/routes-path.enum';
import { SetCurrentUrl } from 'src/app/shared/store/actions/app/app.actions';
import { SetSediNavbarVisible } from 'src/app/shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SetRicercaTrasferimentoChiamata, CleaRicercaTrasferimentoChiamata } from './store/actions/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.actions';
import { LoadingState } from 'src/app/shared/store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import { TrasferimentoChiamataState } from './store/states/trasferimento-chiamata/trasferimento-chiamata.state';
import { RicercaTrasferimentoChiamataState } from './store/states/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.state';
import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { SetPageSize } from 'src/app/shared/store/actions/pagination/pagination.actions';
import { GetListaTrasferimentiChiamate } from './store/actions/trasferimento-chiamata/trasferimento-chiamata.actions';
import { RequestAddTrasferimentoChiamata, ClearFormTrasferimentoChiamata } from 'src/app/shared/store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { TrasferimentoChiamataModalComponent } from 'src/app/shared/modal/trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-trasferimento-chiamata',
    templateUrl: './trasferimento-chiamata.component.html',
    styleUrls: ['./trasferimento-chiamata.component.css']
})
export class TrasferimentoChiamataComponent implements OnInit, OnDestroy {

    @Select(TrasferimentoChiamataState.listaTrasferimentiChiamate) listaTrasferimentiChiamate$: Observable<TrasferimentoChiamata[]>;
    @Select(RicercaTrasferimentoChiamataState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    subscriptions: Subscription = new Subscription();

    constructor(private store: Store, public modalService: NgbModal) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getRicerca();
        this.getPageSize();
        this.getTrasferimentoChiamata(true);
    }


    ngOnInit() {
        this.store.dispatch([new SetCurrentUrl(RoutesPath.TrasferimentoChiamata), new SetSediNavbarVisible(false)]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new CleaRicercaTrasferimentoChiamata(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }


    onRicercaTrasferimentoChiamata(ricerca: string) {
        this.store.dispatch(new SetRicercaTrasferimentoChiamata(ricerca));
    }

    getTrasferimentoChiamata(pageAttuale: boolean) {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetListaTrasferimentiChiamate(page));
    }

    onAddTrasferimentoChiamata() {
        const addTrasferimentoChiamataModal = this.modalService.open(TrasferimentoChiamataModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addTrasferimentoChiamataModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.addTrasferimentoChiamata();
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormTrasferimentoChiamata());
                    console.log('Modal "addVoceTrasferimentoChiamata" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormTrasferimentoChiamata());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    addTrasferimentoChiamata() {
        this.store.dispatch(new RequestAddTrasferimentoChiamata());
    }

    onPageChange(page: number) {
        this.store.dispatch(new GetListaTrasferimentiChiamate(page));
    }

    onPageSizeChange(pageSize: number) {
        this.store.dispatch(new SetPageSize(pageSize));
    }

    getRicerca() {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetListaTrasferimentiChiamate());
                }
            })
        );
    }

    getPageSize() {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetListaTrasferimentiChiamate());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }
}
