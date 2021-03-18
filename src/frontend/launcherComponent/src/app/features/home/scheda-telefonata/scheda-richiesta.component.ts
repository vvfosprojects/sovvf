import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { HomeState } from '../store/states/home.state';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { ChiamataState } from '../store/states/scheda-telefonata/chiamata.state';
import { AuthState } from '../../auth/store/auth.state';
import { EntiState } from 'src/app/shared/store/states/enti/enti.state';
import { Ente } from 'src/app/shared/interface/ente.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnteModalComponent } from '../../../shared/modal/ente-modal/ente-modal.component';
import { ClearFormEnte, RequestAddEnte } from '../../../shared/store/actions/enti/enti.actions';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { SchedaContatto } from '../../../shared/interface/scheda-contatto.interface';
import { Sede } from '../../../shared/model/sede.model';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { RichiestaModificaState } from '../store/states/scheda-telefonata/richiesta-modifica.state';

@Component({
    selector: 'app-scheda-richiesta',
    templateUrl: './scheda-richiesta.component.html',
    styleUrls: ['./scheda-richiesta.component.css']
})
export class SchedaRichiestaComponent implements OnInit, OnDestroy {

    @Select(ChiamataState.loadingNuovaChiamata) loadingNuovaChiamata$: Observable<boolean>;
    @Select(ChiamataState.competenze) competenze$: Observable<Sede[]>;
    @Select(ChiamataState.countInterventiProssimita) countInterventiProssimita$: Observable<number>;
    @Select(ChiamataState.interventiProssimita) interventiProssimita$: Observable<SintesiRichiesta[]>;
    @Select(ChiamataState.resetChiamata) resetChiamata$: Observable<boolean>;
    @Select(SchedeContattoState.schedaContattoTelefonata) schedaContattoTelefonata$: Observable<SchedaContatto>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;

    // Modifica Richiesta
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;

    // TODO: da inserire nello store e prendere con un selector
    dettagliTipologie: any[] = [
        {
            codice: '1-1',
            codSede: 'RM.1000',
            codTipologia: '1',
            descrizione: 'Indendio Auto'
        },
        {
            codice: '1-2',
            codSede: 'RM.1000',
            codTipologia: '1',
            descrizione: 'Indendio Auto Cisterna'
        },
        {
            codice: '22-1',
            codSede: 'RM.1000',
            codTipologia: '22',
            descrizione: 'Allagamento Appartamento'
        }
    ];

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
