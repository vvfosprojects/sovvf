import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { RoutesPath } from 'src/app/shared/enum/routes-path.enum';
import { SetCurrentUrl } from 'src/app/shared/store/actions/app/app.actions';
import { SetSediNavbarVisible } from 'src/app/shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SetRicercaTrasferimentoChiamata, CleaRicercaTrasferimentoChiamata } from './store/actions/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.actions';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import { TrasferimentoChiamataState } from './store/states/trasferimento-chiamata/trasferimento-chiamata.state';
import { RicercaTrasferimentoChiamataState } from './store/states/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.state';
import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';
import { SetPageSize } from 'src/app/shared/store/actions/pagination/pagination.actions';
import { GetListaTrasferimentiChiamate } from './store/actions/trasferimento-chiamata/trasferimento-chiamata.actions';
import { ClearFormTrasferimentoChiamata } from 'src/app/shared/store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { TrasferimentoChiamataModalComponent } from 'src/app/shared/modal/trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { GetSediTrasferimenti } from '../../shared/store/actions/distaccamenti/distaccamenti.actions';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { DeleteConcorrenza } from '../../shared/store/actions/concorrenza/concorrenza.actions';
import { TipoConcorrenzaEnum } from '../../shared/enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-trasferimento-chiamata',
    templateUrl: './trasferimento-chiamata.component.html',
    styleUrls: ['./trasferimento-chiamata.component.css']
})
export class TrasferimentoChiamataComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(TrasferimentoChiamataState.listaTrasferimentiChiamate) listaTrasferimentiChiamate$: Observable<TrasferimentoChiamata[]>;
    listaTrasferimentiChiamate: TrasferimentoChiamata[];
    @Select(RicercaTrasferimentoChiamataState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(TrasferimentoChiamataState.loadingTrasferimentiChiamata) loading$: Observable<boolean>;
    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;


    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store, public modalService: NgbModal) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getDoubleMonitorMode();
        this.getRicerca();
        this.getPageSize();
        this.getTrasferimentoChiamata(true);
        this.getListaTrasferimentiChiamate();
        this.getSediTrasferimenti();
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.TrasferimentoChiamata),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new CleaRicercaTrasferimentoChiamata(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getDoubleMonitorMode(): void {
        this.subscriptions.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    getListaTrasferimentiChiamate(): void {
        this.subscriptions.add(
            this.listaTrasferimentiChiamate$.subscribe((listaTrasferimentiChiamate: TrasferimentoChiamata[]) => {
                this.listaTrasferimentiChiamate = listaTrasferimentiChiamate;
            })
        );
    }

    getSediTrasferimenti(): void {
        this.store.dispatch(new GetSediTrasferimenti());
    }

    onRicercaTrasferimentoChiamata(ricerca: string): void {
        this.store.dispatch(new SetRicercaTrasferimentoChiamata(ricerca));
    }

    getTrasferimentoChiamata(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetListaTrasferimentiChiamate(page));
    }

    onAddTrasferimentoChiamata(): void {
        let addTrasferimentoChiamataModal;
        addTrasferimentoChiamataModal = this.modalService.open(TrasferimentoChiamataModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addTrasferimentoChiamataModal.result.then((result: string) => {
                this.store.dispatch([
                    new DeleteConcorrenza(TipoConcorrenzaEnum.Trasferimento),
                    new ClearFormTrasferimentoChiamata()
                ]);
                console.log('Modal "addVoceTrasferimentoChiamata" chiusa con val ->', result);
            }, (err) => {
                this.store.dispatch([
                    new DeleteConcorrenza(TipoConcorrenzaEnum.Trasferimento),
                    new ClearFormTrasferimentoChiamata()
                ]);
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetListaTrasferimentiChiamate(page));
    }

    onPageSizeChange(pageSize: number): void {
        this.store.dispatch([
            new SetPageSize(pageSize),
            new GetListaTrasferimentiChiamate()
        ]);
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetListaTrasferimentiChiamate());
                }
            })
        );
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    this.pageSize = pageSize;
                }
            })
        );
    }
}
