import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal, NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ListaEntiComponent, ListaSquadrePartenzaComponent } from '../../../../../shared';
import { TimeagoIntl } from 'ngx-timeago';
import { Store } from '@ngxs/store';
import { ActionMezzo } from '../../../store/actions/richieste/richieste.actions';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';
import { StatoRichiesta } from 'src/app/shared/enum/stato-richiesta.enum';
import { MezzoActionInterface } from '../../../../../shared/interface/mezzo-action.interface';
import { Partenza } from '../../../../../shared/model/partenza.model';

// Helper Methods
import { HelperSintesiRichiesta } from '../../helper/_helper-sintesi-richiesta';
import { calcolaActionSuggeritaMezzo } from '../../../../../shared/helper/function';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css'],
    providers: [
        NgbPopoverConfig,
        NgbTooltipConfig
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SintesiRichiestaComponent {
    @Input() richiesta: SintesiRichiesta;
    @Input() fissata: boolean;
    @Input() fissabile: boolean;
    @Input() espanso: boolean;
    @Input() espandibile: boolean;
    @Input() listaEventi: boolean;
    @Input() partenza: boolean;
    @Input() composizionePartenza = true;
    @Input() modificabile = true;
    @Input() gestibile = true;
    @Input() inGestione = true;

    @Output() clickRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() doubleClickRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() fissaInAlto: EventEmitter<any> = new EventEmitter();
    @Output() eventiRichiesta: EventEmitter<string> = new EventEmitter();
    @Output() nuovaPartenza: EventEmitter<any> = new EventEmitter();
    @Output() dismissNuovaPartenza: EventEmitter<any> = new EventEmitter();
    @Output() modificaRichiesta: EventEmitter<SintesiRichiesta> = new EventEmitter();
    @Output() gestioneRichiesta: EventEmitter<SintesiRichiesta> = new EventEmitter();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEspanso: EventEmitter<boolean> = new EventEmitter();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<string>();
    @Output() mezzoArrivatoSulPosto: EventEmitter<any> = new EventEmitter();

    methods = new HelperSintesiRichiesta;
    isSingleClick = true;
    live = true;

    // Enum
    StatoRichiesta = StatoRichiesta;

    constructor(private modalService: NgbModal,
                private store: Store,
                popoverConfig: NgbPopoverConfig,
                tooltipConfig: NgbTooltipConfig,
                intl: TimeagoIntl) {

        intl.strings = italianStrings;
        intl.changes.next();

        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    /* Eventi */
    richiestaClick(richiesta: any) {
        if (richiesta) {
            this.isSingleClick = true;
            setTimeout(() => {
                if (this.isSingleClick) {
                    this.clickRichiesta.emit(richiesta);
                }
            }, 250);
        }
    }

    richiestaDoubleClick(richiesta: any) {
        if (richiesta && this.espandibile) {
            this.isSingleClick = false;
            this.toggleEspanso();
            this.doubleClickRichiesta.emit(richiesta);
        }
    }

    fissaClick(richiesta: any) {
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

    visualizzaEventiRichiesta(idRichiesta: string) {
        this.eventiRichiesta.emit(idRichiesta);
    }

    invioPartenza(richiesta: any) {
        if (this.partenza) {
            this.dismissNuovaPartenza.emit();
        } else {
            this.nuovaPartenza.emit(richiesta);
        }
    }

    /* Layout Methods */
    toggleEspanso(): void {
        if (this.espandibile) {
            this.espanso = !this.espanso;
            this.onEspanso.emit(this.espanso);
        }
    }

    complessitaClass(richiesta: any) {
        return this.methods.complessitaClass(richiesta);
    }

    onModificaRichiesta() {
        this.modificaRichiesta.emit(this.richiesta);
    }

    onGestioneRichiesta() {
        this.gestioneRichiesta.emit(this.richiesta);
    }

    onListaEnti() {
        const modal = this.modalService.open(ListaEntiComponent, { windowClass: 'enti', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.listaEntiIntervenuti = this.richiesta.listaEntiIntervenuti ? this.richiesta.listaEntiIntervenuti : null;
        modal.componentInstance.listaEntiPresaInCarico = this.richiesta.listaEntiPresaInCarico ? this.richiesta.listaEntiPresaInCarico : null;
        modal.result.then(() => console.log('Lista Enti Aperta'),
            () => console.log('Lista Enti Chiusa'));
    }

    onListaSquadrePartenza(partenza: Partenza) {
        const modal = this.modalService.open(ListaSquadrePartenzaComponent, { windowClass: 'squadrePartenza', backdropClass: 'light-blue-backdrop', centered: true });
        const numeroPartenza = this.richiesta.partenzeRichiesta.indexOf(partenza) + 1;
        modal.componentInstance.numeroPartenza = numeroPartenza;
        modal.componentInstance.squadre = partenza.squadre;
        modal.result.then(() => console.log('Lista Squadre Partenza ' + numeroPartenza + ' Aperta'),
            () => console.log('Lista Squadre Partenza Chiusa'));
    }

    onActionMezzo(mezzoAction: MezzoActionInterface) {
        const obj = {
            'chiamata': this.richiesta,
            'idMezzo': mezzoAction.mezzo.codice,
            'statoMezzo': mezzoAction.action ? mezzoAction.action : calcolaActionSuggeritaMezzo(mezzoAction.mezzo)
        };
        // console.log('Action Mezzo', obj);
        this.store.dispatch(new ActionMezzo(obj));
    }
}
