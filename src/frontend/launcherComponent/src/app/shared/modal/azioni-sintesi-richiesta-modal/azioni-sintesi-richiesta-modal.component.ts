import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Select, Store} from '@ngxs/store';
import {Utente} from '../../model/utente.model';
import {AuthState} from '../../../features/auth/store/auth.state';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {StatoRichiestaActions} from '../../enum/stato-richiesta-actions.enum';
import {
  calcolaActionSuggeritaRichiesta,
  makeCopy,
  statoRichiestaActionsEnumToStringArray,
  statoRichiestaColor
} from '../../helper/function';
import {ActionRichiestaModalComponent} from '../action-richiesta-modal/action-richiesta-modal.component';
import {
  ActionRichiesta,
  AllertaSede,
  ModificaStatoFonogramma
} from '../../../features/home/store/actions/richieste/richieste.actions';
import {TrasferimentoChiamataModalComponent} from '../trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import {
  ClearFormTrasferimentoChiamata,
  RequestAddTrasferimentoChiamata
} from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import {AllertaSedeModalComponent} from '../allerta-sede-modal/allerta-sede-modal.component';
import {ModificaEntiModalComponent} from '../modifica-enti-modal/modifica-enti-modal.component';
import {ModificaFonogrammaModalComponent} from '../modifica-fonogramma-modal/modifica-fonogramma-modal.component';
import {ClearEventiRichiesta, SetIdRichiestaEventi} from '../../../features/home/store/actions/eventi/eventi-richiesta.actions';
import {EventiRichiestaComponent} from '../../../features/home/eventi/eventi-richiesta.component';
import {ImpostazioniState} from '../../store/states/impostazioni/impostazioni.state';
import { PatchRichiesta } from '../../../features/home/store/actions/form-richiesta/richiesta-modifica.actions';


@Component({
  selector: 'app-azioni-sintesi-richiesta-modal',
  templateUrl: './azioni-sintesi-richiesta-modal.component.html',
  styleUrls: ['./azioni-sintesi-richiesta-modal.component.css']
})

export class AzioniSintesiRichiestaModalComponent implements OnInit, OnDestroy {

  @Select(AuthState.currentUser) user$: Observable<Utente>;
  utente: Utente;
  @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
  nightMode: boolean;

  subscription: Subscription = new Subscription();

  doubleMonitor: boolean;
  richiesta: SintesiRichiesta;
  statoRichiestaString: Array<StatoRichiestaActions>;


  constructor(private modal: NgbActiveModal, private store: Store, private modalService: NgbModal) {
    this.getUtente();
    this.getNightMode();
  }

  ngOnInit(): void {
    const exceptStati = [this.richiesta.stato, StatoRichiestaActions.Riaperta, calcolaActionSuggeritaRichiesta(this.richiesta)];
    this.statoRichiestaString = statoRichiestaActionsEnumToStringArray(exceptStati);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  getUtente(): void {
    this.subscription.add(
      this.user$.subscribe((user: Utente) => {
        this.utente = user;
      })
    );
  }

  onClick(stato: StatoRichiestaActions): void {
    let modalConferma;
    if (this.doubleMonitor) {
      modalConferma = this.modalService.open(ActionRichiestaModalComponent, {
        windowClass: 'modal-holder modal-left',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    } else {
      modalConferma = this.modalService.open(ActionRichiestaModalComponent, {
        windowClass: 'modal-holder',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    }
    modalConferma.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
    switch (stato) {
      case StatoRichiestaActions.Chiusa:
        modalConferma.componentInstance.titolo = 'Cambio Stato Richiesta';
        modalConferma.componentInstance.messaggio = 'Sei sicuro di voler chiudere la richiesta?';
        modalConferma.componentInstance.messaggioAttenzione = 'Tutti i mezzi di questa richiesta diventeranno "In Rientro"';
        break;

      case StatoRichiestaActions.Sospesa:
        modalConferma.componentInstance.titolo = 'Cambio Stato Richiesta';
        modalConferma.componentInstance.messaggio = 'Sei sicuro di voler sospendere la richiesta?';
        modalConferma.componentInstance.messaggioAttenzione = 'Tutti i mezzi di questa richiesta diventeranno "In Rientro"';
        break;

      case StatoRichiestaActions.Riaperta:
        modalConferma.componentInstance.titolo = 'Cambio Stato Richiesta';
        modalConferma.componentInstance.messaggio = 'Sei sicuro di voler riaprire la richiesta?';
        break;

      default:
        break;
    }
    modalConferma.componentInstance.bottoni = [
      { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
      { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
    ];

    const richiestaAction = {
      idRichiesta: null,
      stato,
      note: null
    };

    modalConferma.result.then(
      (val) => {
        switch (val.esito) {
          case 'ok':
            richiestaAction.note = val.note;
            richiestaAction.idRichiesta = this.richiesta.id;
            this.store.dispatch(new ActionRichiesta(richiestaAction));
            this.modal.close({ status: 'ko'});
            break;
          case 'ko':
            break;
        }
      }
    );
  }

  onAddTrasferimentoChiamata(codiceRichiesta: string): void {
    let addTrasferimentoChiamataModal;
    if (this.doubleMonitor) {
      addTrasferimentoChiamataModal = this.modalService.open(TrasferimentoChiamataModalComponent, {
        windowClass: 'modal-holder modal-left',
        backdropClass: 'light-blue-backdrop',
        centered: true,
        size: 'lg'
      });
    } else {
      addTrasferimentoChiamataModal = this.modalService.open(TrasferimentoChiamataModalComponent, {
        windowClass: 'modal-holder',
        backdropClass: 'light-blue-backdrop',
        centered: true,
        size: 'lg'
      });
    }
    addTrasferimentoChiamataModal.componentInstance.codRichiesta = codiceRichiesta;
    addTrasferimentoChiamataModal.result.then(
      (result: { success: boolean }) => {
        if (result.success) {
          this.addTrasferimentoChiamata();
        } else if (!result.success) {
          this.store.dispatch(new ClearFormTrasferimentoChiamata());
          console.log('Modal "addVoceTrasferimentoChiamata" chiusa con val ->', result);
        }
      },
      (err) => {
        this.store.dispatch(new ClearFormTrasferimentoChiamata());
        console.error('Modal chiusa senza bottoni. Err ->', err);
      }
    );
  }

  onAllertaSede(): void {
    let modalAllertaSede;
    if (this.doubleMonitor) {
      modalAllertaSede = this.modalService.open(AllertaSedeModalComponent, {
        windowClass: 'modal-holder modal-left',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    } else {
      modalAllertaSede = this.modalService.open(AllertaSedeModalComponent, {
        windowClass: 'modal-holder',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    }
    modalAllertaSede.componentInstance.codRichiesta = this.richiesta.codice;
    modalAllertaSede.result.then((res: { status: string, result: any }) => {
      switch (res.status) {
        case 'ok' :
          this.store.dispatch(new AllertaSede(res.result));
          break;
        case 'ko':
          break;
      }
    });
  }

  onModificaEntiIntervenuti(): void {
    let modalModificaEntiIntervenuti;
    if (this.doubleMonitor) {
      modalModificaEntiIntervenuti = this.modalService.open(ModificaEntiModalComponent, {
        windowClass: 'modal-holder modal-left',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    } else {
      modalModificaEntiIntervenuti = this.modalService.open(ModificaEntiModalComponent, {
        windowClass: 'modal-holder',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    }
    modalModificaEntiIntervenuti.componentInstance.enti = this.richiesta.listaEnti ? this.richiesta.listaEnti : null;
    modalModificaEntiIntervenuti.componentInstance.doubleMonitor = this.doubleMonitor;
    modalModificaEntiIntervenuti.componentInstance.listaEntiIntervenuti = this.richiesta.listaEntiIntervenuti ? this.richiesta.listaEntiIntervenuti : null;
    modalModificaEntiIntervenuti.result.then((res: { status: string, result: any }) => {
      switch (res.status) {
        case 'ok' :
          const mod = makeCopy(this.richiesta);
          mod.listaEnti = res.result.listaEnti;
          this.store.dispatch(new PatchRichiesta(mod as SintesiRichiesta));
          break;
        case 'ko':
          break;
      }
    });
  }

  onModificaStatoFonogramma(): void {
    let modalModificaStatoFonogramma;
    if (this.doubleMonitor) {
      modalModificaStatoFonogramma = this.modalService.open(ModificaFonogrammaModalComponent, {
        windowClass: 'modal-holder modal-left',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    } else {
      modalModificaStatoFonogramma = this.modalService.open(ModificaFonogrammaModalComponent, {
        windowClass: 'modal-holder',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    }
    modalModificaStatoFonogramma.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
    modalModificaStatoFonogramma.componentInstance.idRichiesta = this.richiesta.id;
    modalModificaStatoFonogramma.componentInstance.fonogramma = this.richiesta.fonogramma;
    modalModificaStatoFonogramma.result.then((res: { status: string, result: any }) => {
      switch (res.status) {
        case 'ok' :
          this.store.dispatch(new ModificaStatoFonogramma(res.result));
          break;
        case 'ko':
          break;
      }
    });
  }

  addTrasferimentoChiamata(): void {
    this.store.dispatch(new RequestAddTrasferimentoChiamata());
  }

  visualizzaEventiRichiesta(codice: string): void {
    this.store.dispatch(new SetIdRichiestaEventi(codice));
    let modal;
    if (this.doubleMonitor) {
      modal = this.modalService.open(EventiRichiestaComponent, {
        windowClass: 'xlModal modal-left',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    } else {
      modal = this.modalService.open(EventiRichiestaComponent, {
        windowClass: 'xlModal',
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
    }
    modal.result.then(() => {
      },
      () => this.store.dispatch(new ClearEventiRichiesta()));
  }

  chiudiModalAzioniSintesi(closeRes: string): void {
    if (closeRes) {
      this.modal.close({ status: 'ko'});
    }
  }

  calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta): StatoRichiestaActions {
    return calcolaActionSuggeritaRichiesta(richiesta);
  }

  statoRichiestaColor(richiesta: SintesiRichiesta): string {
    return statoRichiestaColor(richiesta.stato);
  }

}
