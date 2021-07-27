import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { Mezzo } from 'src/app/shared/model/mezzo.model';
import { SquadraComposizione } from './squadra-composizione-interface';

export interface MezzoComposizione {
    id: string;
    mezzo: Mezzo;
    km: string;
    coordinate?: Coordinate;
    tempoPercorrenza: string;
    idRichiesta?: string;
    squadrePreaccoppiate?: SquadraComposizione[];
    listaSquadre?: SquadraComposizione[];
    indirizzoIntervento?: string;
}

// Modello MezzoPreaccoppiato che manda il BE presenta le seguenti proprietà ma NON dentro l'oggetto 'mezzo'.
export interface MezzoPreaccoppiato {
    mezzo: {
        codice: string;
        descrizione: string;
        genere: string;
        stato: string;
        distaccamento: string;
    };
}
