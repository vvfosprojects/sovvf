export interface CategoriaVoceRubrica {
    codice: string;
    descrizione: string;
    visibile: string;
    acronimo: string;
    cap: string;
}

export interface VoceRubricaTelefoni {
    tipo: string;
    numero: string;
}

export interface AddVoceRubricaInterface {
    descrizione: string;
    codSede: string;
    ricorsivo: boolean;
    codCategoria: number;
    indirizzo: string;
    cap: string;
    noteEnte?: string;
    email?: string;
    telefoni: VoceRubricaTelefoni[];
}

export interface UpdateVoceRubricaInterface {
    codice: string;
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
    telefoni: VoceRubricaTelefoni[];
    noteEnte?: string;
    email?: string;
    codComune?: number;
    siglaProvincia?: string;
    zona?: string;
}

