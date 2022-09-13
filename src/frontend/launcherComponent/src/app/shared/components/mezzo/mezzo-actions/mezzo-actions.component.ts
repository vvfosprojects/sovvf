import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';
import { MezzoActionsModalComponent } from 'src/app/shared/modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { MezzoActionEmit } from '../../../interface/mezzo-action-emit.interface';
import { calcolaActionSuggeritaMezzo, statoMezzoActionColor, statoMezzoActionsEnumToStringArray } from '../../../helper/function-mezzo';
import { EventoMezzo } from '../../../interface/evento-mezzo.interface';
import { LockedConcorrenzaService } from '../../../../core/service/concorrenza-service/locked-concorrenza.service';
import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';
import { SintesiRichiesta } from '../../../model/sintesi-richiesta.model';
import { Partenza } from '../../../model/partenza.model';
import { AddConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/add-concorrenza-dto.interface';
import { AddConcorrenza } from '../../../store/actions/concorrenza/concorrenza.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css']
})
export class MezzoActionsComponent implements OnInit {

    @Input() richiesta: SintesiRichiesta;
    @Input() mezzo: Mezzo;
    @Input() codicePartenza: string;
    @Input() doubleMonitor: Mezzo;
    @Input() listaEventi: any;
    @Input() listaEventiMezzo: any;
    @Input() disabledModificaStatoMezzo: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionEmit> = new EventEmitter<MezzoActionEmit>();

    statoMezzoActions: StatoMezzoActions;
    statoMezzoString: string[];
    listaEventiMezzoUnique: EventoMezzo[] = [
        StatoMezzo.InViaggio,
        StatoMezzo.SulPosto,
        StatoMezzo.InRientro,
        StatoMezzo.Rientrato
    ].map(e => ({
        codiceMezzo: '',
        note: '',
        ora: '',
        stato: e,
    }));

    constructor(dropdownConfig: NgbDropdownConfig,
                tooltipConfig: NgbTooltipConfig,
                private modalService: NgbModal,
                private lockedConcorrenzaService: LockedConcorrenzaService,
                private store: Store) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit(): void {
        this.statoMezzoString = statoMezzoActionsEnumToStringArray([this.mezzo.stato, StatoMezzo.Istituto, calcolaActionSuggeritaMezzo(this.mezzo.stato)]);
        this.getListaEventiMezzo();
    }

    onClick(action?: string, ora?: string, event?: MouseEvent): void {
        if (!this.disabledModificaStatoMezzo && !this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.CambioStatoPartenza, [this.mezzo.codice])) {
            if (event) {
                event.stopPropagation();
            }
            let modal;
            const dataInViaggio = {
                anno: '',
                mese: '',
                giorno: '',
                ora: '',
                minuti: ''
            };
            if (ora) {
                const indexOra = ora.indexOf('T') + 1;
                const indexMin = ora.indexOf(':') + 1;
                const indexFirstCut = ora.indexOf('-') + 1;
                const indexSecondCut = ora.lastIndexOf('-') + 1;
                dataInViaggio.ora = ora.slice(indexOra, indexOra + 2);
                dataInViaggio.minuti = ora.slice(indexMin, indexMin + 2);
                dataInViaggio.anno = ora.slice(0, 4);
                dataInViaggio.mese = ora.slice(indexFirstCut, indexSecondCut - 1);
                dataInViaggio.giorno = ora.slice(indexSecondCut, indexOra - 1);
            }
            modal = this.modalService.open(MezzoActionsModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                size: 'lg',
                centered: true
            });
            const data = {
                value: this.mezzo.codice,
                type: TipoConcorrenzaEnum.CambioStatoPartenza
            } as AddConcorrenzaDtoInterface;
            this.store.dispatch(new AddConcorrenza([data]));
            modal.componentInstance.codicePartenza = this.codicePartenza;
            modal.componentInstance.statoMezzo = this.mezzo.stato;
            modal.componentInstance.codiceMezzo = this.mezzo.codice;
            modal.componentInstance.title = !ora ? 'Conferma' : 'Modifica';
            modal.componentInstance.action = action;
            modal.componentInstance.modificaOrario = !!ora;
            modal.componentInstance.titleStato = ': ' + action;
            modal.componentInstance.dataInViaggio = dataInViaggio;
            modal.componentInstance.listaEventi = this.listaEventi;
            modal.componentInstance.ultimoMezzo = this.richiesta.partenze.filter((p: Partenza) => !p.partenza.partenzaAnnullata && !p.partenza.sganciata && !p.partenza.terminata)?.length === 1;
            modal.result.then((res: { status: string, result: any }) => {
                switch (res.status) {
                    case 'ok':
                        if (action) {
                            this.statoMezzoActions = StatoMezzoActions[action.replace(' ', '')];
                            const orario = res.result.oraEvento;
                            const dataEvento = res.result.dataEvento;
                            const azioneIntervento = res.result.azioneIntervento;
                            this.actionMezzo.emit({
                                mezzoAction: this.statoMezzoActions,
                                oraEvento: { ora: orario.hour, minuti: orario.minute, secondi: orario.second },
                                dataEvento: { giorno: dataEvento.day, mese: dataEvento.month, anno: dataEvento.year },
                                azioneIntervento,
                                codicePartenza: this.codicePartenza,
                                modificaOrario: res.result.modificaOrario
                            });
                        } else {
                            this.actionMezzo.emit();
                        }
                        break;
                    case 'ko':
                        break;
                }
            });
        }
    }

    getListaEventiMezzo(): void {
        this.listaEventiMezzoUnique.forEach(x => x.codiceMezzo = this.listaEventiMezzo[0].codiceMezzo);
        this.listaEventiMezzoUnique.forEach(x => this.listaEventiMezzo.forEach(y => {
            if (x.stato === y.stato) {
                x.stato = y.stato ? y.stato : x.stato;
                x.ora = y.ora ? y.ora : null;
                x.note = y.note ? y.note : null;
            }
        }));
    }

    getBtnColor(stato: any): string {
        return statoMezzoActionColor(stato);
    }
}
