import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { ChiamataState } from '../store/states/scheda-telefonata/chiamata.state';
import { AuthState } from '../../auth/store/auth.state';
import { EntiState } from 'src/app/shared/store/states/enti/enti.state';
import { Ente } from 'src/app/shared/interface/ente.interface';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { SchedaContatto } from '../../../shared/interface/scheda-contatto.interface';
import { Sede } from '../../../shared/model/sede.model';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { RichiestaModificaState } from '../store/states/scheda-telefonata/richiesta-modifica.state';
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

    @Select(ChiamataState.loadingNuovaChiamata) loadingNuovaChiamata$: Observable<boolean>;
    @Select(ChiamataState.competenze) competenze$: Observable<Sede[]>;
    @Select(ChiamataState.countInterventiProssimita) countInterventiProssimita$: Observable<number>;
    @Select(ChiamataState.interventiProssimita) interventiProssimita$: Observable<SintesiRichiesta[]>;
    @Select(ChiamataState.resetChiamata) resetChiamata$: Observable<boolean>;
    @Select(SchedeContattoState.schedaContattoTelefonata) schedaContattoTelefonata$: Observable<SchedaContatto>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;

    // Modifica Richiesta
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;

    // Dettagli Tipologie
    @Select(DettagliTipologieState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;

    // Triage Summary
    @Select(TriageSummaryState.summary) triageSummary$: Observable<TriageSummary[]>;

    doubleMonitor: boolean;
    permessiFeature = PermissionFeatures;

    private subscription = new Subscription();

    constructor() {
    }

    ngOnInit(): void {
        console.log('Componente Scheda Richiesta creato');
        this.subscription.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
    }

    ngOnDestroy(): void {
        console.log('Componente Scheda Richiesta distrutto');
    }
}
