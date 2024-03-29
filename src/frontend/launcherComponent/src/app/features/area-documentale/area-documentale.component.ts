import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { RicercaAreaDocumentaleState } from './store/states/ricerca-area-documentale/ricerca-area-documentale.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { ClearCodCategoriaAreaDocumentale, GetDocumentiAreaDocumentale, SetCodCategoriaAreaDocumentale, StartLoadingDocumentiAreaDocumentale, StopLoadingDocumentiAreaDocumentale } from './store/actions/area-documentale/area-documentale.actions';
import { ClearRicercaAreaDocumentale, SetRicercaAreaDocumentale, } from './store/actions/ricerca-area-documentale/ricerca-area-documentale.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { AreaDocumentaleState } from './store/states/area-documentale/area-documentale.state';
import { DocumentoInterface } from 'src/app/shared/interface/documento.interface';
import { DocumentoAreaDocumentaleModalComponent } from 'src/app/shared/modal/documento-area-documentale-modal/documento-area-documentale-modal.component';
import { AddDocumentoAreaDocumentale, DeleteDocumentoAreaDocumentale, EditDocumentoAreaDocumentale, ResetDocumentoAreaDocumentaleModal } from 'src/app/shared/store/actions/documento-area-documentale-modal/documento-area-documentale-modal.actions';
import { VisualizzaDocumentoModalComponent } from '../../shared/modal/visualizza-documento-modal/visualizza-documento-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { AreaDocumentaleService } from 'src/app/core/service/area-documentale-service/area-documentale.service';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { LSNAME } from '../../core/settings/config';
import { TipoConcorrenzaEnum } from '../../shared/enum/tipo-concorrenza.enum';
import { AddConcorrenza, DeleteConcorrenza } from '../../shared/store/actions/concorrenza/concorrenza.actions';
import { PermissionFeatures } from '../../shared/enum/permission-features.enum';

@Component({
    selector: 'app-area-documentale',
    templateUrl: './area-documentale.component.html',
    styleUrls: ['./area-documentale.component.scss']
})
export class AreaDocumentaleComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(AreaDocumentaleState.documenti) documenti$: Observable<DocumentoInterface[]>;
    @Select(AreaDocumentaleState.codCategoria) codCategoria$: Observable<string>;
    codCategoria: string;
    @Select(AreaDocumentaleState.descCategoria) descCategoria$: Observable<string>;
    descCategoria: string;
    @Select(AreaDocumentaleState.loadingAreaDocumentale) loading$: Observable<boolean>;
    @Select(RicercaAreaDocumentaleState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    formData: FormData;

    permissionFeatures = PermissionFeatures;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store,
                private route: ActivatedRoute,
                private areaDocumentaleService: AreaDocumentaleService) {
        // TODO: modificare quando verranno inserite nuove tipologie di documentazione
        localStorage.setItem(LSNAME.areaDocumentale, '1');
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getDoubleMonitorMode();
        this.getCodCategoria();
        this.getDescCategoria();
        this.getRicerca();
        this.getPageSize();
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
            new ClearCodCategoriaAreaDocumentale(),
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

    getCodCategoria(): void {
        this.subscriptions.add(
            this.codCategoria$.subscribe((codCategoria: string) => {
                const codCategoriaAreaDocumentale = localStorage.getItem(LSNAME.areaDocumentale);
                console.log('codCategoriaAreaDocumentale SESSION STORAGE', codCategoriaAreaDocumentale);
                if (codCategoria) {
                    this.codCategoria = codCategoria;
                } else if (codCategoriaAreaDocumentale) {
                    this.store.dispatch(new SetCodCategoriaAreaDocumentale(codCategoriaAreaDocumentale));
                } else if (!codCategoriaAreaDocumentale) {
                    this.store.dispatch(new Navigate(['/home']));
                }
            })
        );
    }

    getDescCategoria(): void {
        this.subscriptions.add(
            this.descCategoria$.subscribe((descCategoria: string) => {
                if (descCategoria) {
                    this.descCategoria = descCategoria;
                    this.getDocumenti(true);
                }
            })
        );
    }

    getDocumenti(pageAttuale: boolean): void {
        if (this.descCategoria) {
            let page = null;
            if (pageAttuale) {
                page = this.store.selectSnapshot(PaginationState.page);
            }
            this.store.dispatch(new GetDocumentiAreaDocumentale(page));
        }
    }

    onAddDocumento(): void {
        let addDocumentoAreaDocumentaleModal: any;
        addDocumentoAreaDocumentaleModal = this.modalService.open(DocumentoAreaDocumentaleModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addDocumentoAreaDocumentaleModal.componentInstance.descCategoria = this.descCategoria;
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
    }

    onDownloadDocumento(documento: DocumentoInterface): void {
        this.areaDocumentaleService.getDocumentoById(documento.id).subscribe((data: any) => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    console.warn('Download del file (' + documento.fileName + ')');
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
        }, () => console.log('Errore Stampa Documento'));
    }

    onViewDocumento(documento: DocumentoInterface): void {
        const fileNameSplit = documento.fileName.split('.');
        if (fileNameSplit[fileNameSplit.length - 1] === 'pdf') {
            this.areaDocumentaleService.getDocumentoById(documento.id).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        console.warn('Download del file (' + documento.fileName + ')');
                        break;
                    case HttpEventType.Response:
                        const modalVisualizzaPdf = this.modalService.open(VisualizzaDocumentoModalComponent, {
                            windowClass: 'xxlModal modal-holder',
                            backdropClass: 'light-blue-backdrop',
                            centered: true
                        });
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        modalVisualizzaPdf.componentInstance.titolo = documento?.descrizioneDocumento?.toLocaleUpperCase();
                        modalVisualizzaPdf.componentInstance.blob = downloadedFile;
                        break;
                }
            }, () => console.log('Errore visualizzazione Documento'));
        } else {
            this.onDownloadDocumento(documento);
        }
    }

    onEditDocumento(documento: DocumentoInterface): void {
        let editDocumentoAreaDocumentaleModal: any;
        this.areaDocumentaleService.getDocumentoById(documento.id).subscribe((response: any) => {
            switch (response.type) {
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
                    editDocumentoAreaDocumentaleModal.componentInstance.descCategoria = this.descCategoria;
                    editDocumentoAreaDocumentaleModal.componentInstance.editDocumento = true;
                    editDocumentoAreaDocumentaleModal.componentInstance.documento = documento;
                    editDocumentoAreaDocumentaleModal.componentInstance.documentoFdFile = new Blob([response.body], { type: response.body.type });
                    switch (documento.descrizioneCategoria) {
                        case 'Piani Discendenti':
                            const data = {
                                type: TipoConcorrenzaEnum.ModificaPianiDiscendenti,
                                value: documento.id
                            };
                            this.store.dispatch(new AddConcorrenza([data]));
                            break;
                    }
                    editDocumentoAreaDocumentaleModal.result.then((result: { success: boolean, formData: FormData }) => {
                            switch (documento.descrizioneCategoria) {
                                case 'Piani Discendenti':
                                    this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.ModificaPianiDiscendenti, [documento.id]));
                                    break;
                            }
                            if (result.success) {
                                this.editDocumento(documento.id, result?.formData);
                            } else if (!result.success) {
                                this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                                console.log('Modal "editDocumento" chiusa con val ->', result);
                            }
                        }, (err: any) => {
                            switch (documento.descrizioneCategoria) {
                                case 'Piani Discendenti':
                                    this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.ModificaPianiDiscendenti, [documento.id]));
                                    break;
                            }
                            this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                            console.error('Modal "editDocumento" chiusa senza bottoni. Err ->', err);
                        }
                    );
                    break;
            }
        }, () => console.log('Errore Stampa Documento'));
    }

    onDeleteDocumento(event: { idDocumento: string, descrizioneDocumento: string, descrizioneCategoria: string }): void {
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
        switch (event.descrizioneCategoria) {
            case 'Piani Discendenti':
                const data = {
                    type: TipoConcorrenzaEnum.EliminaPianiDiscendenti,
                    value: event.idDocumento
                };
                this.store.dispatch(new AddConcorrenza([data]));
                break;
        }
        confirmDeletePosModal.result.then((result: string) => {
                switch (event.descrizioneCategoria) {
                    case 'Piani Discendenti':
                        this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.EliminaPianiDiscendenti, [event.idDocumento]));
                        break;
                }
                switch (result) {
                    case 'ok':
                        this.deleteDocumento(event.idDocumento);
                        break;
                    case 'ko':
                        this.store.dispatch(new ResetDocumentoAreaDocumentaleModal());
                        console.log('Modal "deleteDocumento" chiusa con val ->', result);
                        break;
                }
            }, (err: any) => {
                switch (event.descrizioneCategoria) {
                    case 'Piani Discendenti':
                        this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.EliminaPianiDiscendenti, [event.idDocumento]));
                        break;
                }
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
                console.log('ricerca', ricerca);
                console.log('this.descCategoria', this.descCategoria);
                if ((ricerca || ricerca === '') && this.descCategoria) {
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
