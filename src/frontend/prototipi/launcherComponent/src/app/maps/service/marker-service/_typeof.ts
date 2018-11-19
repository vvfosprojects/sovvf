export class TipoMappe {

    private modelMarker: [string, string][];
    private mapModelMarker: Map<string, string>;

    constructor() {
        this.marker();
    }

    private marker() {
        this.modelMarker = [
            ['id', 'richiesta'],
            ['coordinate', 'mezzo'],
            ['codice', 'sede']
        ];
        this.mapModelMarker = new Map(this.modelMarker);
    }

    markerType(marker) {
        const keyNames = Object.keys(marker);
        const markerModel = this.mapModelMarker.get(keyNames[0]);
        return markerModel;
    }

}
