export interface EnteCategorie {
    codice: string;
    descrizione: string;
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
    codCategoria: number;
    indirizzo: string;
    cap: string;
    codComune: number;
    siglaProvincia: string;
    zona: string; 
    noteEnte: string; 
    email: string; 
    telefoni: string[];
}

