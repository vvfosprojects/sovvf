import { ComposizioneIdRichiesta } from '../composizione/composizione-id-richiesta-interface';
import { ComposizioneFilterbar } from '../composizione/composizione-filterbar-interface';
import { PaginationComposizione } from 'src/app/shared/interface/pagination-composizione.interface';

export interface FiltriComposizione extends ComposizioneFilterbar, ComposizioneIdRichiesta, PaginationComposizione {
}
