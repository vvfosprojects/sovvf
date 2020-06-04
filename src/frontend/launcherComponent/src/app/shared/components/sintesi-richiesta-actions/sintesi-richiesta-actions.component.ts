import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { calcolaActionSuggeritaRichiesta, statoRichiestaActionsEnumToStringArray, statoRichiestaColor } from '../../helper/function';
import { StatoRichiestaActions } from '../../enum/stato-richiesta-actions.enum';
import { ActionRichiestaModalComponent } from '../../modal/action-richiesta-modal/action-richiesta-modal.component';
import { RichiestaActionInterface } from '../../interface/richiesta-action.interface';

@Component({
    selector: 'app-sintesi-richiesta-actions',
    templateUrl: './sintesi-richiesta-actions.component.html',
    styleUrls: ['./sintesi-richiesta-actions.component.css']
})
export class SintesiRichiestaActionsComponent implements OnInit {

    @Input() richiesta: SintesiRichiesta;
    statoRichiestaString: Array<StatoRichiestaActions>;

    @Output() actionRichiesta: EventEmitter<RichiestaActionInterface> = new EventEmitter();

    constructor(dropdownConfig: NgbDropdownConfig,
                tooltipConfig: NgbTooltipConfig,
                private modalService: NgbModal) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit() {
        const exceptStati = [this.richiesta.stato, StatoRichiestaActions.Riaperta, calcolaActionSuggeritaRichiesta(this.richiesta)];
        this.statoRichiestaString = statoRichiestaActionsEnumToStringArray(exceptStati);
    }

    onClick(stato: StatoRichiestaActions) {
        const modalConferma = this.modalService.open(ActionRichiestaModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
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
            { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
            { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
        ];

        const richiestaAction = {
            'idRichiesta': null,
            'stato': stato,
            'note': null
        };

        modalConferma.result.then(
            (val) => {
                switch (val.esito) {
                    case 'ok':
                        richiestaAction.note = val.note;
                        this.actionRichiesta.emit(richiestaAction);
                        break;
                    case 'ko':
                        break;
                }
            }
        );
    }

    calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta) {
        return calcolaActionSuggeritaRichiesta(richiesta);
    }

    statoRichiestaColor(richiesta: SintesiRichiesta) {
        return statoRichiestaColor(richiesta.stato);
    }
}
