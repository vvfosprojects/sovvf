import { ComposizioneIdRichiesta } from '../composizione/composizione-id-richiesta-interface';
import { ComposizioneFilterbar } from '../composizione/composizione-filterbar-interface';
import { PaginationComposizioneAvanzata } from 'src/app/shared/interface/pagination-composizione-avanzata.interface';
import { PaginationComposizioneVeloce } from '../../../../../shared/interface/pagination-composizione-veloce.interface';

export interface FiltriComposizione extends ComposizioneFilterbar, ComposizioneIdRichiesta, PaginationComposizioneAvanzata, PaginationComposizioneVeloce {
}
