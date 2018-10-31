import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoIntl } from 'ngx-timeago';

import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';

import { LayoutMethods } from './_layout-methods';

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
    @Input() richiesta: SintesiRichiesta;
    @Input() fissata: boolean;

    methods = new LayoutMethods;
    espanso = false;
    isSingleClick = true;
    live: any;

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
        this.espanso = !this.espanso;
    }

    /* NgClass Methods */
    statusClass(richiesta) {
        return this.methods.statusClass(richiesta);
    }
    complessitaClass(richiesta) {
        return this.methods.complessitaClass(richiesta);
    }

    /* Eventi */
    richiestaClick(richiesta) {
        if (richiesta) {
            this.isSingleClick = true;
            setTimeout(() => {
                if (this.isSingleClick) {
                    this.clickRichiesta.emit(richiesta);
                }
            }, 250);
        }
    }
    richiestaDoubleClick(richiesta) {
        if (richiesta) {
            this.isSingleClick = false;
            this.toggleEspanso();
            this.doubleClickRichiesta.emit(richiesta);
        }
    }
    fissaClick(richiesta) {
        if (richiesta) {
            this.fissaInAlto.emit(richiesta);
        }
    }
    visualizzaEventiRichiesta(richiesta) {
        this.eventiRichiesta.emit(richiesta);
    }
    invioPartenza(id) {
        console.log('invio partenza');
    }
}
