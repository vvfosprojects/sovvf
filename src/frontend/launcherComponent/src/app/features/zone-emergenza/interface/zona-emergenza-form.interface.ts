import { ModuloColonnaMobile } from './modulo-colonna-mobile.interface';

export interface ZonaEmergenzaForm {
    indirizzo: string;
    latitudine: number;
    longitudine: number;
    tipologia: string;
    descrizione: string;
    id?: string;
    codEmergenza?: string;
    codComandoRichiedente?: string;
    listaEventi?: any[];
    annullata?: boolean;
    allertata?: boolean;
    listaModuliImmediata?: ModuloColonnaMobile[];
    listaModuliConsolidamento?: ModuloColonnaMobile[];
    listaModuliPotInt?: ModuloColonnaMobile[];
    comandanteRegionale?: string;
    responsabileDistrettoAreaColpita?: string;
    responsabile?: string;
    responsabileCampiBaseMezziOperativi?: string;
    responsabileGestionePersonaleContratti?: string;
}
