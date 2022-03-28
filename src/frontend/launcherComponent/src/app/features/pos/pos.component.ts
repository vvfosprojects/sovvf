import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { RicercaPosState } from './store/states/ricerca-pos/ricerca-pos.state';
import { PosState } from './store/states/pos/pos.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { GetPos, StartLoadingPos, StopLoadingPos } from './store/actions/pos/pos.actions';
import { ClearRicercaPos, SetRicercaPos } from './store/actions/ricerca-pos/ricerca-pos.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { PosModalComponent } from '../../shared/modal/pos-modal/pos-modal.component';
import { AddPos, DeletePos, EditPos, ResetPosModal } from '../../shared/store/actions/pos-modal/pos-modal.actions';
import { PosInterface } from '../../shared/interface/pos.interface';
import { GetTipologie } from '../../shared/store/actions/tipologie/tipologie.actions';
import { TipologieState } from '../../shared/store/states/tipologie/tipologie.state';
import { Tipologia } from '../../shared/model/tipologia.model';
import { GetAllDettagliTipologie } from '../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import { DettagliTipologieState } from '../../shared/store/states/dettagli-tipologie/dettagli-tipologie.state';
import { DettaglioTipologia } from '../../shared/interface/dettaglio-tipologia.interface';
import { ConfirmModalComponent } from '../../shared/modal/confirm-modal/confirm-modal.component';
import { HttpEventType } from '@angular/common/http';
import { PosService } from '../../core/service/pos-service/pos.service';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { VisualizzaDocumentoModalComponent } from '../../shared/modal/visualizza-documento-modal/visualizza-documento-modal.component';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    tipologie: Tipologia[];
    @Select(DettagliTipologieState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;
    dettagliTipologie: DettaglioTipologia[];
    @Select(PosState.pos) pos$: Observable<PosInterface[]>;
    @Select(PosState.loadingPos) loading$: Observable<boolean>;
    @Select(RicercaPosState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    formData: FormData;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store,
                private posService: PosService) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getDoubleMonitorMode();
        this.getRicerca();
        this.getPageSize();
        this.getPos(true);
        this.getTipologie();
        this.getDettagliTipologie();
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

    getDoubleMonitorMode(): void {
        this.subscriptions.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    getTipologie(): void {
        this.store.dispatch(new GetTipologie());
        this.subscriptions.add(
            this.tipologie$.subscribe((tipologie: Tipologia[]) => {
                if (tipologie) {
                    this.tipologie = tipologie;
                } else {
                    this.tipologie = null;
                }
            })
        );
    }

    getDettagliTipologie(): void {
        this.store.dispatch(new GetAllDettagliTipologie());
        this.subscriptions.add(
            this.dettagliTipologie$.subscribe((dettagliTipologie: DettaglioTipologia[]) => {
                if (dettagliTipologie) {
                    this.dettagliTipologie = dettagliTipologie;
                } else {
                    this.dettagliTipologie = null;
                }
            })
        );
    }

    getPos(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetPos(page));
    }

    onAddPos(): void {
        const addPosModal = this.modalService.open(PosModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addPosModal.componentInstance.tipologie = this.tipologie;
        addPosModal.componentInstance.dettagliTipologie = this.dettagliTipologie;
        addPosModal.componentInstance.editPos = false;
        addPosModal.result.then(
            (result: { success: boolean, formData: FormData }) => {
                if (result.success) {
                    this.addPos(result.formData);
                } else if (!result.success) {
                    this.store.dispatch(new ResetPosModal());
                    console.log('Modal "addPos" chiusa con val ->', result);
                }
            },
            (err: any) => {
                this.store.dispatch(new ResetPosModal());
                console.error('Modal "addPos" chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onDownloadPos(pos: PosInterface): void {
        this.posService.getPosById(pos.id).subscribe((data: any) => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    console.error('Errore nel download del file (' + pos.fileName + ')');
                    break;
                case HttpEventType.Response:
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = pos.fileName;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        }, () => console.log('Errore Stampa POS'));
    }

    onViewPos(pos: PosInterface): void {
        this.posService.getPosById(pos.id).subscribe((data: any) => {
            switch (data.type) {
                case HttpEventType.Response:
                    const modalVisualizzaPdf = this.modalService.open(VisualizzaDocumentoModalComponent, {
                        windowClass: 'xxlModal modal-holder',
                        backdropClass: 'light-blue-backdrop',
                        centered: true
                    });
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    modalVisualizzaPdf.componentInstance.titolo = pos?.descrizionePos?.toLocaleUpperCase();
                    modalVisualizzaPdf.componentInstance.blob = downloadedFile;
                    break;
            }
        }, () => console.log('Errore visualizzazione POS'));
    }

    onEditPos(pos: PosInterface): void {
        let editPosModal: any;
        this.posService.getPosById(pos.id).subscribe((data: any) => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    this.store.dispatch(new StartLoadingPos());
                    break;
                case HttpEventType.Response:
                    this.store.dispatch(new StopLoadingPos());
                    editPosModal = this.modalService.open(PosModalComponent, {
                        windowClass: 'modal-holder',
                        backdropClass: 'light-blue-backdrop',
                        centered: true,
                        size: 'lg'
                    });
                    editPosModal.componentInstance.tipologie = this.tipologie;
                    editPosModal.componentInstance.dettagliTipologie = this.dettagliTipologie;
                    editPosModal.componentInstance.editPos = true;
                    editPosModal.componentInstance.pos = pos;
                    editPosModal.componentInstance.posFdFile = data.body;
                    editPosModal.result.then(
                        (result: { success: boolean, formData: FormData }) => {
                            if (result.success) {
                                this.editPos(pos.id, result?.formData);
                            } else if (!result.success) {
                                this.store.dispatch(new ResetPosModal());
                                console.log('Modal "editPos" chiusa con val ->', result);
                            }
                        },
                        (err: any) => {
                            this.store.dispatch(new ResetPosModal());
                            console.error('Modal "editPos" chiusa senza bottoni. Err ->', err);
                        }
                    );
                    break;
            }
        }, () => console.log('Errore Stampa POS'));
    }

    onDeletePos(event: { idPos: string, descrizionePos: string }): void {
        let confirmDeletePosModal: any;
        confirmDeletePosModal = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'md'
        });
        confirmDeletePosModal.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        confirmDeletePosModal.componentInstance.titolo = 'Eliminazione ' + event.descrizionePos;
        confirmDeletePosModal.componentInstance.messaggio = 'Sei sicuro di voler eliminare ' + event.descrizionePos + '?';
        confirmDeletePosModal.result.then(
            (result: string) => {
                switch (result) {
                    case 'ok':
                        this.deletePos(event.idPos);
                        break;
                    case 'ko':
                        this.store.dispatch(new ResetPosModal());
                        console.log('Modal "deletePos" chiusa con val ->', result);
                        break;
                }
            },
            (err: any) => {
                this.store.dispatch(new ResetPosModal());
                console.error('Modal "deletePos" chiusa senza bottoni. Err ->', err);
            }
        );
    }

    addPos(formData: FormData): void {
        this.store.dispatch(new AddPos(formData));
    }

    editPos(id: string, formData: FormData): void {
        this.store.dispatch(new EditPos(id, formData));
    }

    deletePos(id: string): void {
        this.store.dispatch(new DeletePos(id));
    }

    onRicercaPos(ricerca: string): void {
        this.store.dispatch(new SetRicercaPos(ricerca));
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetPos(page));
    }

    onPageSizeChange(pageSize: number): void {
        this.store.dispatch(new SetPageSize(pageSize));
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
