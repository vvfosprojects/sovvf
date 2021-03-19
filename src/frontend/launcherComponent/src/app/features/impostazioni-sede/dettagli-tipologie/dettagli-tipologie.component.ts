import {Component, Input, OnDestroy} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Tipologia } from '../../../shared/model/tipologia.model';
import {
    GetDettagliTipologie,
    ReducerSelezioneFiltroTipologia,
    ResetFiltroTipologiaSelezionato,
    SetRicercaDettagliTipologie
} from '../../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import { PaginationState } from '../../../shared/store/states/pagination/pagination.state';
import { LoadingState } from '../../../shared/store/states/loading/loading.state';
import { SetPageSize } from '../../../shared/store/actions/pagination/pagination.actions';
import { DettagliTipologieState } from '../../../shared/store/states/dettagli-tipologie/dettagli-tipologie.state';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { DettaglioTipologiaModalComponent } from './dettaglio-tipologia-modal/dettaglio-tipologia-modal.component';
import {
    ClearFormDettaglioTipologia,
    RequestAddDettaglioTipologia,
    RequestDeleteDettaglioTipologia,
    RequestUpdateDettaglioTipologia
} from '../store/actions/dettaglio-tipologia-modal.actions';
import { ConfirmModalComponent } from '../../../shared/modal/confirm-modal/confirm-modal.component';
import { TipologieState } from '../../../shared/store/states/tipologie/tipologie.state';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
    selector: 'app-dettagli-tipologie',
    templateUrl: './dettagli-tipologie.component.html',
    styleUrls: ['./dettagli-tipologie.component.scss']
})
export class DettagliTipologieComponent implements OnDestroy {

    @Input() doubleMonitor: boolean;

    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(DettagliTipologieState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;
    dettagliTipologie: DettaglioTipologia[];
    @Select(DettagliTipologieState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    totalItems: number;
    @Select(PaginationState.page) page$: Observable<number>;
    page: number;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    private subscriptions: Subscription = new Subscription();

    constructor(private modalService: NgbModal,
                private store: Store,
                private ngSelectConfig: NgSelectConfig) {
        ngSelectConfig.appendTo = 'body';
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getRicerca();
        this.getPageSize();
        this.getTotalItems();
        this.getPage();
        this.getDettagliTipologie(true);
        this.dettagliTipologie$.subscribe((dettagliTipologie: DettaglioTipologia[]) => this.dettagliTipologie = dettagliTipologie);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getDettagliTipologie(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetDettagliTipologie(page));
    }

    onAddDettaglioTipologia(): void {
        let addDettaglioTipologia: any;
        if (this.doubleMonitor) {
            addDettaglioTipologia = this.modalService.open(DettaglioTipologiaModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        } else {
            addDettaglioTipologia = this.modalService.open(DettaglioTipologiaModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        }
        addDettaglioTipologia.result.then(
            (result: { success: boolean, openAgain: boolean }) => {
                if (result.success) {
                    this.addDettaglioTipologia(result.openAgain);
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormDettaglioTipologia());
                    console.log('Modal "addDettaglioTipologia" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormDettaglioTipologia());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    addDettaglioTipologia(openAgain: boolean): void {
        this.store.dispatch(new RequestAddDettaglioTipologia());
        if (openAgain) {
            this.onAddDettaglioTipologia();
        }
    }

    onEditDettaglioTipologia(dettaglioTipologia: DettaglioTipologia): void {
        console.log('onEditDettaglioTipologia', dettaglioTipologia);
        let editVoceRubricaModal;
        if (this.doubleMonitor) {
            editVoceRubricaModal = this.modalService.open(DettaglioTipologiaModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        } else {
            editVoceRubricaModal = this.modalService.open(DettaglioTipologiaModalComponent, {
                windowClass: 'modal-holder ',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        }
        editVoceRubricaModal.componentInstance.editDettaglioTipologia = dettaglioTipologia;
        editVoceRubricaModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.updateDettaglioTipologia();
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormDettaglioTipologia());
                    console.log('Modal "editDettaglioTipologia" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormDettaglioTipologia());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    updateDettaglioTipologia(): void {
        this.store.dispatch(new RequestUpdateDettaglioTipologia());
    }

    onDeleteDettaglioTipologia(payload: { codDettaglioTipologia: number, descrizioneDettaglioTipologia: string }): void {
        let modalConfermaEliminazione: any;
        if (this.doubleMonitor) {
            modalConfermaEliminazione = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
        } else {
            modalConfermaEliminazione = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
        }
        modalConfermaEliminazione.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaEliminazione.componentInstance.titolo = 'Elimina ' + payload.descrizioneDettaglioTipologia;
        modalConfermaEliminazione.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere il dettaglio?';
        modalConfermaEliminazione.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
        ];
        modalConfermaEliminazione.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.deleteDettaglioTipologia(payload.codDettaglioTipologia);
                        break;
                    case 'ko':
                        // console.log('Azione annullata');
                        break;
                }
                // console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    deleteDettaglioTipologia(codDettaglioTipologia: number): void {
        this.store.dispatch(new RequestDeleteDettaglioTipologia(codDettaglioTipologia));
    }

    onRicercaDettagliTipologie(ricerca: string): void {
        this.store.dispatch(new SetRicercaDettagliTipologie(ricerca));
    }

    onFiltroTipologiaChange(tipologia: { codice: string, descrizione: string }): void {
        if (tipologia) {
            this.store.dispatch(new ReducerSelezioneFiltroTipologia(+tipologia.codice));
        } else {
            this.onFiltroTipologiaReset();
        }
    }

    onFiltroTipologiaReset(): void {
        this.store.dispatch(new ResetFiltroTipologiaSelezionato());
    }

    onPageSizeChange(pageSize: number): void {
        this.store.dispatch(new SetPageSize(pageSize));
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetDettagliTipologie());
                }
            })
        );
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetDettagliTipologie(page));
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetDettagliTipologie());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }

    getTotalItems(): void {
        this.subscriptions.add(
            this.totalItems$.subscribe((totalItems: number) => {
                this.totalItems = totalItems;
            })
        );
    }

    getPage(): void {
        this.subscriptions.add(
            this.page$.subscribe((page: number) => {
                this.page = page;
            })
        );
    }

}
