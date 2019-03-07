export class SetMarkerSelezionato {
    static readonly type = '[Marker] Set Marker Selezionato';

    constructor(public markedMarker: any) {
    }
}

export class ClearMarkerSelezionato {
    static readonly type = '[Marker] Clear Marker Selezionato';
}

// export class SetMarkerColorato {
//     static readonly type = '[Marker] Set Marker Colorato';
//
//     constructor(public markerColorato: any) {
//     }
// }
//
// export class ClearMarkerColorato {
//     static readonly type = '[Marker] Clear Marker Colorato';
// }
//
// export class SetMarkerZIndex {
//     static readonly type = '[Marker] Set Marker ZIndex';
//
//     constructor(public markerZIndex: any) {
//     }
// }
//
// export class ClearMarkerZIndex {
//     static readonly type = '[Marker] Clear Marker ZIndex';
// }
