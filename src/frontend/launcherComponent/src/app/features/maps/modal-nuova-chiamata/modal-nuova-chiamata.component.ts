import { Component, Input, OnDestroy } from '@angular/core';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { Select, Store } from '@ngxs/store';
import { TipologieState } from '../../../shared/store/states/tipologie/tipologie.state';
import { Utente } from '../../../shared/model/utente.model';
import { AuthState } from '../../auth/store/auth.state';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedaTelefonataState } from '../../home/store/states/form-richiesta/scheda-telefonata.state';
import { Sede } from '../../../shared/model/sede.model';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { EntiState } from '../../../shared/store/states/enti/enti.state';
import { EnteInterface } from '../../../shared/interface/ente.interface';
import { RichiestaModificaState } from '../../home/store/states/form-richiesta/richiesta-modifica.state';
import { TriageSummaryState } from '../../../shared/store/states/triage-summary/triage-summary.state';
import { TriageSummary } from '../../../shared/interface/triage-summary.interface';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { ViewComponentState } from '../../home/store/states/view/view.state';
import { ToggleChiamata } from '../../home/store/actions/view/view.actions';

@Component({
    selector: 'app-modal-nuova-chiamata',
    templateUrl: './modal-nuova-chiamata.component.html',
    styleUrls: ['./modal-nuova-chiamata.component.scss']
})
export class ModalNuovaChiamataComponent implements OnDestroy {

    @Select(SchedaTelefonataState.competenze) competenze$: Observable<Sede[]>;
    @Select(SchedaTelefonataState.countInterventiProssimita) countInterventiProssimita$: Observable<number>;
    @Select(SchedaTelefonataState.interventiProssimita) interventiProssimita$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.countInterventiStessaVia) countInterventiStessaVia$: Observable<number>;
    @Select(SchedaTelefonataState.interventiStessaVia) interventiStessaVia$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.countInterventiChiusiStessoIndirizzo) countInterventiChiusiStessoIndirizzo$: Observable<number>;
    @Select(SchedaTelefonataState.interventiChiusiStessoIndirizzo) interventiChiusiStessoIndirizzo$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.resetChiamata) resetChiamata$: Observable<boolean>;
    @Select(SchedaTelefonataState.loadingSchedaRichiesta) loadingSchedaRichiesta$: Observable<boolean>;
    loadingSchedaRichiesta: boolean;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<EnteInterface[]>;
    @Select(SchedaTelefonataState.loadingCompetenze) loadingCompetenze$: Observable<boolean>;

    // Modifica Richiesta
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;

    // Triage Summary
    @Select(TriageSummaryState.summary) triageSummary$: Observable<TriageSummary[]>;

    lat: number;
    lon: number;
    address: string;
    provincia: string;
    cap: string;
    regione: string;
    civico: string;

    permessiFeature = PermissionFeatures;

    private subscriptions: Subscription = new Subscription();

    constructor(private activeModal: NgbActiveModal,
                private store: Store) {
        this.getLoadingSchedaRichiesta();
        const formChiamataStatus = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
        if (formChiamataStatus) {
            this.store.dispatch(new ToggleChiamata(false));
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getLoadingSchedaRichiesta(): void {
        this.subscriptions.add(
            this.loadingSchedaRichiesta$.subscribe((loading: boolean) => {
                this.loadingSchedaRichiesta = loading;
            })
        );
    }

    close(): void {
        this.activeModal.close('ko');
    }
}
