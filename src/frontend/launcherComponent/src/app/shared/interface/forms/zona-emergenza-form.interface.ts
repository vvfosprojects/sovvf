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
}
