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

    subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getRicerca();
        this.getPageSize();
        this.getRubrica(true);
    }


    ngOnInit() {
        this.store.dispatch([new SetCurrentUrl(RoutesPath.Rubrica), new SetSediNavbarVisible(false)]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaRubrica(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getRubrica(pageAttuale: boolean) {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetRubrica(page));
    }

    onAddVoceRubrica() {
        const addVoceRubricaModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
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

    addVoceRubrica() {
        this.store.dispatch(new RequestAddEnte());
    }

    onEditVoceRubrica(voceRubrica: Ente) {
        console.log('onEditVoceRubrica', voceRubrica);
        const editVoceRubricaModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
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

    updateVoceRubrica() {
        this.store.dispatch(new RequestUpdateEnte());
    }

    onDeleteVoceRubrica(payload: { idVoceRubrica: string, descrizioneVoceRubrica: string }) {
        const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
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

    deleteVoceRubrica(id: string) {
        this.store.dispatch(new RequestDeleteEnte({ id }));
    }

    onRicercaRubrica(ricerca: string) {
        this.store.dispatch(new SetRicercaRubrica(ricerca));
    }

    onPageChange(page: number) {
        this.store.dispatch(new GetRubrica(page));
    }

    onPageSizeChange(pageSize: number) {
        this.store.dispatch(new SetPageSize(pageSize));
    }

    getRicerca() {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetRubrica());
                }
            })
        );
    }

    getPageSize() {
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
}
