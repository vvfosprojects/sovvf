import { Pipe, PipeTransform } from '@angular/core';
import { SintesiRichiesteService } from '../../core/service/lista-richieste-service/lista-richieste.service';
import { MezzoComposizione } from '../interface/mezzo-composizione-interface';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { StatoMezzo } from '../enum/stato-mezzo.enum';
import * as moment from 'moment';

@Pipe({
    name: 'mezzoInRientroDisabled',
    pure: false
})
export class MezzoInRientroDisabledPipe implements PipeTransform {

    richiesta: SintesiRichiesta;
    loadingRichiesta: boolean;

    constructor(private sintesiRichiesteService: SintesiRichiesteService) {
    }

    transform(mezzoComposizione: MezzoComposizione): any {
        const idRichiesta = mezzoComposizione.mezzo.idRichiesta;
        if (!idRichiesta || !mezzoComposizione) {
            return false;
        }

        if ((!this.loadingRichiesta) && (!this.richiesta || (this.richiesta?.codice !== mezzoComposizione.mezzo.idRichiesta))) {
            this.loadingRichiesta = true;
            this.sintesiRichiesteService.getRichiestaById(idRichiesta).subscribe((r: SintesiRichiesta) => {
                this.richiesta = r;
                this.loadingRichiesta = false;
                const minutesDiff = getMinutesDiff(this.richiesta);
                return minutesDiff > -1;
            });
        } else if (this.richiesta && this.richiesta?.codice === mezzoComposizione.mezzo.idRichiesta) {
            const minutesDiff = getMinutesDiff(this.richiesta);
            return minutesDiff > -1;
        }

        return true;

        function getMinutesDiff(richiesta: SintesiRichiesta): number {
            const eventoCambioStato = richiesta.eventi.filter((evento: any) => evento.codiceMezzo === mezzoComposizione.mezzo.codice && evento.stato === StatoMezzo.InRientro)[0];
            if (eventoCambioStato) {
                const dataCambioStato = new Date(eventoCambioStato.ora);
                const ora = new Date();
                const oraMoment = moment(ora);
                const dataCambioStatoMoment = moment(dataCambioStato);
                return dataCambioStatoMoment.diff(oraMoment, 'minutes');
            }
            return 0;
        }
    }
}
