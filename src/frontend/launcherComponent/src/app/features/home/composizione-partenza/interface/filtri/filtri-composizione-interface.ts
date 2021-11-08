import { ComposizioneFilterbar } from '../composizione/composizione-filterbar-interface';
import { PaginationComposizioneAvanzata } from 'src/app/shared/interface/pagination-composizione-avanzata.interface';
import { PaginationComposizioneVeloce } from '../../../../../shared/interface/pagination-composizione-veloce.interface';
import { ComposizioneCodiceChiamata } from '../composizione/composizione-codice-chiamata-interface';

export interface FiltriComposizione extends ComposizioneFilterbar, PaginationComposizioneAvanzata, PaginationComposizioneVeloce, ComposizioneCodiceChiamata {
}
