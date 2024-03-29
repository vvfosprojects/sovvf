import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { StatoRichiesta } from 'src/app/shared/enum/stato-richiesta.enum';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';
import { StatoFonogramma } from '../../enum/stato-fonogramma.enum';
import { Select, Store } from '@ngxs/store';
import { ModificaPartenzaModalComponent } from 'src/app/shared/modal/modifica-partenza-modal/modifica-partenza-modal.component';
import { ListaEntiComponent } from '../lista-enti/lista-enti.component';
import { DettaglioFonogrammaModalComponent } from '../../modal/dettaglio-fonogramma-modal/dettaglio-fonogramma-modal.component';
import { Partenza } from '../../model/partenza.model';
import { SostituzionePartenzeFineTunoModalComponent } from '../../modal/sostituzione-partenze-fine-turno-modal/sostituzione-partenze-fine-tuno-modal.component';
import { SetListaPartenzeSostituzioneFineTurno } from '../../store/actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { Observable } from 'rxjs';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { DettaglioSoccorsoAereoModalComponent } from '../../modal/dettaglio-soccorso-aereo-modal/dettaglio-soccorso-aereo-modal.component';
import { ApplyFiltriTipologiaSelezionatiRichieste } from '../../../features/home/store/actions/filterbar/filtri-richieste.actions';
import { GetDettaglioSoccorsoAereo, GetEventiSoccorsoAereo } from '../../../features/home/store/actions/composizione-partenza/composizione-soccorso-aereo.actions';
import { AzioniSintesiRichiestaModalComponent } from '../../modal/azioni-sintesi-richiesta-modal/azioni-sintesi-richiesta-modal.component';
import { defineChiamataIntervento } from '../../helper/function-richieste';
import { checkNumeroPartenzeAttive } from '../../helper/function-richieste';
import { EnteInterface } from '../../interface/ente.interface';
import { OpenDettaglioSchedaContatto } from '../../../features/home/store/actions/schede-contatto/schede-contatto.actions';
import { ClearMezzoInServizioSelezionato, SetMezzoInServizioSelezionato } from '../../../features/home/store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { Mezzo } from '../../model/mezzo.model';
import { MezziInServizioState } from '../../../features/home/store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { PosDettaglioModalComponent } from '../../modal/pos-dettaglio-modal/pos-dettaglio-modal.component';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { nomeStatiSquadra } from '../../helper/function-composizione';
import { AddConcorrenzaDtoInterface } from '../../interface/dto/concorrenza/add-concorrenza-dto.interface';
import { AddConcorrenza, DeleteConcorrenza } from '../../store/actions/concorrenza/concorrenza.actions';
import { ClearRichiestaAzioni, SetRichiestaAzioni } from '../../../features/home/store/actions/richieste/richieste.actions';
import { InfoMezzo } from '../../store/states/loading/loading.state';
import * as province from '../../../../assets/province/province.json';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css']
})
export class SintesiRichiestaComponent implements OnInit, OnChanges {

    @Input() richiesta: SintesiRichiesta;
    @Input() selezionata: boolean;
    @Input() fissata: boolean;
    @Input() boxAzioni: boolean;
    @Input() fissabile: boolean;
    @Input() partenza: boolean;
    @Input() inGestione: boolean;
    @Input() borderTop = true;
    @Input() composizionePartenza = true;
    @Input() modificabile = true;
    @Input() gestibile = true;
    @Input() sostituzioneFineTurno: boolean;
    @Input() idDaSganciare: string;
    @Input() disableTooltips: boolean;
    @Input() disableFissaInAlto: boolean;
    @Input() loadingActionMezzo: string[];
    @Input() loadingDettaglioSchedaContatto: string;
    @Input() disabledModificaRichiesta: boolean;
    @Input() disabledGestisciRichiesta: boolean;
    @Input() disabledAzioniRichiesta: boolean;
    @Input() disabledModificaStatoMezzo: boolean;
    @Input() disabledComposizionePartenza: boolean;
    @Input() hideSostituzioneFineTurno: boolean;
    @Input() hideGestisciPartenza: boolean;
    @Input() listaEnti: EnteInterface[];
    @Input() nightMode: boolean;
    @Input() annullaStatoMezzi: InfoMezzo[];

    @Output() clickRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() clickIndirizzo = new EventEmitter<SintesiRichiesta>();
    @Output() fissaInAlto = new EventEmitter<SintesiRichiesta>();
    @Output() nuovaPartenza = new EventEmitter<SintesiRichiesta>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() deseleziona = new EventEmitter<boolean>();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<string>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();

    @Select(ViewComponentState.mapsIsActive) mapsIsActive$: Observable<boolean>;

    methods = new HelperSintesiRichiesta();
    live = true;

    // Enum
    StatoRichiesta = StatoRichiesta;
    StatoFonogramma = StatoFonogramma;
    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor(private modalService: NgbModal,
                private popoverConfig: NgbPopoverConfig,
                private tooltipConfig: NgbTooltipConfig,
                private intl: TimeagoIntl,
                private store: Store) {

        this.intl.strings = italianStrings;
        this.intl.changes.next();
        this.popoverConfig.container = 'body';
        this.popoverConfig.placement = 'top';
        this.tooltipConfig.container = 'body';
        this.tooltipConfig.placement = 'top';
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.disableTooltips?.currentValue) {
            if (changes.disableTooltips.currentValue) {
                this.tooltipConfig.disableTooltip = true;
            } else if (!changes.disableTooltips.currentValue) {
                this.tooltipConfig.disableTooltip = false;
            }
        }
    }

    richiestaClick(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.clickRichiesta.emit(richiesta);
        }
    }

    getIndirizzoFormatted(): string {
        let indirizzo = this.richiesta?.localita?.indirizzo;
        if (this.richiesta?.localita?.provincia) {
            indirizzo = indirizzo + ', ' + this.richiesta?.localita?.citta;
            if (this.richiesta?.localita?.citta !== this.richiesta?.localita?.provincia) {
                const provinceData = province['default']['province'][0];
                const codProvincia = provinceData[this.richiesta?.localita?.provincia];
                indirizzo = indirizzo + ' (' + codProvincia + ')';
            }
        }
        return indirizzo;
    }

    indirizzoClick(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.clickIndirizzo.emit(richiesta);
        }
    }

    checkDettaglioSoccorsoAereo(): boolean {
        if (this.richiesta?.eventi) {
            const afmAccettato = this.richiesta.eventi.filter(x => x.note?.includes('Inserimento soccorso AFM accettato: Attesa assegnazione SOCAV'));
            const afmAnnullato = this.richiesta.eventi.filter(x => x.note?.includes('Annullamento soccorso AFM accettato: Annullato'));
            return afmAccettato.length > afmAnnullato.length;
        }
        return false;
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

    invioPartenza(richiesta: SintesiRichiesta): void {
        const competenzeDefault = [];
        richiesta.codUOCompetenza.forEach(x => competenzeDefault.push(x));
        if (richiesta) {
            this.nuovaPartenza.emit(richiesta);
        }
    }

    defineChiamataIntervento(codice: string, codiceRichiesta: string): string {
        return defineChiamataIntervento(codice, codiceRichiesta);
    }

    complessitaClass(richiesta: SintesiRichiesta): any {
        return this.methods.complessitaClass(richiesta);
    }

    onModificaRichiesta(): void {
        this.modificaRichiesta.emit(this.richiesta);
    }

    onGestioneRichiesta(event: any): void {
        this.gestioneRichiesta.emit(this.richiesta);
        if (this.selezionata) {
            event.stopPropagation();
        }
    }

    getPresaInCaricoTooltip(utentiPresaInCaricoValue: any): any {
        return {
            nominativo: utentiPresaInCaricoValue.nominativo.length <= 15 ? '' : utentiPresaInCaricoValue.nominativo,
            dataInizioAttivita: utentiPresaInCaricoValue.dataInizioAttivita
        };
    }

    _isSostituzioneFineTurnoActive(partenze: Partenza[]): boolean {
        return partenze?.filter((p: Partenza) => !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata && p.partenza.mezzo.stato === StatoMezzo.SulPosto).length >= 2;
    }

    checkNumeroPartenzeAttive(partenze: Partenza[]): number {
        return checkNumeroPartenzeAttive(partenze);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

    onDettaglioSchedaContatto(codiceScheda: string): void {
        if (codiceScheda && !this.loadingDettaglioSchedaContatto) {
            this.store.dispatch(new OpenDettaglioSchedaContatto(codiceScheda));
        }
    }

    onListaEnti(): void {
        let modal;
        modal = this.modalService.open(ListaEntiComponent, {
            windowClass: 'enti',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            backdrop: true
        });

        const listaEntiIntervenuti = this.methods._getEntiByCod(this.listaEnti, this.richiesta.codEntiIntervenuti);
        modal.componentInstance.listaEntiIntervenuti = listaEntiIntervenuti ? listaEntiIntervenuti : null;
        modal.componentInstance.listaEntiPresaInCarico = this.richiesta.listaEntiPresaInCarico ? this.richiesta.listaEntiPresaInCarico : null;
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        mezzoAction.codRichiesta = this.richiesta.codice;
        this.actionMezzo.emit(mezzoAction);
    }

    onModificaPartenza(index: string): void {
        let modalModificaPartenza;
        modalModificaPartenza = this.modalService.open(ModificaPartenzaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'xl',
            backdrop: 'static',
            keyboard: false
        });
        modalModificaPartenza.componentInstance.singolaPartenza = this.richiesta.partenze[index];
        modalModificaPartenza.componentInstance.codRichiesta = this.richiesta.codice ? this.richiesta.codice : this.richiesta.codiceRichiesta;
        modalModificaPartenza.componentInstance.richiesta = this.richiesta;
        const data = {
            value: this.richiesta.partenze[index].codiceMezzo,
            type: TipoConcorrenzaEnum.GestisciPartenza
        } as AddConcorrenzaDtoInterface;
        this.store.dispatch(new AddConcorrenza([data]));
        modalModificaPartenza.result.then((res: { status: string, result: any }) => {
            this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.GestisciPartenza, [this.richiesta.partenze[index].codiceMezzo]));
            switch (res.status) {
                case 'ok' :
                    break;
                case 'ko':
                    break;
            }
        }, () => this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.GestisciPartenza, [this.richiesta.partenze[index].codiceMezzo])));
    }

    onDettaglioStatoFonogramma(): void {
        let modalDettaglioFonogramma;
        modalDettaglioFonogramma = this.modalService.open(DettaglioFonogrammaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            backdrop: true,
        });
        modalDettaglioFonogramma.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        modalDettaglioFonogramma.componentInstance.titolo = !this.richiesta.codiceRichiesta ? 'Chiamata' : 'Intervento';
        modalDettaglioFonogramma.componentInstance.fonogramma = this.richiesta.fonogramma;
    }

    onDettaglioPos(): void {
        let modalDettaglioPos;
        modalDettaglioPos = this.modalService.open(PosDettaglioModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            size: 'lg',
            centered: true,
        });
        modalDettaglioPos.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        modalDettaglioPos.componentInstance.pos = this.richiesta.dettaglioTipologia?.pos ? this.richiesta.dettaglioTipologia.pos : null;
        modalDettaglioPos.componentInstance.titolo = !this.richiesta.codiceRichiesta ? 'Chiamata: ' : 'Intervento: ';
    }

    onSostituzioneFineTurno(partenze: Partenza[]): void {
        let modalSostituzioneFineTurno;
        modalSostituzioneFineTurno = this.modalService.open(SostituzionePartenzeFineTunoModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            size: 'xl',
            centered: true
        });
        const partenzeDisponibili = partenze.filter((p: Partenza) => !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata && p.partenza.mezzo.stato === StatoMezzo.SulPosto);
        this.store.dispatch(new SetListaPartenzeSostituzioneFineTurno(partenzeDisponibili));
        modalSostituzioneFineTurno.componentInstance.idRichiesta = this.richiesta.id;
        modalSostituzioneFineTurno.componentInstance.codRichiesta = this.richiesta.codice;
        modalSostituzioneFineTurno.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onSelezioneMezzoPartenza(mezzo: Mezzo): void {
        const idMezzoInServizioSelezionato = this.store.selectSnapshot(MezziInServizioState.idMezzoInServizioSelezionato);
        if (idMezzoInServizioSelezionato === mezzo.codice) {
            this.store.dispatch(new ClearMezzoInServizioSelezionato());
            setTimeout(() => {
                this.store.dispatch(new SetMezzoInServizioSelezionato(mezzo.codice));
            }, 1);
        } else {
            this.store.dispatch(new SetMezzoInServizioSelezionato(mezzo.codice));
        }
    }

    openDettaglioSoccorsoAereoModal(open: any): void {
        let modalOptions;
        if (open) {
            modalOptions = {
                windowClass: 'xlModal modal-holder',
                backdrop: 'static',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                keyboard: false,
                size: 'xl',
            } as NgbModalOptions;
        }
        const modal = this.modalService.open(DettaglioSoccorsoAereoModalComponent, modalOptions);
        const requestKey = this.richiesta.codice;
        this.store.dispatch(new GetDettaglioSoccorsoAereo(requestKey));
        this.store.dispatch(new GetEventiSoccorsoAereo(requestKey));
        modal.componentInstance.richiesta = this.richiesta;
        modal.result.then((res: string) => {
            switch (res) {
                case 'ok':
                    this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onShowAzioniRichiesta(): void {
        let modalOptions;
        if (open) {
            modalOptions = {
                windowClass: '',
                backdrop: 'static',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                keyboard: false,
                size: 'xl',
            } as NgbModalOptions;
        }
        this.store.dispatch(new ClearRichiestaAzioni());
        const modal = this.modalService.open(AzioniSintesiRichiestaModalComponent, modalOptions);
        this.store.dispatch(new SetRichiestaAzioni(this.richiesta.codice));
        modal.result.then(() => {
            this.store.dispatch(new ClearRichiestaAzioni());
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
}
