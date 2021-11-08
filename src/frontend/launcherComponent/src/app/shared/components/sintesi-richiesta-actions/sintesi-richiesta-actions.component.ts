import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { StatoRichiestaActions } from '../../enum/stato-richiesta-actions.enum';
import { ActionRichiestaModalComponent } from '../../modal/action-richiesta-modal/action-richiesta-modal.component';
import { RichiestaActionInterface } from '../../interface/richiesta-action.interface';
import { calcolaActionSuggeritaRichiesta, defineChiamataIntervento, statoRichiestaActionsEnumToStringArray, statoRichiestaColor } from '../../helper/function-richieste';

@Component({
    selector: 'app-sintesi-richiesta-actions',
    templateUrl: './sintesi-richiesta-actions.component.html',
    styleUrls: ['./sintesi-richiesta-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SintesiRichiestaActionsComponent implements OnInit {

    @Input() richiesta: SintesiRichiesta;

    @Output() actionRichiesta: EventEmitter<RichiestaActionInterface> = new EventEmitter();

    statoRichiestaString: Array<StatoRichiestaActions>;

    constructor(dropdownConfig: NgbDropdownConfig,
                tooltipConfig: NgbTooltipConfig,
                private modalService: NgbModal) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit(): void {
        const exceptStati = [this.richiesta.stato, StatoRichiestaActions.Riaperta, calcolaActionSuggeritaRichiesta(this.richiesta)];
        this.statoRichiestaString = statoRichiestaActionsEnumToStringArray(exceptStati);
    }

    onClick(stato: StatoRichiestaActions): void {
        let modalConferma;
        modalConferma = this.modalService.open(ActionRichiestaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConferma.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        switch (stato) {
            case StatoRichiestaActions.Chiusa:
                modalConferma.componentInstance.titolo = 'Cambio Stato ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta);
                modalConferma.componentInstance.messaggio = 'Sei sicuro di voler chiudere ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + '?';
                modalConferma.componentInstance.messaggioAttenzione = 'Lo stato di tutti i mezzi sarà "Rientrato"';
                break;

            case StatoRichiestaActions.Sospesa:
                modalConferma.componentInstance.titolo = 'Cambio Stato ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta);
                modalConferma.componentInstance.messaggio = 'Sei sicuro di voler sospendere ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + '?';
                modalConferma.componentInstance.messaggioAttenzione = 'Lo stato di tutti i mezzi sarà "Rientrato"';
                break;

            case StatoRichiestaActions.Riaperta:
                modalConferma.componentInstance.titolo = 'Cambio Stato ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta);
                modalConferma.componentInstance.messaggio = 'Sei sicuro di voler riaprire ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + '?';
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
                        this.actionRichiesta.emit(richiestaAction);
                        break;
                    case 'ko':
                        break;
                }
            }
        );
    }

    calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta): StatoRichiestaActions {
        return calcolaActionSuggeritaRichiesta(richiesta);
    }

    statoRichiestaColor(richiesta: SintesiRichiesta): string {
        return statoRichiestaColor(richiesta.stato);
    }
}
