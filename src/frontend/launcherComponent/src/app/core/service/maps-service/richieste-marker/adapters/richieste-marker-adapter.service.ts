import { Injectable } from '@angular/core';
import { RichiestaMarker } from '../../../../../features/home/maps/maps-model/richiesta-marker.model';
import { IconUrl } from '../../../../../features/home/maps/maps-interface/icon-url-interface';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';

@Injectable()
export class RichiesteMarkerAdapterService {
    static adapt(item: any): RichiestaMarker {
        return new RichiestaMarker(
            item.id,
            item.codice,
            item.codiceRichiesta,
            item.localita,
            item.tipologie ? item.tipologie : item.tipologia,
            item.descrizione ? item.descrizione : item.label,
            item.prioritaRichiesta ? item.prioritaRichiesta : item.priorita,
            item.stato,
            item.rilevanza ? item.rilevanza : false,
            item.rilevanzaStArCu ? item.rilevanzaStArCu : false,
            RichiesteMarkerAdapterService.iconaRichiesta(item.stato, item.prioritaRichiesta ? item.prioritaRichiesta : item.priorita)
        );
    }

    static iconaRichiesta(stato: StatoRichiesta, priorita: number = 3): IconUrl {
        const mapIconeSizeNumber = new Map([
            [1, 32],
            [2, 40],
            [3, 48],
            [4, 56],
            [5, 64]
        ]);

        const mapIconeUrl = new Map([
            [StatoRichiesta.Chiamata, 'chiamata.png'],
            [StatoRichiesta.Assegnata, 'assegnata.png'],
            [StatoRichiesta.Presidiata, 'presidiata.png'],
            [StatoRichiesta.Sospesa, 'sospesa.png'],
            [StatoRichiesta.Chiusa, 'chiusa.png']
        ]);
        /**
         * metodo che mi ritorna l'url del' icona richiestaMarker da utilizzare
         */
        const statoRichiesta = mapIconeUrl.get(stato);
        if (!statoRichiesta) {
            return undefined;
        }
        const size = mapIconeSizeNumber.get(priorita);
        return {
            url: statoRichiesta,
            width: size,
            height: size
        };
    }

}


