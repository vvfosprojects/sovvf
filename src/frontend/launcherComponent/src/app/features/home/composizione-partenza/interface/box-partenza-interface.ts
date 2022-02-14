import { MezzoComposizione } from '../../../../shared/interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../../../../shared/interface/squadra-composizione-interface';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';
import { Coordinate } from '../../../../shared/model/coordinate.model';

export interface BoxPartenza {
    id: string;
    mezzoComposizione: MezzoComposizione;
    squadreComposizione: SquadraComposizione[];
}

export interface BoxPartenzaPreAccoppiati {
    id: string;
    codiceMezzo: string;
    genereMezzo: string;
    squadre: SquadraComposizione[];
    statoMezzo: StatoMezzo;
    descrizioneMezzo: string;
    km: string;
    tempoPercorrenza: string;
    distaccamento: string;
    appartenenza: string;
    coordinate: Coordinate;
}
