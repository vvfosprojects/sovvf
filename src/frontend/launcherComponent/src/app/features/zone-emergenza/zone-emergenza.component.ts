import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { TipologiaEmergenza, ZonaEmergenza } from '../../shared/model/zona-emergenza.model';
import { ZoneEmergenzaState } from './store/states/zone-emergenza/zone-emergenza.state';
import { AnnullaZonaEmergenza, EditZonaEmergenza, GetTipologieEmergenza, GetZoneEmergenza, ResetAnnullaZonaEmergenzaForm, ResetZonaEmergenzaForm } from './store/actions/zone-emergenza/zone-emergenza.actions';
import { SetZonaEmergenzaFromMappaActiveValue } from './store/actions/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.actions';
import { TastoZonaEmergenzaMappaState } from './store/states/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.state';
import { ZonaEmergenzaModalComponent } from '../../shared/modal/zona-emergenza-modal/zona-emergenza-modal.component';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { ConfirmModalComponent } from '../../shared/modal/confirm-modal/confirm-modal.component';
import { AnnullaZonaEmergenzaModalComponent } from '../../shared/modal/annulla-zona-emergenza-modal/annulla-zona-emergenza-modal.component';

@Component({
    selector: 'app-zone-emergenza',
    templateUrl: './zone-emergenza.component.html',
    styleUrls: ['./zone-emergenza.component.scss']
})
export class ZoneEmergenzaComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;
    @Select(ZoneEmergenzaState.zoneEmergenza) zoneEmergenza$: Observable<ZonaEmergenza[]>;
    @Select(ZoneEmergenzaState.loadingZoneEmergenza) loading$: Observable<boolean>;
    @Select(ZoneEmergenzaState.tipologieZonaEmergenza) tipologieZonaEmergenza$: Observable<TipologiaEmergenza[]>;
    @Select(ZoneEmergenzaState.loadingTipologieEmergenza) loadingTipologieEmergenza$: Observable<boolean>;
    @Select(TastoZonaEmergenzaMappaState.tastoZonaEmergenzaMappaActive) tastoZonaEmergenzaMappaActive$: Observable<boolean>;
    tastoZonaEmergenzaMappaActive: boolean;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    mapActive: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getDoubleMonitorMode();
        this.getNightMode();
        this.getZoneEmergenza(true);
        this.getTastoZonaEmergenzaMappaActive();
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.ZoneEmergenza),
            new SetSediNavbarVisible(false),
            new GetTipologieEmergenza(),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
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

    getNightMode(): void {
        this.subscriptions.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.nightMode = nightMode;
            })
        );
    }

    getTastoZonaEmergenzaMappaActive(): void {
        this.subscriptions.add(
            this.tastoZonaEmergenzaMappaActive$.subscribe((tastoZonaEmergenzaMappaActive: boolean) => {
                this.tastoZonaEmergenzaMappaActive = tastoZonaEmergenzaMappaActive;
            })
        );
    }

    getZoneEmergenza(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetZoneEmergenza(page));
    }

    onChangeVisualizzazione(): void {
        if (this.mapActive) {
            // TODO: richiamare action per attivare la visualizzazione tabellare
            this.mapActive = false;
        } else if (!this.mapActive) {
            // TODO: richiamare action per attivare la mappa
            this.mapActive = true;
        }
    }

    onSetZonaEmergenzaFromMappaActiveValue(): void {
        if (!this.tastoZonaEmergenzaMappaActive) {
            this.store.dispatch(new SetZonaEmergenzaFromMappaActiveValue(true));
            this.mapActive = true;
        } else {
            this.store.dispatch(new SetZonaEmergenzaFromMappaActiveValue(false));
            this.mapActive = false;
        }
    }

    onEdit(zonaEmergenza: ZonaEmergenza): void {
        const modalNuovaEmergenza = this.modalService.open(ZonaEmergenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'md'
        });

        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.allTipologieZonaEmergenza);

        modalNuovaEmergenza.componentInstance.tipologieEmergenza = tipologieEmergenza;
        modalNuovaEmergenza.componentInstance.zonaEmergenzaEdit = zonaEmergenza;

        modalNuovaEmergenza.result.then((result: string) => {
            switch (result) {
                case 'ok':
                    this.edit();
                    break;
                case 'ko':
                    this.store.dispatch(new ResetZonaEmergenzaForm());
                    break;
                default:
                    this.store.dispatch(new ResetZonaEmergenzaForm());
                    break;
            }
        });
    }

    onDelete(zonaEmergenza: ZonaEmergenza): void {
        const confirmAnnullaEmergenzaModal = this.modalService.open(AnnullaZonaEmergenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg'
        });

        confirmAnnullaEmergenzaModal.componentInstance.zonaEmergenza = zonaEmergenza;

        confirmAnnullaEmergenzaModal.result.then((result: string) => {
            switch (result) {
                case 'ok':
                    this.delete();
                    break;
                case 'ko':
                    this.store.dispatch(new ResetAnnullaZonaEmergenzaForm());
                    break;
                default:
                    this.store.dispatch(new ResetAnnullaZonaEmergenzaForm());
                    break;
            }
        });
    }

    edit(): void {
        this.store.dispatch(new EditZonaEmergenza());
    }

    delete(): void {
        this.store.dispatch(new AnnullaZonaEmergenza());
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetZoneEmergenza(page));
    }
}
