import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { FiltroPeriodoChiuse } from '../filtro-chiuse-dettaglio.interface';

export interface FiltersRichieste {
    statiRichiesta?: StatoRichiesta[];
    filtroStato?: string[];
    zoneEmergenza?: string[];
    chiuse?: string[];
    periodoChiuseChiamate?: FiltroPeriodoChiuse;
    periodoChiusiInterventi?: FiltroPeriodoChiuse;
}
