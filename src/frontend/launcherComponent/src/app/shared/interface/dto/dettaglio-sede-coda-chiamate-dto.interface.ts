import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Squadra } from '../../model/squadra.model';

export interface DettaglioSedeCodaChiamateDto {
    infoDistaccamento: InfoDistaccamento;
}

interface InfoDistaccamento {
    codDistaccamento: string;
    descDistaccamento: string;
    listaSintesi: SintesiRichiesta[];
    listaSquadre: Squadra[];
}
