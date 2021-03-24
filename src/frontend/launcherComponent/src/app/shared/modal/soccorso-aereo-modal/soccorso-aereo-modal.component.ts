import { Component, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Select, Store} from '@ngxs/store';
import {ComposizioneSoccorsoAereoState} from '../../../features/home/store/states/composizione-partenza/composizione-soccorso-aereo.state';
import {AuthState} from '../../../features/auth/store/auth.state';
import {Utente} from '../../model/utente.model';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {CompPartenzaService} from '../../../core/service/comp-partenza-service/comp-partenza.service';
import {makeCopy} from '../../helper/function';
import {ImpostazioniState} from '../../store/states/impostazioni/impostazioni.state';


@Component({
  selector: 'app-soccorso-aereo-modal',
  templateUrl: './soccorso-aereo-modal.component.html',
  styleUrls: ['./soccorso-aereo-modal.component.css']
})

export class SoccorsoAereoModalComponent implements OnDestroy {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  utente: Utente;
  @Select(ComposizioneSoccorsoAereoState.azioniRichieste) azioniRichiesta$: Observable<boolean>;
  azioniRichiesta: any[];
  @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
  nightMode: boolean;

  richiesta: SintesiRichiesta;
  subscription: Subscription = new Subscription();
  tipologiaChecked = false;
  motivazione: string;
  submitted: boolean;
  inserimentoFallito: boolean;


  constructor(private modal: NgbActiveModal, private store: Store, private compPartenzaService: CompPartenzaService) {
    this.getUtente();
    this.getAzioniRichiesta();
    this.getNightMode();
    this.motivazione = null;
    this.inserimentoFallito = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheck(i: number): void {
    this.azioniRichiesta[i].checked = !this.azioniRichiesta[i].checked;
    this.tipologiaChecked = !!this.azioniRichiesta.find(x => x.checked);
  }

  getNightMode(): void {
    this.subscription.add(
      this.nightMode$.subscribe((nightMode: boolean) => {
        this.nightMode = nightMode;
      })
    );
  }

  onNightMode(): string {
    let value = '';
    if (!this.nightMode) {
      value = '';
    } else if (this.nightMode) {
      value = 'moon-text moon-mode';
    }
    return value;
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    this.submitted = true;
    const requestType = [];
    const requestTypeCode = [];
    this.azioniRichiesta.forEach(x => x.checked ?  requestType.push(x.descrizione) : null);
    this.azioniRichiesta.forEach(x => x.checked ?  requestTypeCode.push(x.codice) : null);
    if (closeRes === 'ok') {
      const obj: any = {
        description: this.motivazione ? this.motivazione : '',
        requestKey: this.richiesta.codice,
        requestType: requestType.join(', '),
        requestTypeCode: '',
        operatorName: this.utente.nome,
        operatorSurname: this.utente.cognome,
        operatorFiscalCode: this.utente.codiceFiscale,
        lat: this.richiesta.localita.coordinate.latitudine,
        lng: this.richiesta.localita.coordinate.longitudine,
      };
      this.compPartenzaService.addSoccorsoAereo(obj).subscribe(() => {
        this.modal.close({ status: 'ok' });
      }, () => { this.submitted = false; this.inserimentoFallito = true; });
    } else {
      this.modal.close({ status: 'ko'});
    }
  }

  getUtente(): void {
    this.subscription.add(
      this.user$.subscribe((user: Utente) => {
        this.utente = user;
      })
    );
  }

  getAzioniRichiesta(): void {
    this.subscription.add(
      this.azioniRichiesta$.subscribe((azioniRichiesta: any) => {
        this.azioniRichiesta = makeCopy(azioniRichiesta);
        this.azioniRichiesta.forEach(x => x.checked = false);
      })
    );
  }

}
