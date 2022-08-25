import { Component, Input } from '@angular/core';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';

@Component({
    selector: 'app-tipologia-sintesi-richiesta',
    templateUrl: './tipologia-sintesi-richiesta.component.html',
    styleUrls: ['./tipologia-sintesi-richiesta.component.scss']
})
export class TipologiaSintesiRichiestaComponent {

    @Input() tipologia: Tipologia;
    @Input() dettaglioTipologia: DettaglioTipologia;
    @Input() triage: boolean;

    methods = new HelperSintesiRichiesta();

    getTooltip(): string {
        if (this.dettaglioTipologia?.descrizione?.length <= 40) {
            return 'Tipologia: ' + this.tipologia?.descrizione;
        } else {
            return 'Dettaglio Tipologia: ' + this.dettaglioTipologia?.descrizione + 'Tipologia: ' + this.tipologia?.descrizione;
        }
    }

    checkDisableTooltipDettaglioTipologia(): boolean {
        return !this.dettaglioTipologia;
    }
}
