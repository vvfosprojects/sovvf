export function markerColor(stato: string): string {
    const mapColorStato = new Map([
        ['chiam', '#dc3545'],
        ['asseg', '#ffc107'],
        ['sospe', '#ff8800'],
        ['presi', '#28a745'],
        ['insed', '#6c757d'],
        ['invia', '#17a2b8'],
        ['inrie', '#007bff'],
        ['sulpo', '#28a745'],
        ['istit', '#ffc107'],
    ]);
    const _stato = stato.split(' ').join('');
    const statoMarker = _stato.toLowerCase().substring(0, 5);
    const color = mapColorStato.get(statoMarker);
    return color ? color : '#343a40';

}
