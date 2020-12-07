import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { SchedaContatto } from '../../../shared/interface/scheda-contatto.interface';

@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Input() boxAttivi: boolean;

    @Select(SchedaTelefonataState.loadingNuovaChiamata) loadingNuovaChiamata$: Observable<boolean>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    @Select(SchedeContattoState.schedaContattoTelefonata) schedaContattoTelefonata$: Observable<SchedaContatto>;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;

    doubleMonitor: boolean;
    permessiFeature = PermissionFeatures;

    private subscription = new Subscription();

    constructor(private modalService: NgbModal,
                private store: Store) {
    }

    ngOnInit(): void {
        console.log('Componente Chiamata creato');
        this.subscription.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
    }

    ngOnDestroy(): void {
        console.log('Componente Chiamata distrutto');
    }

    aggiungiNuovoEnte(): void {
        let addEnteModal;
        if (this.doubleMonitor) {
            addEnteModal = this.modalService.open(EnteModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        } else {
            addEnteModal = this.modalService.open(EnteModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });
        }
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
