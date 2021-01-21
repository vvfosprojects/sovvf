import {Component, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {Select, Store} from '@ngxs/store';
import {Utente} from '../../model/utente.model';
import {AuthState} from '../../../features/auth/store/auth.state';
import {CompPartenzaService} from '../../../core/service/comp-partenza-service/comp-partenza.service';
import {
  ComposizioneSoccorsoAereoState,
  DettaglioAFM
} from '../../../features/home/store/states/composizione-partenza/composizione-soccorso-aereo.state';


@Component({
  selector: 'app-dettaglio-soccorso-aereo-modal',
  templateUrl: './dettaglio-soccorso-aereo-modal.component.html',
  styleUrls: ['./dettaglio-soccorso-aereo-modal.component.css']
})

export class DettaglioSoccorsoAereoModalComponent implements OnDestroy {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  utente: Utente;
  @Select(ComposizioneSoccorsoAereoState.dettaglioAFM) dataAFM$: Observable<Utente>;
  dettaglioAFM: DettaglioAFM;

  subscription: Subscription = new Subscription();
  richiesta: SintesiRichiesta;
  showAttivita = true;
  showDettaglio = true;
  submitted: boolean;

  constructor(private modal: NgbActiveModal, private store: Store, private compPartenzaService: CompPartenzaService) {
    this.getUtente();
    this.getDettaglioAFM();
    this.showAttivita = true;
    this.showDettaglio = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onShowAttivita(): void {
    this.showAttivita = !this.showAttivita;
  }

  onShowDettaglio(): void {
    this.showDettaglio = !this.showDettaglio;
  }

  chiudiModalSoccorsoAereo(closeRes: string): void {
    if (closeRes === 'ok') {
      // caso modifica
      } else if (closeRes === 'mod') {
      // caso annullamento
      this.submitted = true;
      const obj = {
        codiceRichiesta: this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice,
        annullamento: {
          operatorName: this.utente.nome,
          operatorSurname: this.utente.cognome,
          operatorFiscalCode: this.utente.codiceFiscale,
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

  getDettaglioAFM(): void {
    this.subscription.add(
      this.dataAFM$.subscribe((data: any) => {
        this.dettaglioAFM = data;
      })
    );
  }
}
