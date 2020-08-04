export interface CategoriaVoceRubrica {
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

export interface AddVoceRubricaInterface {
    descrizione: string;
}

export interface VoceRubrica {
    codice: number;
    descrizione: string;
    codSede: string;
    ricorsivo: boolean;
    enteCategoria: CategoriaVoceRubrica;
    indirizzo: string;
    cap: string;
    codComune: number;
    siglaProvincia: string;
    zona: string;
    noteEnte: string;
    email: string;
    telefoni: EnteTelefoni[];
}

