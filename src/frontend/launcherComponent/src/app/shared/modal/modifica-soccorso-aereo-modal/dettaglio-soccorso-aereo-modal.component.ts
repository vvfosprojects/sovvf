import { Component, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {Select, Store} from '@ngxs/store';
import {Utente} from '../../model/utente.model';
import {AuthState} from '../../../features/auth/store/auth.state';
import {CompPartenzaService} from '../../../core/service/comp-partenza-service/comp-partenza.service';


@Component({
  selector: 'app-dettaglio-soccorso-aereo-modal',
  templateUrl: './dettaglio-soccorso-aereo-modal.component.html',
  styleUrls: ['./dettaglio-soccorso-aereo-modal.component.css']
})

export class DettaglioSoccorsoAereoModalComponent implements OnDestroy {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  utente: Utente;

  subscription: Subscription = new Subscription();
  richiesta: SintesiRichiesta;
  showAttivita = true;
  submitted: boolean;
  attivita: any[] = [
     {
      stato: 'test1',
      aggiornamento: 'test2',
      nucleo: 'test3',
      velivolo: 'test4',
      categorie: 'test5',
      tempoStimato: 'test6',
      accettazione: 'test7',
      decollo: 'test8',
      arrivo: 'test9',
      rientro: 'test10',
      sede: 'test11'
    },
    {
      stato: 'aaaaa',
      aggiornamento: 'bbbb',
      nucleo: 'cccc',
      velivolo: 'ddddd',
      categorie: 'eeeeee',
      tempoStimato: 'fffff',
      accettazione: 'ggggg',
      decollo: 'hhhhhh',
      arrivo: 'iiiii',
      rientro: 'lllll',
      sede: 'mmmmm'
    },
  ];

  constructor(private modal: NgbActiveModal, private store: Store, private compPartenzaService: CompPartenzaService) {
    this.getUtente();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onShowAttivita(): void {
    this.showAttivita = !this.showAttivita;
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    if (closeRes === 'ok') {
      // caso modifica
      } else if (closeRes === 'mod') {
      // caso annullamento
      this.submitted = true;
      const date = new Date();
      const obj = {
        requestKey: this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice,
        payload: {
          operatorName: this.utente.nome,
          operatorSurname: this.utente.cognome,
          operatorFiscalCode: this.utente.codiceFiscale,
          dateTime: date,
        }
      };
      this.compPartenzaService.removeSoccorsoAereo(obj).subscribe(() => {
        this.modal.close({ status: 'ko' });
      }, () => this.submitted = false);
      } else { this.modal.close({ status: 'ko'}); }
  }

  getUtente(): void {
    this.subscription.add(
      this.user$.subscribe((user: Utente) => {
        this.utente = user;
      })
    );
  }
}
