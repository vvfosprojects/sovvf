import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoIntl } from 'ngx-timeago';

// Model
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';

// Helper Methods
import { HelperMethods } from '../../helper/_helper-methods';

@Component({
    selector: 'app-sintesi-richiesta',
    templateUrl: './sintesi-richiesta.component.html',
    styleUrls: ['./sintesi-richiesta.component.css'],
    providers: [
        NgbPopoverConfig,
        NgbTooltipConfig
    ],
})
export class SintesiRichiestaComponent implements OnInit {
    @Output() clickRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() doubleClickRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() fissaInAlto: EventEmitter<any> = new EventEmitter();
    @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() nuovaPartenza: EventEmitter<any> = new EventEmitter();
    @Output() dismissNuovaPartenza: EventEmitter<any> = new EventEmitter();
    @Input() richiesta: SintesiRichiesta;
    @Input() fissata: boolean;
    @Input() fissabile: boolean;
    @Input() espanso: boolean;
    @Input() espandibile: boolean;
    @Input() listaEventi: boolean;
    @Input() partenza: boolean;

    methods = new HelperMethods;
    isSingleClick = true;
    live = true;

    constructor(popoverConfig: NgbPopoverConfig,
        tooltipConfig: NgbTooltipConfig,
        intl: TimeagoIntl) {

        intl.strings = italianStrings;
        intl.changes.next();

        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    ngOnInit() {
    }

    /* Layout Methods */
    toggleEspanso(): void {
        if (this.espandibile) {
            this.espanso = !this.espanso;
        }
    }

    complessitaClass(richiesta: any) {
        return this.methods.complessitaClass(richiesta);
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
    visualizzaEventiRichiesta(richiesta: any) {
        this.eventiRichiesta.emit(richiesta);
    }
    invioPartenza(richiesta: any) {
        if (this.partenza) {
            this.dismissNuovaPartenza.emit();
        } else {
            this.nuovaPartenza.emit(richiesta);
        }
    }
}
