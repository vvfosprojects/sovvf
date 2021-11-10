import { ModuloColonnaMobile } from '../../../features/zone-emergenza/interface/modulo-colonna-mobile.interface';

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
    listaModuliImmediata?: ModuloColonnaMobile[];
    listaModuliConsolidamento?: ModuloColonnaMobile[];
    listaModuliPotInt?: ModuloColonnaMobile[];
}
