import { MezzoComposizione } from './mezzo-composizione-interface';
import { SquadraComposizione } from './squadra-composizione-interface';

export interface ListaComposizioneAvanzata {
    composizioneMezziDataArray: MezzoComposizione[];
    composizioneSquadreDataArray: SquadraComposizione[];
}
