import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { ClassificazioneSchedaContatto } from '../enum/classificazione-scheda-contatto.enum';

export function markerColor(stato: string): string {
    const mapColorStato = new Map([
        ['chiam', '#dc3545'],
        ['asseg', '#ffc107'],
        ['sospe', '#ff8800'],
        ['presi', '#28a745'],
        ['insed', '#28a745'],
        ['invia', '#ffc107'],
        ['inrie', '#92b565'],
        ['sulpo', '#dc3545'],
        ['istit', '#868e96'],
    ]);
    const _stato = stato.split(' ').join('');
    const statoMarker = _stato.toLowerCase().substring(0, 5);
    const color = mapColorStato.get(statoMarker);
    return color ? color : '#343a40';
}

export function markerColorRichiesta(stato: StatoRichiesta): string {
    const mapColorStato = new Map([
        [StatoRichiesta.Chiamata, '#dc3545'],
        [StatoRichiesta.Assegnata, '#ffc107'],
        [StatoRichiesta.Sospesa, '#ff8800'],
        [StatoRichiesta.Presidiata, '#28a745'],
        [StatoRichiesta.Chiusa, '#868e96'],
    ]);
    const color = mapColorStato.get(stato);
    return color ? color : '#343a40';
}

/**
 * ritorna il colore di un marker scheda contatto
 * @param {string} stato
 * @returns {string}
 */
export function markerColorSC(stato: ClassificazioneSchedaContatto): string {
    const mapColorStato = new Map([
        [ClassificazioneSchedaContatto.Conoscenza, '#ffc107'],
        [ClassificazioneSchedaContatto.Differibile, '#868e96'],
        [ClassificazioneSchedaContatto.Competenza, '#dc3545']

    ]);
    return mapColorStato.get(stato);
}
