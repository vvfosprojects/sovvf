import { Component, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Select, Store} from '@ngxs/store';
import {ComposizioneSoccorsoAereoState} from '../../../features/home/store/states/composizione-partenza/composizione-soccorso-aereo.state';
import {makeCopy} from '../../helper/function';
import {AuthState} from '../../../features/auth/store/auth.state';
import {Utente} from '../../model/utente.model';


@Component({
  selector: 'app-soccorso-aereo-modal',
  templateUrl: './soccorso-aereo-modal.component.html',
  styleUrls: ['./soccorso-aereo-modal.component.css']
})

export class SoccorsoAereoModalComponent implements OnDestroy {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  utente: Utente;

  subscription: Subscription = new Subscription();
  tipologiaChecked = false;
  motivazione: string;
  azioniRichiesta: any[];

  constructor(private modal: NgbActiveModal, private store: Store) {
    this.getUtente();
    this.motivazione = null;
    this.azioniRichiesta = makeCopy(store.selectSnapshot(ComposizioneSoccorsoAereoState.azioniRichieste));
    this.azioniRichiesta.forEach(x => x.checked = false);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCheck(i: number): void {
    this.azioniRichiesta[i].checked = !this.azioniRichiesta[i].checked;
    this.tipologiaChecked = !!this.azioniRichiesta.find(x => x.checked);
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    if (closeRes === 'ok') {
      const obj = {
        motivazione: this.motivazione ? this.motivazione : null,
        tipologiaSelezionata: [],
        nome: this.utente.nome,
        cognome: this.utente.cognome,
        codiceFiscale: this.utente.codiceFiscale,
      };
      this.azioniRichiesta.forEach(x => x.checked ?  obj.tipologiaSelezionata.push(x.descrizione) : null);
      this.modal.close({
        status: 'ok',
        result: obj,
      });
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
