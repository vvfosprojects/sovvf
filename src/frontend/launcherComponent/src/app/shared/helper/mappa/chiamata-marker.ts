import { Localita } from '../../model/localita.model';
import { ChiamataMarker } from '../../../features/maps/maps-model/chiamata-marker.model';
import { Utente } from '../../model/utente.model';

export function createChiamataMarker(id: string, operatore: Utente, sedeSelezionata: string, localita: Localita, label?: string, mySelf?: boolean, competenze?: string[]): ChiamataMarker {
    return new ChiamataMarker(
        id,
        `${operatore.nome} ${operatore.cognome}`,
        sedeSelezionata,
        localita,
        label,
        mySelf,
        competenze
    );
}
