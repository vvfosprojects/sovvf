import { ComposizioneCodiceMezzo } from '../composizione/composizione-codice-mezzo-interface';
import { ComposizioneCodiceSquadra } from '../composizione/composizione-codice-squadra-interface';
import { ComposizioneIdRichiesta } from '../composizione/composizione-id-richiesta-interface';
import { ComposizioneFilterbar } from '../composizione/composizione-filterbar-interface';

export interface FiltriComposizione extends ComposizioneFilterbar, ComposizioneIdRichiesta {
}
