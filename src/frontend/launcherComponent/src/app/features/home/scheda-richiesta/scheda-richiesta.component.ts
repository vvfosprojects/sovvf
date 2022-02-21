import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { SchedaTelefonataState } from '../store/states/form-richiesta/scheda-telefonata.state';
import { AuthState } from '../../auth/store/auth.state';
import { EntiState } from 'src/app/shared/store/states/enti/enti.state';
import { EnteInterface } from 'src/app/shared/interface/ente.interface';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { SchedaContatto } from '../../../shared/interface/scheda-contatto.interface';
import { Sede } from '../../../shared/model/sede.model';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { RichiestaModificaState } from '../store/states/form-richiesta/richiesta-modifica.state';
import { TipologieState } from '../../../shared/store/states/tipologie/tipologie.state';
import { DettagliTipologieState } from '../../../shared/store/states/dettagli-tipologie/dettagli-tipologie.state';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { TriageSummaryState } from '../../../shared/store/states/triage-summary/triage-summary.state';
import { TriageSummary } from '../../../shared/interface/triage-summary.interface';

@Component({
    selector: 'app-scheda-richiesta',
    templateUrl: './scheda-richiesta.component.html',
    styleUrls: ['./scheda-richiesta.component.css']
})
export class SchedaRichiestaComponent implements OnInit, OnDestroy {

    @Select(SchedaTelefonataState.idChiamata) idChiamata$: Observable<string>;
    @Select(SchedaTelefonataState.formSubmitted) formSubmitted$: Observable<boolean>;
    @Select(SchedaTelefonataState.competenze) competenze$: Observable<Sede[]>;
    @Select(SchedaTelefonataState.countInterventiProssimita) countInterventiProssimita$: Observable<number>;
    @Select(SchedaTelefonataState.interventiProssimita) interventiProssimita$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.countInterventiStessaVia) countInterventiStessaVia$: Observable<number>;
    @Select(SchedaTelefonataState.interventiStessaVia) interventiStessaVia$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.countInterventiChiusiStessoIndirizzo) countInterventiChiusiStessoIndirizzo$: Observable<number>;
    @Select(SchedaTelefonataState.interventiChiusiStessoIndirizzo) interventiChiusiStessoIndirizzo$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.resetChiamata) resetChiamata$: Observable<boolean>;
    @Select(SchedeContattoState.schedaContattoTelefonata) schedaContattoTelefonata$: Observable<SchedaContatto>;
    @Select(TriageSummaryState.schedaContattoDettaglio) schedaContattoTelefonataDettaglio$: Observable<string>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<EnteInterface[]>;

    // Loading
    @Select(SchedaTelefonataState.loadingSchedaRichiesta) loadingSchedaRichiesta$: Observable<boolean>;
    loadingSchedaRichiesta: boolean;
    // Loading
    @Select(SchedaTelefonataState.loadingCompetenze) loadingCompetenze$: Observable<boolean>;
    loadingCompetenze: boolean;

    // Modifica Richiesta
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;

    // Dettagli Tipologie
    @Select(DettagliTipologieState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;

    // Triage Summary
    @Select(TriageSummaryState.summary) triageSummary$: Observable<TriageSummary[]>;

    permessiFeature = PermissionFeatures;

    private subscription = new Subscription();

    constructor() {
        this.getLoadingSchedaRichiesta();
        this.getLoadingCompetenze();
    }

    ngOnInit(): void {
        console.log('Componente Scheda Richiesta creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Scheda Richiesta distrutto');
    }

    getLoadingSchedaRichiesta(): void {
        this.subscription.add(
            this.loadingSchedaRichiesta$.subscribe((loading: boolean) => {
                this.loadingSchedaRichiesta = loading;
            })
        );
    }

    getLoadingCompetenze(): void {
        this.subscription.add(
            this.loadingCompetenze$.subscribe((loading: boolean) => {
                this.loadingCompetenze = loading;
            })
        );
    }
}
