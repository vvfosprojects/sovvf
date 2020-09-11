import { SequenzaValoriSelezionati } from './sequenza-modifica-partenza.interface';
import { MezzoComposizione } from './mezzo-composizione-interface';
import { SquadraComposizione } from './squadra-composizione-interface';

export interface ModificaPartenza {
    codRichiesta: string;
    annullamento: boolean;
    codMezzoDaAnnullare: string;
    codSquadreDaAnnullare: string[];
    mezzo: MezzoComposizione;
    squadre: SquadraComposizione[];
    motivazioneAnnullamento: string;
    sequenzaStati: SequenzaValoriSelezionati[];
}
