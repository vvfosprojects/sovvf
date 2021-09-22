import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { RicercaAreaDocumentaleState } from './store/states/ricerca-area-documentale/ricerca-area-documentale.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { ClearFiltriAreaDocumentale, GetDocumentiAreaDocumentale, SetFiltroAreaDocumentale, StartLoadingDocumentiAreaDocumentale, StopLoadingDocumentiAreaDocumentale } from './store/actions/area-documentale/area-documentale.actions';
import { ClearRicercaAreaDocumentale, SetRicercaAreaDocumentale, } from './store/actions/ricerca-area-documentale/ricerca-area-documentale.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { AreaDocumentaleState } from './store/states/area-documentale/area-documentale.state';
import { DocumentoInterface } from 'src/app/shared/interface/documento.interface';
import { AuthState } from '../auth/store/auth.state';
import { DocumentoAreaDocumentaleModalComponent } from 'src/app/shared/modal/documento-area-documentale-modal/documento-area-documentale-modal.component';
import { AddDocumentoAreaDocumentale, DeleteDocumentoAreaDocumentale, EditDocumentoAreaDocumentale, ResetDocumentoAreaDocumentaleModal } from 'src/app/shared/store/actions/documento-area-documentale-modal/documento-area-documentale-modal.actions';
import { HttpEventType } from '@angular/common/http';
import { AreaDocumentaleService } from 'src/app/core/service/area-documentale-service/area-documentale.service';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { VoceFiltro } from '../home/filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-area-documentale',
    templateUrl: './area-documentale.component.html',
    styleUrls: ['./area-documentale.component.scss']
})
export class AreaDocumentaleComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(AreaDocumentaleState.documenti) documenti$: Observable<DocumentoInterface[]>;
    @Select(AreaDocumentaleState.loadingAreaDocumentale) loading$: Observable<boolean>;
    @Select(AreaDocumentaleState.filtriAreaDocumentale) filtriAreaDocumentale$: Observable<VoceFiltro[]>;
    @Select(AreaDocumentaleState.filtriSelezionatiAreaDocumentale) filtriSelezionatiAreaDocumentale$: Observable<VoceFiltro[]>;
    @Select(RicercaAreaDocumentaleState.ricerca) ricerca$: Observable<string>;
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
                private areaDocumentaleService: AreaDocumentaleService) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getDoubleMonitorMode();
        this.getRicerca();
        this.getPageSize();
        this.getDocumenti(true);
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.AreaDocumentale),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaAreaDocumentale(),
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

    getDocumenti(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetDocumentiAreaDocumentale(page));
    }

    onSelezioneFiltroAreaDocumentale(filtro: VoceFiltro): void {
        this.store.dispatch(new SetFiltroAreaDocumentale(filtro));
    }

    onResetFiltriAttiviAreaDocumentale(): void {
        this.store.dispatch(new ClearFiltriAreaDocumentale());
    }

    onAddDocumento(): void {
        let addDocumentoAreaDocumentaleModal: any;
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede?.codice;
        if (codSede) {
            addDocumentoAreaDocumentaleModal = this.modalService.open(DocumentoAreaDocumentaleModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
            addDocumentoAreaDocumentaleModal.componentInstance.codSede = codSede;
            addDocumentoAreaDocumentaleModal.componentInstance.editDocumento = false;
            addDocumentoAreaDocumentaleModal.result.then(
                (result: { success: boolean, formData: FormData }) => {
                    if (result.success) {
                        this.addDocumento(result.formData);
                    } else if (!result.success) {
                        this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                        console.log('Modal "addDocumento" chiusa con val ->', result);
                    }
                },
                (err: any) => {
                    this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                    console.error('Modal "addDocumento" chiusa senza bottoni. Err ->', err);
                }
            );
        } else {
            console.error('CodSede utente non trovato')
        }
    }

    onDownloadDocumento(documento: DocumentoInterface): void {
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede?.codice;
        if (codSede) {
            this.areaDocumentaleService.getDocumentoById(documento.id, codSede).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        console.error('Errore nel download del file (' + documento.fileName + ')');
                        break;
                    case HttpEventType.Response:
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.download = documento.fileName;
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
            }, error => console.log('Errore Stampa Documento'));
        } else {
            console.error('CodSede utente non trovato')
        }
    }

    onViewDocumento(documento: DocumentoInterface): void {
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede?.codice;
        if (codSede) {
            this.areaDocumentaleService.getDocumentoById(documento.id, codSede).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        console.error('Errore nel download del file (' + documento.fileName + ')');
                        break;
                    case HttpEventType.Response:
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
            }, error => console.log('Errore visualizzazione Documento'));
        } else {
            console.error('CodSede utente non trovato')
        }
    }

    onEditDocumento(documento: DocumentoInterface): void {
        let editDocumentoAreaDocumentaleModal: any;
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede?.codice;
        if (codSede) {
            this.areaDocumentaleService.getDocumentoById(documento.id, codSede).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        this.store.dispatch(new StartLoadingDocumentiAreaDocumentale());
                        break;
                        case HttpEventType.DownloadProgress:
                            this.store.dispatch(new StartLoadingDocumentiAreaDocumentale());
                            break;
                    case HttpEventType.Response:
                        this.store.dispatch(new StopLoadingDocumentiAreaDocumentale());
                        editDocumentoAreaDocumentaleModal = this.modalService.open(DocumentoAreaDocumentaleModalComponent, {
                            windowClass: 'modal-holder',
                            backdropClass: 'light-blue-backdrop',
                            centered: true,
                            size: 'lg'
                        });
                        editDocumentoAreaDocumentaleModal.componentInstance.codSede = codSede;
                        editDocumentoAreaDocumentaleModal.componentInstance.editDocumento = true;
                        editDocumentoAreaDocumentaleModal.componentInstance.documento = documento;
                        editDocumentoAreaDocumentaleModal.componentInstance.documentoFdFile = data.body;
                        editDocumentoAreaDocumentaleModal.result.then(
                            (result: { success: boolean, formData: FormData }) => {
                                if (result.success) {
                                    this.editDocumento(documento.id, result?.formData);
                                } else if (!result.success) {
                                    this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                                    console.log('Modal "editDocumento" chiusa con val ->', result);
                                }
                            },
                            (err: any) => {
                                this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                                console.error('Modal "editDocumento" chiusa senza bottoni. Err ->', err);
                            }
                        );
                        break;
                }
            }, error => console.log('Errore Stampa Documento'));
        } else {
            console.error('CodSede utente non trovato')
        }
    }

    onDeleteDocumento(event: { idDocumento: string, descrizioneDocumento: string }): void {
        let confirmDeletePosModal: any;
        confirmDeletePosModal = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'md'
        });
        confirmDeletePosModal.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        confirmDeletePosModal.componentInstance.titolo = 'Eliminazione ' + event.descrizioneDocumento;
        confirmDeletePosModal.componentInstance.messaggio = 'Sei sicuro di voler eliminare ' + event.descrizioneDocumento + '?';
        confirmDeletePosModal.result.then(
            (result: string) => {
                switch (result) {
                    case 'ok':
                        this.deleteDocumento(event.idDocumento);
                        break;
                    case 'ko':
                        this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                        console.log('Modal "deleteDocumento" chiusa con val ->', result);
                        break;
                }
            },
            (err: any) => {
                this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                console.error('Modal "deleteDocumento" chiusa senza bottoni. Err ->', err);
            }
        );
    }

    addDocumento(formData: FormData): void {
        this.store.dispatch(new AddDocumentoAreaDocumentale(formData));
    }

    editDocumento(id: string, formData: FormData): void {
        this.store.dispatch(new EditDocumentoAreaDocumentale(id, formData));
    }

    deleteDocumento(id: string): void {
        this.store.dispatch(new DeleteDocumentoAreaDocumentale(id));
    }

    onRicercaDocumenti(ricerca: string): void {
        this.store.dispatch(new SetRicercaAreaDocumentale(ricerca));
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetDocumentiAreaDocumentale(page));
    }

    onPageSizeChange(pageSize: number): void {
        this.store.dispatch(new SetPageSize(pageSize));
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetDocumentiAreaDocumentale());
                }
            })
        );
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetDocumentiAreaDocumentale());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }
}
