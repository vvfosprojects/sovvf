export interface CategoriaEnte {
    codice: string;
    descrizione: string;
    visibile: string;
    acronimo: string;
    cap: string;
}

export interface EnteTelefoni {
    tipo: string;
    numero: string;
}

export interface AddEnteInterface {
    descrizione: string;
}

export interface Ente {
    codice: number;
    descrizione: string;
    codSede: string; 
    ricorsivo: boolean;
    enteCategoria: CategoriaEnte;
    indirizzo: string;
    cap: string;
    codComune?: number;
    siglaProvincia?: string;
    zona?: string; 
    noteEnte: string; 
    email: string; 
    telefoni: EnteTelefoni[];
}

