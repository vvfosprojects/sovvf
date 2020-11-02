import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { StatoRichiesta } from 'src/app/shared/enum/stato-richiesta.enum';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { RichiestaActionInterface } from '../../interface/richiesta-action.interface';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';
import { ModificaStatoFonogrammaEmitInterface } from '../../interface/modifica-stato-fonogramma-emit.interface';
import { StatoFonogramma } from '../../enum/stato-fonogramma.enum';
import { ModificaEntiModalComponent } from 'src/app/shared/modal/modifica-enti-modal/modifica-enti-modal.component';
import { Store } from '@ngxs/store';
import { PatchRichiesta } from '../../../features/home/store/actions/richieste/richieste.actions';
import { makeCopy } from 'src/app/shared/helper/function';
import { TrasferimentoChiamataModalComponent } from 'src/app/shared/modal/trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { ClearFormTrasferimentoChiamata, RequestAddTrasferimentoChiamata } from 'src/app/shared/store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { AllertaSedeModalComponent } from '../../modal/allerta-sede-modal/allerta-sede-modal.component';
import { AllertaSedeEmitInterface } from '../../interface/allerta-sede-emit.interface';
import { ModificaPartenzaModalComponent } from 'src/app/shared/modal/modifica-partenza-modal/modifica-partenza-modal.component';
import { ListaEntiComponent } from '../lista-enti/lista-enti.component';
import { EliminaPartenzaModalComponent } from '../../modal/elimina-partenza-modal/elimina-partenza-modal.component';
import { DettaglioFonogrammaModalComponent } from '../../modal/dettaglio-fonogramma-modal/dettaglio-fonogramma-modal.component';
import { ModificaFonogrammaModalComponent } from '../../modal/modifica-fonogramma-modal/modifica-fonogramma-modal.component';
import { Tipologia } from '../../model/tipologia.model';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css'],
    providers: [NgbPopoverConfig, NgbTooltipConfig],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SintesiRichiestaComponent implements OnChanges {
    @Input() idDaSganciare = '';
    @Input() richiesta: SintesiRichiesta;
    @Input() fissata: boolean;
    @Input() fissabile: boolean;
    @Input() isEspanso: boolean;
    @Input() espandibile: boolean;
    @Input() listaEventi: boolean;
    @Input() partenza: boolean;
    @Input() inGestione: boolean;
    @Input() composizionePartenza = true;
    @Input() modificabile = true;
    @Input() gestibile = true;
    @Input() disableTooltips = false;
    @Input() disableFissaInAltro = false;
    @Input() loadingEliminaPartenza = false;
    @Input() disabledModificaRichiesta = false;
    @Input() disabledGestisciRichiesta = false;
    @Input() disabledComposizionePartenza = false;

    @Output() clickRichiesta = new EventEmitter<any>();
    @Output() doubleClickRichiesta = new EventEmitter<any>();
    @Output() fissaInAlto = new EventEmitter<any>();
    @Output() eventiRichiesta = new EventEmitter<string>();
    @Output() nuovaPartenza = new EventEmitter<any>();
    @Output() eliminaPartenza = new EventEmitter<{ targaMezzo: string, idRichiesta: string, modalResult: any }>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() espanso = new EventEmitter();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<string>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() actionRichiesta = new EventEmitter<RichiestaActionInterface>();
    @Output() modificaStatoFonogramma = new EventEmitter<ModificaStatoFonogrammaEmitInterface>();
    @Output() allertaSede = new EventEmitter<AllertaSedeEmitInterface>();
    @Output() outEspansoId = new EventEmitter<string>();

    methods = new HelperSintesiRichiesta();
    isSingleClick = true;
    live = true;

    // Enum
    StatoRichiesta = StatoRichiesta;
    StatoFonogramma = StatoFonogramma;

    constructor(private modalService: NgbModal,
                private activeModal: NgbActiveModal,
                private popoverConfig: NgbPopoverConfig,
                private tooltipConfig: NgbTooltipConfig,
                private intl: TimeagoIntl,
                private store: Store) {

        intl.strings = italianStrings;
        intl.changes.next();

        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.disableTooltips && changes.disableTooltips.currentValue) {
            if (changes.disableTooltips.currentValue) {
                this.tooltipConfig.disableTooltip = true;
            } else if (!changes.disableTooltips.currentValue) {
                this.tooltipConfig.disableTooltip = false;
            }
        }
    }

    /* Eventi */
    richiestaClick(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.isSingleClick = true;
            setTimeout(() => {
                if (this.isSingleClick) {
                    this.clickRichiesta.emit(richiesta);
                }
            }, 250);
        }
    }

    richiestaDoubleClick(richiesta: SintesiRichiesta): void {
        if (richiesta && this.espandibile) {
            this.isSingleClick = false;
            this.toggleEspanso(richiesta.id);
            this.doubleClickRichiesta.emit(richiesta);
        }
    }

    fissaClick(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.fissaInAlto.emit(richiesta);
        }
    }

    richiestaHoverIn(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.hoverIn.emit(richiesta.id);
        }
    }

    richiestaHoverOut(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.hoverOut.emit(richiesta.id);
        }
    }

    visualizzaEventiRichiesta(codice: string): void {
        this.eventiRichiesta.emit(codice);
    }

    invioPartenza(richiesta: SintesiRichiesta): void { // quuiiiii
        if (richiesta) {
            this.nuovaPartenza.emit(richiesta);
        }
    }

    toggleEspanso(id: string): void {
        if (this.espandibile) {
            this.espanso.emit();
            this.outEspansoId.emit(id);
        }
    }

    complessitaClass(richiesta: SintesiRichiesta): any {
        return this.methods.complessitaClass(richiesta);
    }

    onModificaRichiesta(): void {
        this.modificaRichiesta.emit(this.richiesta);
    }

    onGestioneRichiesta(): void {
        this.gestioneRichiesta.emit(this.richiesta);
    }

    getPresaInCaricoTooltip(utentiPresaInCaricoValue: any): any {
        return {
            nominativo: utentiPresaInCaricoValue.nominativo.length <= 15 ? '' : utentiPresaInCaricoValue.nominativo,
            dataInizioAttivita: utentiPresaInCaricoValue.dataInizioAttivita
        };
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

    getInLavorazioneTooltip(utentiInLavorazioneValue: any): string {
        return utentiInLavorazioneValue.nominativo;
    }

    _inLavorazioneTooltipDisabled(utentiInLavorazioneValue: any): boolean {
        return utentiInLavorazioneValue.nominativo.length <= 15;
    }

    onListaEnti(): void {
        const modal = this.modalService.open(ListaEntiComponent, {
            windowClass: 'enti',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modal.componentInstance.listaEntiIntervenuti = this.richiesta.listaEntiIntervenuti ? this.richiesta.listaEntiIntervenuti : null;
        modal.componentInstance.listaEntiPresaInCarico = this.richiesta.listaEntiPresaInCarico ? this.richiesta.listaEntiPresaInCarico : null;
        modal.result.then(() => console.log('Lista Enti Aperta'),
            () => console.log('Lista Enti Chiusa'));
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        mezzoAction.codRichiesta = this.richiesta.codice;
        this.actionMezzo.emit(mezzoAction);
    }

    onEliminaPartenza(targaMezzo: string): void {
        const modal = this.modalService.open(EliminaPartenzaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modal.componentInstance.targaMezzo = targaMezzo;
        modal.componentInstance.idRichiesta = this.richiesta.id;
        modal.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    this.eliminaPartenza.emit({ targaMezzo, idRichiesta: this.richiesta.id, modalResult: res.result });
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onModificaPartenza(index: string): void {
        const modalModificaPartenza = this.modalService.open(ModificaPartenzaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg',
            backdrop: 'static',
            keyboard: false
        });
        modalModificaPartenza.componentInstance.partenza = this.richiesta.partenzeRichiesta[index];
        const codiceRichiesta = this.richiesta.codice ? this.richiesta.codice : this.richiesta.codiceRichiesta;
        modalModificaPartenza.componentInstance.codRichiesta = codiceRichiesta;
        modalModificaPartenza.componentInstance.richiesta = this.richiesta;
        modalModificaPartenza.componentInstance.idRichiesta = this.richiesta.id;
        modalModificaPartenza.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onActionRichiesta(richiestaAction: RichiestaActionInterface): void {
        richiestaAction.idRichiesta = this.richiesta.id;
        this.actionRichiesta.emit(richiestaAction);
    }

    onDettaglioStatoFonogramma(): void {
        const modalDettaglioFonogramma = this.modalService.open(DettaglioFonogrammaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalDettaglioFonogramma.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        modalDettaglioFonogramma.componentInstance.fonogramma = this.richiesta.fonogramma;
    }

    onModificaStatoFonogramma(): void {
        const modalModificaStatoFonogramma = this.modalService.open(ModificaFonogrammaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalModificaStatoFonogramma.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        modalModificaStatoFonogramma.componentInstance.idRichiesta = this.richiesta.id;
        modalModificaStatoFonogramma.componentInstance.fonogramma = this.richiesta.fonogramma;
        modalModificaStatoFonogramma.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    this.modificaStatoFonogramma.emit(res.result);
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onAllertaSede(): void {
        const modalAllertaSede = this.modalService.open(AllertaSedeModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalAllertaSede.componentInstance.codRichiesta = this.richiesta.codice;
        modalAllertaSede.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    this.allertaSede.emit(res.result);
                    break;
                case 'ko':
                    break;
            }
        });
    }

    getStatoFonogrammaStringByEnum(statoFonogramma: StatoFonogramma): string {
        switch (statoFonogramma) {
            case StatoFonogramma.DaInviare:
                return 'Da Inviare';
            case StatoFonogramma.Inviato:
                return 'Inviato';
            case StatoFonogramma.NonNecessario:
                return 'Non Necessario';
        }
    }

    onModificaEntiIntervenuti(): void {
        const modalModificaEntiIntervenuti = this.modalService.open(ModificaEntiModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalModificaEntiIntervenuti.componentInstance.enti = this.richiesta.listaEnti ? this.richiesta.listaEnti : null;
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

    onAddTrasferimentoChiamata(codiceRichiesta: string): void {
        const addTrasferimentoChiamataModal = this.modalService.open(TrasferimentoChiamataModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
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

    addTrasferimentoChiamata(): void {
        this.store.dispatch(new RequestAddTrasferimentoChiamata());
    }

}
