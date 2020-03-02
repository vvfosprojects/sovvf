import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal, NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ListaEntiComponent } from '../../../../../shared';
import { TimeagoIntl } from 'ngx-timeago';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';
import { StatoRichiesta } from 'src/app/shared/enum/stato-richiesta.enum';
import { MezzoActionInterface } from '../../../../../shared/interface/mezzo-action.interface';

// Helper Methods
import { HelperSintesiRichiesta } from '../../helper/_helper-sintesi-richiesta';
import { RichiestaActionInterface } from '../../../../../shared/interface/richiesta-action.interface';

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
    @Input() inGestione: boolean;
    @Input() composizionePartenza = true;
    @Input() modificabile = true;
    @Input() gestibile = true;

    @Output() clickRichiesta = new EventEmitter<any>();
    @Output() doubleClickRichiesta = new EventEmitter<any>();
    @Output() fissaInAlto = new EventEmitter<any>();
    @Output() eventiRichiesta = new EventEmitter<string>();
    @Output() nuovaPartenza = new EventEmitter<any>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEspanso = new EventEmitter();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<string>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() actionRichiesta = new EventEmitter<RichiestaActionInterface>();
    @Output() outEspansoId = new EventEmitter<string>();

    methods = new HelperSintesiRichiesta;
    isSingleClick = true;
    live = true;

    // Enum
    StatoRichiesta = StatoRichiesta;

    constructor(private modalService: NgbModal,
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

    visualizzaEventiRichiesta(idRichiesta: string) {
        this.eventiRichiesta.emit(idRichiesta);
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

    onListaEnti() {
        const modal = this.modalService.open(ListaEntiComponent, { windowClass: 'enti', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.listaEntiIntervenuti = this.richiesta.listaEntiIntervenuti ? this.richiesta.listaEntiIntervenuti : null;
        modal.componentInstance.listaEntiPresaInCarico = this.richiesta.listaEntiPresaInCarico ? this.richiesta.listaEntiPresaInCarico : null;
        modal.result.then(() => console.log('Lista Enti Aperta'),
            () => console.log('Lista Enti Chiusa'));
    }

    onActionMezzo(mezzoAction: MezzoActionInterface) {
        const _mezzoAction = mezzoAction;
        _mezzoAction.richiesta = this.richiesta;
        this.actionMezzo.emit(_mezzoAction);
    }

    onActionRichiesta(richiestaAction: RichiestaActionInterface) {
        richiestaAction.idRichiesta = this.richiesta.id;
        this.actionRichiesta.emit(richiestaAction);
    }
}
