import { Component, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Select, Store} from '@ngxs/store';
import {ComposizioneSoccorsoAereoState} from '../../../features/home/store/states/composizione-partenza/composizione-soccorso-aereo.state';
import {makeCopy} from '../../helper/function';
import {AuthState} from '../../../features/auth/store/auth.state';
import {Utente} from '../../model/utente.model';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {CompPartenzaService} from '../../../core/service/comp-partenza-service/comp-partenza.service';


@Component({
  selector: 'app-soccorso-aereo-modal',
  templateUrl: './soccorso-aereo-modal.component.html',
  styleUrls: ['./soccorso-aereo-modal.component.css']
})

export class SoccorsoAereoModalComponent implements OnDestroy {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  utente: Utente;

  richiesta: SintesiRichiesta;
  subscription: Subscription = new Subscription();
  tipologiaChecked = false;
  motivazione: string;
  azioniRichiesta: any[];
  submitted: boolean;
  inserimentoFallito: boolean;


  constructor(private modal: NgbActiveModal, private store: Store, private compPartenzaService: CompPartenzaService) {
    this.getUtente();
    this.motivazione = null;
    this.azioniRichiesta = makeCopy(store.selectSnapshot(ComposizioneSoccorsoAereoState.azioniRichieste));
    this.azioniRichiesta.forEach(x => x.checked = false);
    this.inserimentoFallito = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheck(i: number): void {
    this.azioniRichiesta[i].checked = !this.azioniRichiesta[i].checked;
    this.tipologiaChecked = !!this.azioniRichiesta.find(x => x.checked);
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    this.submitted = true;
    const requestType = [];
    this.azioniRichiesta.forEach(x => x.checked ?  requestType.push(x.descrizione) : null);
    if (closeRes === 'ok') {
      const obj: any = {
        description: this.motivazione ? this.motivazione : '',
        requestKey: this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice,
        requestType: requestType.join(', '),
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
}
