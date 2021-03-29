import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioFonogrammaModalComponent } from '../dettaglio-fonogramma-modal/dettaglio-fonogramma-modal.component';
import { RichiestaActionInterface } from '../../interface/richiesta-action.interface';
import { Partenza } from '../../model/partenza.model';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';

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
    modificabile = true;
    composizionePartenza = true;
    disabledModificaRichiesta: boolean;
    disabledComposizionePartenza: boolean;
    loadingEliminaPartenza = false;
    idDaSganciare = '';

    submitted: boolean;
    methods = new HelperSintesiRichiesta();
    live = true;
    StatoFonogramma: any;

    interventiVicinanze: SintesiRichiesta[];
    countInterventiVicinanze: number;

    // Enum
    StatoRichiesta = {
        Chiamata: 'Chiamata',
        Sospesa: 'Sospesa',
        Presidiata: 'Presidiata',
        Assegnata: 'Assegnata',
        Chiusa: 'Chiusa'
    };

    constructor(public modal: NgbActiveModal, private modalService: NgbModal) {
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

    getStatoFonogrammaStringByEnum(statoFonogramma: any): string {
        return;
        /*
        switch (statoFonogramma) {
          case StatoFonogramma.DaInviare:
            return 'Da Inviare';
          case StatoFonogramma.Inviato:
            return 'Inviato';
          case StatoFonogramma.NonNecessario:
            return 'Non Necessario';
        }
        */
    }

    onModificaStatoFonogramma(): void {
    }

    onModificaEntiIntervenuti(): void {
    }

    onListaEnti(): void {
    }

    complessitaClass(richiesta: SintesiRichiesta): any {
        return this.methods.complessitaClass(richiesta);
    }

    onAllertaSede(): void {
    }

    onAddTrasferimentoChiamata(codiceRichiesta: string): void {
    }

    onActionRichiesta(richiestaAction: RichiestaActionInterface): void {
        /*
        richiestaAction.idRichiesta = this.richiesta.id;
        this.actionRichiesta.emit(richiestaAction);
        */
    }

    getPresaInCaricoTooltip(utentiPresaInCaricoValue: any): any {
        return {
            nominativo: utentiPresaInCaricoValue.nominativo.length <= 15 ? '' : utentiPresaInCaricoValue.nominativo,
            dataInizioAttivita: utentiPresaInCaricoValue.dataInizioAttivita
        };
    }

    getInLavorazioneTooltip(utentiInLavorazioneValue: any): string {
        return utentiInLavorazioneValue.nominativo;
    }

    _inLavorazioneTooltipDisabled(utentiInLavorazioneValue: any): boolean {
        return utentiInLavorazioneValue.nominativo.length <= 15;
    }

    _isSostituzioneFineTurnoActive(partenze: Partenza[]): boolean {
        if (partenze?.length > 0) {
            return partenze.filter((p: Partenza) => !p.sganciata && !p.partenzaAnnullata && !p.terminata && p.mezzo.stato === StatoMezzo.SulPosto).length >= 2;
        }
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        /*
        mezzoAction.codRichiesta = this.richiesta.codice;
        this.actionMezzo.emit(mezzoAction);
        */
    }

    getDescrizionePrimaTipologia(richiesta: SintesiRichiesta): string {
        if (richiesta.tipologie && richiesta.tipologie.length > 0) {
            return richiesta.tipologie[0].descrizione;
        } else {
            return '';
        }
    }

    onDettaglioStatoFonogramma(r: SintesiRichiesta): void {
        let modalDettaglioFonogramma;
        modalDettaglioFonogramma = this.modalService.open(DettaglioFonogrammaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalDettaglioFonogramma.componentInstance.codiceRichiesta = r.codiceRichiesta ? r.codiceRichiesta : r.codice;
        modalDettaglioFonogramma.componentInstance.fonogramma = r.fonogramma;
    }

    onEliminaPartenza(targaMezzo: string): void {
    }

    onModificaPartenza(index: string): void {
    }

    onSostituzioneFineTurno(partenze: Partenza[]): void {
    }

    onCancel(): void {
        this.modal.close({ status: 'ko', result: null });
    }

    onSubmit(): void {
        this.submitted = true;
        this.modal.close({ status: 'ok', result: this.submitted });
    }

}
