import { Component, OnInit } from '@angular/core';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { Select } from '@ngxs/store';
import { TipologieState } from '../../../../shared/store/states/tipologie/tipologie.state';
import { Utente } from '../../../../shared/model/utente.model';
import { AuthState } from '../../../auth/store/auth.state';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedaTelefonataState } from '../../store/states/form-richiesta/scheda-telefonata.state';
import { Sede } from '../../../../shared/model/sede.model';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { EntiState } from '../../../../shared/store/states/enti/enti.state';
import { Ente } from '../../../../shared/interface/ente.interface';
import { RichiestaModificaState } from '../../store/states/form-richiesta/richiesta-modifica.state';
import { DettagliTipologieState } from '../../../../shared/store/states/dettagli-tipologie/dettagli-tipologie.state';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { TriageSummaryState } from '../../../../shared/store/states/triage-summary/triage-summary.state';
import { TriageSummary } from '../../../../shared/interface/triage-summary.interface';
import { PosInterface } from '../../../../shared/interface/pos.interface';
import { PermissionFeatures } from '../../../../shared/enum/permission-features.enum';

@Component({
    selector: 'app-modal-nuova-chiamata',
    templateUrl: './modal-nuova-chiamata.component.html',
    styleUrls: ['./modal-nuova-chiamata.component.scss']
})
export class ModalNuovaChiamataComponent {

    @Select(SchedaTelefonataState.competenze) competenze$: Observable<Sede[]>;
    @Select(SchedaTelefonataState.countInterventiProssimita) countInterventiProssimita$: Observable<number>;
    @Select(SchedaTelefonataState.interventiProssimita) interventiProssimita$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.countInterventiStessaVia) countInterventiStessaVia$: Observable<number>;
    @Select(SchedaTelefonataState.interventiStessaVia) interventiStessaVia$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.countInterventiChiusiStessoIndirizzo) countInterventiChiusiStessoIndirizzo$: Observable<number>;
    @Select(SchedaTelefonataState.interventiChiusiStessoIndirizzo) interventiChiusiStessoIndirizzo$: Observable<SintesiRichiesta[]>;
    @Select(SchedaTelefonataState.resetChiamata) resetChiamata$: Observable<boolean>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<Ente[]>;

    // Loading
    @Select(SchedaTelefonataState.loadingNuovaChiamata) loadingNuovaChiamata$: Observable<boolean>;
    loadingNuovaChiamata: boolean;

    // Modifica Richiesta
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;

    // Dettagli Tipologie
    @Select(DettagliTipologieState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;

    // Triage Summary
    @Select(TriageSummaryState.summary) triageSummary$: Observable<TriageSummary[]>;

    // Pos Summary
    @Select(TriageSummaryState.pos) pos$: Observable<PosInterface[]>;

    lat: number;
    lon: number;
    address: string;

    permessiFeature = PermissionFeatures;

    constructor(private activeModal: NgbActiveModal) {
    }

    close(): void {
        this.activeModal.close('ko');
    }

}
