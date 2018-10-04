export class TipoMappe {

    private modelMarker: [string, string][];
    private mapModelMarker: Map<string, string>;

    constructor() {
        this.marker();
    }

    private marker() {
        this.modelMarker = [
            ['RichiestaMarker', 'richiesta'],
            ['MezzoMarker', 'mezzo'],
            ['SedeMarker', 'sede']
        ];
        this.mapModelMarker = new Map(this.modelMarker);
    }

    markerType(marker) {
        return this.mapModelMarker.get(marker.constructor.name.toString());
    }

}
