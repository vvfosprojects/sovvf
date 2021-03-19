import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from 'src/app/shared/store/states/loading/loading.state';
import { RicercaRubricaState } from './store/states/ricerca-rubrica/ricerca-rubrica.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { ClearRicercaRubrica, SetRicercaRubrica } from './store/actions/ricerca-rubrica/ricerca-rubrica.actions';
import { Ente } from '../../shared/interface/ente.interface';
import { EnteModalComponent } from '../../shared/modal/ente-modal/ente-modal.component';
import { RubricaState } from './store/states/rubrica/rubrica.state';
import { GetRubrica } from './store/actions/rubrica/rubrica.actions';
import { ClearFormEnte, RequestAddEnte, RequestDeleteEnte, RequestUpdateEnte } from '../../shared/store/actions/enti/enti.actions';
import { ConfirmModalComponent } from '../../shared/modal/confirm-modal/confirm-modal.component';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import {ViewportState} from '../../shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-rubrica',
    templateUrl: './rubrica.component.html',
    styleUrls: ['./rubrica.component.css']
})
export class RubricaComponent implements OnInit, OnDestroy {

    @Select(RubricaState.vociRubrica) vociRubrica$: Observable<Ente[]>;
    @Select(RicercaRubricaState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getMonitorSize();
        this.getRicerca();
        this.getPageSize();
        this.getRubrica(true);
    }


    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.Rubrica),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaRubrica(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getRubrica(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetRubrica(page));
    }

    onAddVoceRubrica(): void {
        let addVoceRubricaModal;
        if (this.doubleMonitor) {
          addVoceRubricaModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder modal-left',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
          });
        } else {
          addVoceRubricaModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
          });
        }
        addVoceRubricaModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.addVoceRubrica();
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormEnte());
                    console.log('Modal "addVoceRubrica" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormEnte());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    addVoceRubrica(): void {
        this.store.dispatch(new RequestAddEnte());
    }

    onEditVoceRubrica(voceRubrica: Ente): void {
        console.log('onEditVoceRubrica', voceRubrica);
        let editVoceRubricaModal;
        if (this.doubleMonitor) {
          editVoceRubricaModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder modal-left',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
          });
        } else {
          editVoceRubricaModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder ',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
          });
        }
        editVoceRubricaModal.componentInstance.editEnte = voceRubrica;
        editVoceRubricaModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.updateVoceRubrica();
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormEnte());
                    console.log('Modal "addVoceRubrica" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormEnte());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    updateVoceRubrica(): void {
        this.store.dispatch(new RequestUpdateEnte());
    }

    onDeleteVoceRubrica(payload: { idVoceRubrica: string, descrizioneVoceRubrica: string }): void {
        let modalConfermaAnnulla;
        if (this.doubleMonitor) {
          modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder modal-left',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        } else {
          modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
          });
        }
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Elimina ' + payload.descrizioneVoceRubrica;
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di volerlo rimuovere dalla rubrica?';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
        ];
        modalConfermaAnnulla.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.deleteVoceRubrica(payload.idVoceRubrica);
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

    deleteVoceRubrica(id: string): void {
        this.store.dispatch(new RequestDeleteEnte({ id }));
    }

    onRicercaRubrica(ricerca: string): void {
        this.store.dispatch(new SetRicercaRubrica(ricerca));
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetRubrica(page));
    }

    onPageSizeChange(pageSize: number): void {
        this.store.dispatch(new SetPageSize(pageSize));
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetRubrica());
                }
            })
        );
    }

    getPageSize(): void {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetRubrica());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }

    getMonitorSize(): void {
      this.subscriptions.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
    }
}
