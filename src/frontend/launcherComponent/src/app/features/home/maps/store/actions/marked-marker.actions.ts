
export class SetMarkedMarker {
  static readonly type = '[MarkedMarker] Set Marked Marker';

  constructor(public markedMarker: any) {}
}

export class ClearMarkedMarker {
  static readonly type = '[MarkedMarker] Clear Marked Marker';
}
