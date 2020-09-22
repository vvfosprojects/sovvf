import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { HomeState } from '../store/states/home.state';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { SchedaTelefonataState } from '../store/states/chiamata/scheda-telefonata.state';
import { AuthState } from '../../auth/store/auth.state';
import { EntiState } from 'src/app/shared/store/states/enti/enti.state';
import { Ente } from 'src/app/shared/interface/ente.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnteModalComponent } from '../../../shared/modal/ente-modal/ente-modal.component';
import { ClearFormEnte, RequestAddEnte } from '../../../shared/store/actions/enti/enti.actions';

@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Select(SchedaTelefonataState.loadingNuovaChiamata) loadingNuovaChiamata$: Observable<boolean>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    permessiFeature = PermissionFeatures;

    constructor(private modalService: NgbModal,
                private store: Store) {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

    aggiungiNuovoEnte() {
        const addEnteModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addEnteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new RequestAddEnte());
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormEnte());
                    console.log('Modal "addEnteModal" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormEnte());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }
}
