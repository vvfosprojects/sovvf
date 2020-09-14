import { SequenzaValoriSelezionati } from './sequenza-modifica-partenza.interface';
import { MezzoComposizione } from './mezzo-composizione-interface';
import { Squadra } from '../model/squadra.model';

export interface ModificaPartenza {
    codRichiesta: string;
    annullamento: boolean;
    codMezzoDaAnnullare: string;
    codSquadreDaAnnullare: string[];
    mezzo: MezzoComposizione;
    squadre: Squadra[];
    motivazioneAnnullamento: string;
    sequenzaStati: SequenzaValoriSelezionati[];
}
