import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { TipologiaEmergenza, ZonaEmergenza } from './model/zona-emergenza.model';
import { ZoneEmergenzaState } from './store/states/zone-emergenza/zone-emergenza.state';
import {
    AddZonaEmergenza,
    AllertaCONZonaEmergenza,
    AnnullaZonaEmergenza,
    EditZonaEmergenza,
    GetTipologieEmergenza,
    GetZoneEmergenza,
    ResetAllertaCONZonaEmergenzaForm,
    ResetAnnullaZonaEmergenzaForm,
    ResetZonaEmergenzaForm,
    SetMappaActiveValue,
    UpdateModuliMobConsolidamentoZonaEmergenza,
    UpdateModuliMobImmediataZonaEmergenza,
    UpdateModuliMobPotIntZonaEmergenza
} from './store/actions/zone-emergenza/zone-emergenza.actions';
import { SetZonaEmergenzaFromMappaActiveValue } from './store/actions/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.actions';
import { TastoZonaEmergenzaMappaState } from './store/states/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.state';
import { ZonaEmergenzaModalComponent } from './zona-emergenza-modal/zona-emergenza-modal.component';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { AnnullaZonaEmergenzaModalComponent } from './annulla-zona-emergenza-modal/annulla-zona-emergenza-modal.component';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { ModuliColonnaMobileModalComponent } from './moduli-colonna-mobile-modal/moduli-colonna-mobile-modal.component';
import { AllertaCONZonaEmergenzaModalComponent } from './allerta-CON-zona-emergenza-modal/allerta-CON-zona-emergenza-modal.component';
import { ModuloColonnaMobile } from './interface/modulo-colonna-mobile.interface';
import { Navigate } from '@ngxs/router-plugin';

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
    @Select(ZoneEmergenzaState.mappaActive) mappaActive$: Observable<boolean>;
    mappaActive: boolean;
    @Select(TastoZonaEmergenzaMappaState.tastoZonaEmergenzaMappaActive) tastoZonaEmergenzaMappaActive$: Observable<boolean>;
    tastoZonaEmergenzaMappaActive: boolean;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    @Select(SediTreeviewState.isDirRegionale) isDirRegionale$: Observable<boolean>;
    @Select(SediTreeviewState.isCON) isCON$: Observable<boolean>;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        this.getDoubleMonitorMode();
        this.getNightMode();
        this.getZoneEmergenza(true);
        this.getTastoZonaEmergenzaMappaActive();
        this.getMappaActive();
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
                if (this.doubleMonitor === false && this.tastoZonaEmergenzaMappaActive) {
                    this.store.dispatch([
                        new SetZonaEmergenzaFromMappaActiveValue(false),
                        new SetMappaActiveValue(true)
                    ]);
                }
                if (this.doubleMonitor === true && this.tastoZonaEmergenzaMappaActive) {
                    this.store.dispatch([
                        new SetZonaEmergenzaFromMappaActiveValue(false),
                        new SetMappaActiveValue(false)
                    ]);
                }
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

    getMappaActive(): void {
        this.subscriptions.add(
            this.mappaActive$.subscribe((mappaActive: boolean) => {
                this.mappaActive = mappaActive;
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
        if (this.mappaActive) {
            this.store.dispatch([
                new SetZonaEmergenzaFromMappaActiveValue(false),
                new SetMappaActiveValue(false)
            ]);
        } else if (!this.mappaActive) {
            this.store.dispatch([
                new SetMappaActiveValue(true)
            ]);
        }
    }

    onCreazioneEmergenza(): void {
        const modalNuovaEmergenza = this.modalService.open(ZonaEmergenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'md'
        });

        const allTipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.allTipologieZonaEmergenza);
        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.tipologieZonaEmergenza);

        modalNuovaEmergenza.componentInstance.allTipologieEmergenza = allTipologieEmergenza;
        modalNuovaEmergenza.componentInstance.tipologieEmergenza = tipologieEmergenza;

        modalNuovaEmergenza.result.then((result: string) => {
            switch (result) {
                case 'ok':
                    this.store.dispatch([
                        new AddZonaEmergenza(),
                        new SetZonaEmergenzaFromMappaActiveValue(false)
                    ]);
                    break;
                case 'ko':
                    this.store.dispatch([
                        new ResetZonaEmergenzaForm(),
                        new SetZonaEmergenzaFromMappaActiveValue(false)
                    ]);
                    break;
                default:
                    this.store.dispatch([
                        new ResetZonaEmergenzaForm(),
                        new SetZonaEmergenzaFromMappaActiveValue(false)
                    ]);
                    break;
            }
        });
    }

    onDetail(zonaEmergenza: ZonaEmergenza): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza + '/detail/' + zonaEmergenza.id]));
    }

    onEdit(zonaEmergenza: ZonaEmergenza): void {
        const modalNuovaEmergenza = this.modalService.open(ZonaEmergenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'md',
            centered: true
        });

        const allTipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.allTipologieZonaEmergenza);
        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.tipologieZonaEmergenza);

        modalNuovaEmergenza.componentInstance.allTipologieEmergenza = allTipologieEmergenza;
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
            size: 'lg',
            centered: true
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

    onColonneMobili(event: { zonaEmergenza: ZonaEmergenza, fase: string }): void {
        const colonneMobiliEmergenzaModal = this.modalService.open(ModuliColonnaMobileModalComponent, {
            windowClass: 'modal-holder xxlModal',
            centered: true
        });

        colonneMobiliEmergenzaModal.componentInstance.zonaEmergenza = event.zonaEmergenza;
        colonneMobiliEmergenzaModal.componentInstance.fase = event.fase;

        colonneMobiliEmergenzaModal.result.then((result: { esito: string, moduliSelezionati: ModuloColonnaMobile[], fase: string }) => {
            switch (result.esito) {
                case 'ok':
                    switch (result.fase) {
                        case '1':
                            this.store.dispatch([
                                new UpdateModuliMobImmediataZonaEmergenza(event.zonaEmergenza, result.moduliSelezionati)
                            ]);
                            break;
                        case '2':
                            this.store.dispatch([
                                new UpdateModuliMobPotIntZonaEmergenza(event.zonaEmergenza, result.moduliSelezionati)
                            ]);
                            break;
                        case '3':
                            this.store.dispatch([
                                new UpdateModuliMobConsolidamentoZonaEmergenza(event.zonaEmergenza, result.moduliSelezionati)
                            ]);
                            break;
                    }
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
        });
    }

    onAllertaCON(zonaEmergenza: ZonaEmergenza): void {
        const allertaCONModal = this.modalService.open(AllertaCONZonaEmergenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true
        });

        allertaCONModal.componentInstance.zonaEmergenza = zonaEmergenza;

        allertaCONModal.result.then((result: string) => {
            switch (result) {
                case 'ok':
                    this.allertaCON();
                    break;
                case 'ko':
                    this.store.dispatch(new ResetAllertaCONZonaEmergenzaForm());
                    break;
                default:
                    this.store.dispatch(new ResetAllertaCONZonaEmergenzaForm());
                    break;
            }
        });
    }

    onSedi(zonaEmergenza: ZonaEmergenza): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza + '/detail-sedi/' + zonaEmergenza.id]));
    }

    edit(): void {
        this.store.dispatch(new EditZonaEmergenza());
    }

    delete(): void {
        this.store.dispatch(new AnnullaZonaEmergenza());
    }

    allertaCON(): void {
        this.store.dispatch(new AllertaCONZonaEmergenza());
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetZoneEmergenza(page));
    }
}
