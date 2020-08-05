export interface CategoriaVoceRubrica {
    codice: string;
    descrizione: string;
    visibile: string;
    acronimo: string;
    cap: string;
}

export enum TipoTelefono {
    Telefono = 'Telefono',
    Fax = 'Fax'
}

export interface VoceRubricaTelefono {
    tipo: TipoTelefono;
    numero: string;
}

export interface AddVoceRubricaInterface {
    descrizione: string;
    ricorsivo: boolean;
    codCategoria: number;
    indirizzo: string;
    cap: string;
    noteEnte?: string;
    email?: string;
    telefoni: VoceRubricaTelefono[];
}

export interface UpdateVoceRubricaInterface {
    codice: string;
    descrizione: string;
}

export interface VoceRubrica {
    id: string;
    codice: number;
    descrizione: string;
    codSede: string;
    ricorsivo: boolean;
    enteCategoria: CategoriaVoceRubrica;
    indirizzo: string;
    cap: string;
    telefoni: VoceRubricaTelefono[];
    noteEnte?: string;
    email?: string;
    codComune?: number;
    siglaProvincia?: string;
    zona?: string;
}

