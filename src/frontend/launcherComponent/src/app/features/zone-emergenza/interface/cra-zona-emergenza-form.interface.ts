import { Doa } from './doa.interface';

export interface CraZonaEmergenzaForm {
    nome: string;
    latitudine: number;
    longitudine: number;
    indirizzo: string;
    comandanteRegionale: string;
    responsabileDistrettoAreaColpita: string;
    responsabile: string;
    responsabileCampiBaseMezziOperativi: string;
    responsabileGestionePersonaleContratti: string;
    listaDoa?: Doa[];
}
