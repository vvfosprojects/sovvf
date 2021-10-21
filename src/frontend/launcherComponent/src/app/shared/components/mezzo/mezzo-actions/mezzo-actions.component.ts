import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';
import { MezzoActionsModalComponent } from 'src/app/shared/modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { MezzoActionEmit } from '../../../interface/mezzo-action-emit.interface';
import { calcolaActionSuggeritaMezzo, statoMezzoActionColor, statoMezzoActionsEnumToStringArray } from '../../../helper/function-mezzo';
import { EventoMezzo } from '../../../interface/evento-mezzo.interface';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;
    @Input() doubleMonitor: Mezzo;
    @Input() listaEventi: any;
    @Input() listaEventiMezzo: any;

    @Output() actionMezzo: EventEmitter<MezzoActionEmit> = new EventEmitter<MezzoActionEmit>();

    statoMezzoActions: StatoMezzoActions;
    statoMezzoString: Array<string>;
    listaEventiMezzoUnique: EventoMezzo[] =
        [StatoMezzo.InViaggio, StatoMezzo.SulPosto, StatoMezzo.InRientro, StatoMezzo.Rientrato].map(e => ({
            codiceMezzo: '',
            note: '',
            ora: '',
            stato: e,
        }));

    constructor(
        dropdownConfig: NgbDropdownConfig,
        tooltipConfig: NgbTooltipConfig,
        private modalService: NgbModal
    ) {
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
        if (!ora || action === 'In Viaggio') {
            if (event) {
                event.stopPropagation();
            }
            let modal;
            modal = this.modalService.open(MezzoActionsModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                size: 'lg',
                centered: true
            });
            modal.componentInstance.statoMezzo = this.mezzo.stato;
            modal.componentInstance.title = !ora ? 'Conferma' : 'Modifica';
            modal.componentInstance.titleStato = !ora ? '' : ': ' + action;
            modal.componentInstance.listaEventi = this.listaEventi;
            modal.result.then((res: { status: string, result: any }) => {
                switch (res.status) {
                    case 'ok' :
                        if (action) {
                            this.statoMezzoActions = StatoMezzoActions[action.replace(' ', '')];
                            const orario = res.result.oraEvento;
                            const data = res.result.dataEvento;
                            const azioneIntervento = res.result.azioneIntervento;
                            this.actionMezzo.emit({
                                mezzoAction: this.statoMezzoActions,
                                oraEvento: { ora: orario.hour, minuti: orario.minute, secondi: orario.second },
                                dataEvento: { giorno: data.day, mese: data.month, anno: data.year },
                                azioneIntervento,
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
