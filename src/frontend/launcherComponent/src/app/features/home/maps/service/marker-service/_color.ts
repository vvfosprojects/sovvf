export class TipoColori {

    private colorStato: [string, string][];
    private mapColorStato: Map<string, string>;

    constructor() {
        this.color();
    }

    private color() {
        this.colorStato = [
            ['chiam', '#dc3545'],
            ['asseg', '#17a2b8'],
            ['sospe', '#ffc107'],
            ['presi', '#28a745'],
            ['insed', '#6c757d'],
            ['invia', '#17a2b8'],
            ['inrie', '#007bff'],
            ['sulpo', '#28a745'],
            ['istit', '#ffc107'],
        ];
        this.mapColorStato = new Map(this.colorStato);
    }

    markerColor(stato) {
        const statoMarker = stato.toLowerCase().substring(0, 5);
        const color = this.mapColorStato.get(statoMarker);
        return color ? color : '#343a40';
    }

}