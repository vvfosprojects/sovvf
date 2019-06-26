import { Injectable } from '@angular/core';
import { RichiestaMarker } from '../../../../../features/home/maps/maps-model/richiesta-marker.model';

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
        item.rilevanza,
        item.rilevanzaStArCu
    );
  }
}
