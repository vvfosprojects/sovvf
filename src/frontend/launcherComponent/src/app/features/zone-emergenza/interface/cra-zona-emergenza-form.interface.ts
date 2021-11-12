import { Doa } from './doa.interface';

export interface CraZonaEmergenzaForm {
    codice?: string;
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
