import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { RicercaAreaDocumentaleState } from './store/states/ricerca-area-documentale/ricerca-area-documentale.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { GetDocumentiAreaDocumentale } from './store/actions/area-documentale/area-documentale.actions';
import { ClearRicercaAreaDocumentale, SetRicercaAreaDocumentale, } from './store/actions/ricerca-area-documentale/ricerca-area-documentale.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { AreaDocumentaleState } from './store/states/area-documentale/area-documentale.state';
import { DocumentoInterface } from 'src/app/shared/interface/documento.interface';
import { AuthState } from '../auth/store/auth.state';
import { DocumentoAreaDocumentaleModalComponent } from 'src/app/shared/modal/documento-area-documentale-modal/documento-area-documentale-modal.component';
import { AddDocumentoAreaDocumentale, ResetDocumentoAreaDocumentaleModal } from 'src/app/shared/store/actions/documento-area-documentale-modal/documento-area-documentale-modal.actions';

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
                private store: Store,) {
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
        // TODO: terminare logica con modali
    }

    onViewDocumento(documento: DocumentoInterface): void {
        // TODO: terminare logica con modali
    }

    onEditDocumento(documento: DocumentoInterface): void {
        // TODO: terminare logica con modali
    }

    onDeleteDocumento(event: { idDocumento: string, descrizioneDocumento: string }): void {
        // TODO: terminare logica con modali
    }

    addDocumento(formData: FormData): void {
        this.store.dispatch(new AddDocumentoAreaDocumentale(formData));
    }

    editDocumento(id: string, formData: FormData): void {
        // this.store.dispatch(new EditDocumentoAreaDocumentale(id, formData));
    }

    deleteDocumento(id: string): void {
        // this.store.dispatch(new DeleteDocumentoAreaDocumentale(id));
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
