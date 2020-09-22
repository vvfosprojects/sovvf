import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';
import { DettaglioFonogrammaModalComponent, ListaEntiComponent, ModificaFonogrammaModalComponent } from '../../../../../shared';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from 'src/app/shared/enum/stato-richiesta.enum';
import { MezzoActionInterface } from '../../../../../shared/interface/mezzo-action.interface';
import { RichiestaActionInterface } from '../../../../../shared/interface/richiesta-action.interface';
import { HelperSintesiRichiesta } from '../../helper/_helper-sintesi-richiesta';
import { EliminaPartenzaModalComponent } from '../../../../../shared';
import { ModificaStatoFonogrammaEmitInterface } from '../../../../../shared/interface/modifica-stato-fonogramma-emit.interface';
import { StatoFonogramma } from '../../../../../shared/enum/stato-fonogramma.enum';
import { ModificaEntiModalComponent } from 'src/app/shared/modal/modifica-enti-modal/modifica-enti-modal.component';
import { Store } from '@ngxs/store';
import { PatchRichiesta } from '../../../store/actions/richieste/richieste.actions';
import { makeCopy } from 'src/app/shared/helper/function';
import { TrasferimentoChiamataModalComponent } from 'src/app/shared/modal/trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { ClearFormTrasferimentoChiamata, RequestAddTrasferimentoChiamata } from 'src/app/shared/store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { AllertaSedeModalComponent } from '../../../../../shared/modal/allerta-sede-modal/allerta-sede-modal.component';
import { AllertaSedeEmitInterface } from '../../../../../shared/interface/allerta-sede-emit.interface';

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
    @Input() espanso: boolean;
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

    // Permessi
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
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEspanso = new EventEmitter();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<string>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() actionRichiesta = new EventEmitter<RichiestaActionInterface>();
    @Output() modificaStatoFonogramma = new EventEmitter<ModificaStatoFonogrammaEmitInterface>();
    @Output() allertaSede = new EventEmitter<AllertaSedeEmitInterface>();
    @Output() outEspansoId = new EventEmitter<string>();

    methods = new HelperSintesiRichiesta;
    isSingleClick = true;
    live = true;

    // Enum
    StatoRichiesta = StatoRichiesta;
    StatoFonogramma = StatoFonogramma;

    constructor(private modalService: NgbModal,
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
    richiestaClick(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.isSingleClick = true;
            setTimeout(() => {
                if (this.isSingleClick) {
                    this.clickRichiesta.emit(richiesta);
                }
            }, 250);
        }
    }

    richiestaDoubleClick(richiesta: SintesiRichiesta) {
        if (richiesta && this.espandibile) {
            this.isSingleClick = false;
            this.toggleEspanso(richiesta.id);
            this.doubleClickRichiesta.emit(richiesta);
        }
    }

    fissaClick(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.fissaInAlto.emit(richiesta);
        }
    }

    richiestaHoverIn(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.hoverIn.emit(richiesta.id);
        }
    }

    richiestaHoverOut(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.hoverOut.emit(richiesta.id);
        }
    }

    visualizzaEventiRichiesta(codice: string) {
        this.eventiRichiesta.emit(codice);
    }

    invioPartenza(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.nuovaPartenza.emit(richiesta);
        }
    }

    toggleEspanso(id: string): void {
        if (this.espandibile) {
            this.onEspanso.emit();
            this.outEspansoId.emit(id);
        }
    }

    complessitaClass(richiesta: SintesiRichiesta) {
        return this.methods.complessitaClass(richiesta);
    }

    onModificaRichiesta() {
        this.modificaRichiesta.emit(this.richiesta);
    }

    onGestioneRichiesta() {
        this.gestioneRichiesta.emit(this.richiesta);
    }

    getPresaInCaricoTooltip(utentiPresaInCaricoValue: any) {
        return {
            nominativo: utentiPresaInCaricoValue.nominativo.length <= 15 ? '' : utentiPresaInCaricoValue.nominativo,
            dataInizioAttivita: utentiPresaInCaricoValue.dataInizioAttivita
        };
    }

    getInLavorazioneTooltip(utentiInLavorazioneValue: any) {
        return utentiInLavorazioneValue.nominativo;
    }

    _inLavorazioneTooltipDisabled(utentiInLavorazioneValue: any) {
        return utentiInLavorazioneValue.nominativo.length <= 15;
    }

    onListaEnti() {
        const modal = this.modalService.open(ListaEntiComponent, { windowClass: 'enti', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.listaEntiIntervenuti = this.richiesta.listaEntiIntervenuti ? this.richiesta.listaEntiIntervenuti : null;
        modal.componentInstance.listaEntiPresaInCarico = this.richiesta.listaEntiPresaInCarico ? this.richiesta.listaEntiPresaInCarico : null;
        modal.result.then(() => console.log('Lista Enti Aperta'),
            () => console.log('Lista Enti Chiusa'));
    }

    onActionMezzo(mezzoAction: MezzoActionInterface) {
        const _mezzoAction = mezzoAction;
        _mezzoAction.codRichiesta = this.richiesta.codice;
        this.actionMezzo.emit(_mezzoAction);
    }

    onEliminaPartenza(targaMezzo: string) {
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

    onActionRichiesta(richiestaAction: RichiestaActionInterface) {
        richiestaAction.idRichiesta = this.richiesta.id;
        this.actionRichiesta.emit(richiestaAction);
    }

    onDettaglioStatoFonogramma() {
        const modalDettaglioFonogramma = this.modalService.open(DettaglioFonogrammaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalDettaglioFonogramma.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        modalDettaglioFonogramma.componentInstance.fonogramma = this.richiesta.fonogramma;
    }

    onModificaStatoFonogramma() {
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

    onAllertaSede() {
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

    onModificaEntiIntervenuti() {
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

    onAddTrasferimentoChiamata(codiceRichiesta: string) {
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

    addTrasferimentoChiamata() {
        this.store.dispatch(new RequestAddTrasferimentoChiamata());
    }

}
