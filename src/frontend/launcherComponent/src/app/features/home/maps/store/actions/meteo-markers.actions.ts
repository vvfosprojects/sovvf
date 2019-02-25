// Models
import { MeteoMarker } from '../../maps-model/meteo-marker.model';

export class GetMeteoMarkers {
  static readonly type = '[MeteoMarkers] Get Meteo Markers';
}

export class AddMeteoMarker {
  static readonly type = '[MeteoMarkers] Add Meteo Marker';

  constructor(public marker: MeteoMarker[]) {}
}

export class RemoveMeteoMarker {
  static readonly type = '[MeteoMarkers] Remove Meteo Marker';
}
