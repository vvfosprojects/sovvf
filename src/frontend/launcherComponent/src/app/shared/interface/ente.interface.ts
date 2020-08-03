export interface EnteCategoria {
    codice: string;
    descrizione: string;
    visibile: string;
    acronimo: string;
    cap: string;
}

export interface EnteTelefoni {
    codice: string;
    numero: number;
}

export interface AddEnteInterface {
    descrizione: string;
}

export interface Ente {
    codice: number;
    descrizione: string;
    codSede: string; 
    ricorsivo: boolean;
    enteCategoria: EnteCategoria;
    indirizzo: string;
    cap: string;
    codComune: number;
    siglaProvincia: string;
    zona: string; 
    noteEnte: string; 
    email: string; 
    telefoni: string[];
}

