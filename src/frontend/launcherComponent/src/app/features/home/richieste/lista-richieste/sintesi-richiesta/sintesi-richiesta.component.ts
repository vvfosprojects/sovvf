import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TimeagoIntl } from 'ngx-timeago';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { strings as italianStrings } from 'ngx-timeago/language-strings/it';

// Helper Methods
import { HelperSintesiRichiesta } from '../../helper/_helper-sintesi-richiesta';
import { StatoRichiesta } from 'src/app/shared/enum/stato-richiesta.enum';

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
export class SintesiRichiestaComponent implements OnInit {
    @Input() richiesta: SintesiRichiesta;
    @Input() fissata: boolean;
    @Input() fissabile: boolean;
    @Input() espanso: boolean;
    @Input() espandibile: boolean;
    @Input() listaEventi: boolean;
    @Input() partenza: boolean;
    @Input() composizionePartenza = true;
    @Input() modificabile = true;

    @Output() clickRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() doubleClickRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() fissaInAlto: EventEmitter<any> = new EventEmitter();
    @Output() eventiRichiesta: EventEmitter<string> = new EventEmitter();
    @Output() nuovaPartenza: EventEmitter<any> = new EventEmitter();
    @Output() dismissNuovaPartenza: EventEmitter<any> = new EventEmitter();
    @Output() modificaRichiesta: EventEmitter<SintesiRichiesta> = new EventEmitter();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEspanso: EventEmitter<boolean> = new EventEmitter();

    methods = new HelperSintesiRichiesta;
    isSingleClick = true;
    live = true;

    // Enum
    StatoRichiesta = StatoRichiesta;

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
}
