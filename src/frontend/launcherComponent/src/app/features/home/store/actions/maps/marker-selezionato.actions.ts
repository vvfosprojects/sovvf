
export class SetMarkerSelezionato {
  static readonly type = '[Marker Selezionato] Set Marker';

  constructor(public markedMarker: any) {}
}

export class ClearMarkerSelezionato {
  static readonly type = '[Marker Selezionato] Clear Marker';
}
