import { Squadra} from 'src/app/shared/model/squadra.model';

export interface SquadraComposizione {
    id: string;
    squadra: Squadra;
    selezionato: boolean;
    hover: boolean;
}
