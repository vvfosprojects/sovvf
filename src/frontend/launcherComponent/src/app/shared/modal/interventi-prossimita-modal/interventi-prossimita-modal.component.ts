import {Component} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {HelperSintesiRichiesta} from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {Tipologia} from '../../model/tipologia.model';

@Component({
  selector: 'app-interventi-prossimita-modal',
  templateUrl: './interventi-prossimita-modal.component.html',
  styleUrls: ['./interventi-prossimita-modal.component.css']
})
export class InterventiProssimitaModalComponent {

  fissata = false;
  fissabile = true;
  isEspanso: boolean;
  espandibile = true;
  listaEventi = true;
  partenza = false;
  inGestione: boolean;
  gestibile = true;
  disabledGestisciRichiesta: boolean;
  disableFissaInAlto: boolean;
  modificabile = true;
  composizionePartenza = true;
  disabledModificaRichiesta: boolean;
  disabledComposizionePartenza: boolean;

  submitted: boolean;
  methods = new HelperSintesiRichiesta();
  live = true;
  richiesteFake = [ {}, {}, {}, {}, {}, {}, {}, {}, {}];

  public richiesta: any = {
    priorita: 3,
    istanteRicezioneRichiesta: 1,
    codiceRichiesta: 'RM1122000002',
    richiedente: {
      nominativo: 'Richiedente Test',
      telefono: '3333333333',
    },
    localita: {
      indirizzo: 'Via del Corso, Roma RM, Italia'
    },
    tipologie: [{
      descrizione: 'Esplosione da sostanza esplodente',
    }],
  };

  // Enum
  StatoRichiesta = {
    Chiamata: 'Chiamata',
    Sospesa: 'Sospesa',
    Presidiata: 'Presidiata',
    Assegnata: 'Assegnata',
    Chiusa: 'Chiusa'
  };

  constructor(public modal: NgbActiveModal) {
  }

  /* Eventi */
  richiestaClick(richiesta: SintesiRichiesta): void {
    /*
    if (richiesta) {
      this.isSingleClick = true;
      setTimeout(() => {
        if (this.isSingleClick) {
          this.clickRichiesta.emit(richiesta);
        }
      }, 250);
    }
    */
  }

  richiestaDoubleClick(richiesta: SintesiRichiesta): void {
    /*
    if (richiesta && this.espandibile) {
      this.isSingleClick = false;
      this.toggleEspanso(richiesta.id);
      this.doubleClickRichiesta.emit(richiesta);
    }
    */
  }

  richiestaHoverIn(richiesta: SintesiRichiesta): void {
    /*
    if (richiesta) {
      this.hoverIn.emit(richiesta.id);
    }
    */
  }

  richiestaHoverOut(richiesta: SintesiRichiesta): void {
    /*
    if (richiesta) {
      this.hoverOut.emit(richiesta.id);
    }
    */
  }

  toggleEspanso(id: string): void {
    /*
    if (this.espandibile) {
      this.espanso.emit();
      this.outEspansoId.emit(id);
    }
    */
  }

  fissaClick(richiesta: SintesiRichiesta): void {
    /*
    if (richiesta) {
      this.fissaInAlto.emit(richiesta);
    }
    */
  }

  visualizzaEventiRichiesta(codice: string): void {
    /*
    this.eventiRichiesta.emit(codice);
    */
  }

  onModificaRichiesta(): void {
    /*
    this.modificaRichiesta.emit(this.richiesta);
    */
  }

  onGestioneRichiesta(): void {
    /*
    this.gestioneRichiesta.emit(this.richiesta);
    */
  }

  invioPartenza(richiesta: SintesiRichiesta): void {
    /*
    if (richiesta) {
      this.nuovaPartenza.emit(richiesta);
    }
    */
  }

  getPrimaTipologia(richiesta: SintesiRichiesta): Tipologia {
    if (richiesta.tipologie && richiesta.tipologie.length > 0) {
      return richiesta.tipologie[0];
    } else {
      return null;
    }
  }

  getDescrizionePrimaTipologia(richiesta: SintesiRichiesta): string {
    if (richiesta.tipologie && richiesta.tipologie.length > 0) {
      return richiesta.tipologie[0].descrizione;
    } else {
      return '';
    }
  }

  onCancel(): void {
    this.modal.close({ status: 'ko', result: null });
  }

  onSubmit(): void {
    this.submitted = true;
    this.modal.close({ status: 'ok', result: this.submitted });
  }

}
