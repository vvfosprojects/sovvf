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
        item.tipologia,
        item.label,
        item.prioritaRichiesta,
        item.stato,
        item.rilevanza,
        item.rilevanzaStArCu
    );
  }
}
