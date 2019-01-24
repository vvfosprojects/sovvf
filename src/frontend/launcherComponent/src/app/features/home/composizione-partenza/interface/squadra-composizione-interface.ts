import { SquadraProvvisorio } from 'src/app/shared/model/squadra.provvisorio.model';

export interface SquadraComposizione {
    id: string;
    squadra: SquadraProvvisorio;
    selezionato: boolean;
    hover: boolean;
}
